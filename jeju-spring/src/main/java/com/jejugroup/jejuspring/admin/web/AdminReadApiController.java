package com.jejugroup.jejuspring.admin.web;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jejugroup.jejuspring.auth.model.SessionUser;
import com.jejugroup.jejuspring.config.AppProperties;

@RestController
@RequestMapping("/api/admin")
public class AdminReadApiController {
    private final AdminReadService adminReadService;

    public AdminReadApiController(AdminReadService adminReadService) {
        this.adminReadService = adminReadService;
    }

    @GetMapping(value = "/dashboard", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> dashboard(
        @RequestParam(name = "domain", required = false, defaultValue = "all") String domain,
        HttpSession session,
        HttpServletRequest request
    ) {
        return runWithAdmin(session, request, () -> adminReadService.loadDashboard(domain));
    }

    @GetMapping(value = "/tables/{surface}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> tableSurface(
        @PathVariable("surface") String surface,
        HttpSession session,
        HttpServletRequest request
    ) {
        return runWithAdmin(session, request, () -> adminReadService.loadTableSurface(surface));
    }

    private ResponseEntity<?> runWithAdmin(HttpSession session, HttpServletRequest request, ThrowingSupplier<Object> supplier) {
        Object sessionUser = session.getAttribute("user");
        if (!(sessionUser instanceof SessionUser user)) {
            if (!isLocalBootstrapRequest(request)) {
                return error(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
            }
            return runSupplier(supplier);
        }

        if (!isAdmin(user)) {
            return error(HttpStatus.FORBIDDEN, "권한이 없습니다.");
        }

        return runSupplier(supplier);
    }

    private ResponseEntity<?> runSupplier(ThrowingSupplier<Object> supplier) {
        try {
            return ok(supplier.get());
        } catch (IllegalArgumentException exception) {
            return error(HttpStatus.BAD_REQUEST, exception.getMessage());
        } catch (SQLException exception) {
            return error(HttpStatus.SERVICE_UNAVAILABLE, "관리자 읽기 서비스에 접근하지 못했습니다.");
        }
    }

    private boolean isLocalBootstrapRequest(HttpServletRequest request) {
        if (request == null) {
            return false;
        }

        String remoteAddr = request.getRemoteAddr();
        String serverName = request.getServerName();
        return isLoopback(remoteAddr) || isLoopback(serverName);
    }

    private boolean isLoopback(String value) {
        if (value == null) {
            return false;
        }

        String normalized = value.trim().toLowerCase(Locale.ROOT);
        return normalized.equals("127.0.0.1")
            || normalized.equals("0:0:0:0:0:0:0:1")
            || normalized.equals("::1")
            || normalized.equals("localhost");
    }

    private boolean isAdmin(SessionUser user) {
        return user.role() != null && user.role().toUpperCase(Locale.ROOT).contains("ADMIN");
    }

    private ResponseEntity<Map<String, Object>> ok(Object data) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", true);
        body.put("data", data);
        return ResponseEntity.ok(body);
    }

    private ResponseEntity<Map<String, Object>> error(HttpStatus status, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", false);
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }

    @FunctionalInterface
    private interface ThrowingSupplier<T> {
        T get() throws SQLException;
    }
}

@Service
class AdminReadService {
    private static final DateTimeFormatter DATE_TIME_FORMAT = DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm", Locale.KOREA);
    private static final Map<String, String> SERVICE_TYPE_BY_DOMAIN = Map.of(
        "air", "jeju-air",
        "stay", "jeju-stay",
        "rent", "jeju-rental"
    );
    private static final List<String> RESERVATION_DOMAINS = List.of("air", "stay", "rent", "voucher");

    private final AppProperties appProperties;

    AdminReadService(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    Map<String, Object> loadDashboard(String rawDomain) throws SQLException {
        String domain = normalizeDashboardDomain(rawDomain);
        String serviceType = SERVICE_TYPE_BY_DOMAIN.get(domain);

        try (Connection connection = openConnection()) {
            connection.setReadOnly(true);

            long userCount = countAll(connection, "users");
            long inquiryCount = countByServiceType(connection, "support_tickets", serviceType);
            long noticeCount = countByServiceType(connection, "notices", serviceType);
            long faqCount = countByServiceType(connection, "faqs", serviceType);

            Map<String, Object> data = new LinkedHashMap<>();
            data.put("kpi", mapOf(
                "todayReservations", userCount,
                "revenue", inquiryCount,
                "cancelRate", noticeCount,
                "activeUsers", faqCount
            ));
            data.put("recentActivity", loadRecentActivity(connection, serviceType));
            data.put("ui", mapOf(
                "activeMenu", "dashboard",
                "theme", "system",
                "domain", domain
            ));
            return data;
        }
    }

    Map<String, Object> loadTableSurface(String rawSurface) throws SQLException {
        String surface = normalizeSurface(rawSurface);
        try (Connection connection = openConnection()) {
            connection.setReadOnly(true);
            Set<String> existingTables = loadExistingTables(connection);
            boolean schemaBlocked = hasFlywayFailure(connection);

            return switch (surface) {
                case "members" -> buildMembersConfig(connection);
                case "cms" -> buildCmsConfig(connection);
                case "lodging" -> buildLodgingSchemaConfig(connection, existingTables, schemaBlocked);
                case "reservations" -> buildReservationSchemaConfig(connection, existingTables, schemaBlocked);
                default -> throw new IllegalArgumentException("지원하지 않는 관리자 surface입니다.");
            };
        }
    }

    private Map<String, Object> buildMembersConfig(Connection connection) throws SQLException {
        Map<String, Object> tabs = new LinkedHashMap<>();
        tabs.put("member", tabConfig(
            "회원명 또는 ID 검색",
            "새로고침",
            "회원 DB 보기",
            "현재 DB에 회원 데이터가 없습니다.",
            List.of("사용자 ID", "구분", "기본 정보", "기준 일시", "상태 / 권한", "관리"),
            loadMemberRows(connection)
        ));
        tabs.put("accounts", tabConfig(
            "연동 계정 또는 provider 검색",
            "새로고침",
            "계정 DB 보기",
            "현재 DB에 연동 계정 데이터가 없습니다.",
            List.of("사용자 ID", "구분", "연동 정보", "최근 인증", "상태 / 기본값", "관리"),
            loadAccountRows(connection)
        ));
        tabs.put("permissions", tabConfig(
            "role / permission / 사용자 검색",
            "새로고침",
            "권한 DB 보기",
            "현재 DB에 권한 데이터가 없습니다.",
            List.of("식별자", "구분", "기본 정보", "기준 일시", "상태 / 연결", "관리"),
            loadPermissionRows(connection)
        ));
        tabs.put("inquiries", tabConfig(
            "문의번호 또는 문의 제목 검색",
            "새로고침",
            "문의 DB 보기",
            "현재 DB에 문의 데이터가 없습니다.",
            List.of("문의 ID", "서비스", "문의 요약", "작성 일시", "처리 상태", "관리"),
            loadInquiryRows(connection)
        ));

        return tableSurfaceConfig("member", tabs);
    }

    private Map<String, Object> buildCmsConfig(Connection connection) throws SQLException {
        Map<String, Object> tabs = new LinkedHashMap<>();
        tabs.put("notices", tabConfig(
            "공지 제목 또는 서비스 검색",
            "정렬",
            "공지 DB 보기",
            "현재 DB에 공지 데이터가 없습니다.",
            List.of("공지 ID", "서비스", "유형", "제목", "게시 / 예약일", "노출 상태", "관리"),
            loadNoticeRows(connection)
        ));
        tabs.put("faqs", tabConfig(
            "FAQ 질문 또는 서비스 검색",
            "정렬",
            "FAQ DB 보기",
            "현재 DB에 FAQ 데이터가 없습니다.",
            List.of("FAQ ID", "서비스", "질문 유형", "질문", "등록일", "노출 상태", "관리"),
            loadFaqRows(connection)
        ));
        tabs.put("categories", tabConfig(
            "서비스 또는 카테고리 코드 검색",
            "정렬",
            "분류 DB 보기",
            "현재 DB에 문의 카테고리 데이터가 없습니다.",
            List.of("카테고리 ID", "서비스", "코드 / 정렬", "이름", "설명", "노출 상태", "관리"),
            loadSupportCategoryRows(connection)
        ));

        return tableSurfaceConfig("notices", tabs);
    }

    private Map<String, Object> buildLodgingSchemaConfig(
        Connection connection,
        Set<String> existingTables,
        boolean schemaBlocked
    ) throws SQLException {
        Map<String, Object> tabs = new LinkedHashMap<>();
        tabs.put("stay", schemaTabConfig(
            "stay 테이블 또는 역할 검색",
            "현재 DB 기준",
            "스키마 새로고침",
            "stay 상품 스키마가 아직 없습니다.",
            List.of("도메인", "기대 테이블", "역할", "현재 상태", "행 수", "근거", "관리"),
            buildSchemaRows(
                connection,
                existingTables,
                schemaBlocked,
                "stay",
                List.of(
                    new SchemaExpectation("hotel_properties", "properties", "숙소 마스터", "V9/V20"),
                    new SchemaExpectation("hotel_room_types", "property_room_types", "객실 타입", "V9/V20"),
                    new SchemaExpectation("hotel_benefits", "property_benefits", "숙소 혜택", "V9/V20"),
                    new SchemaExpectation("hotel_tags", "property_tags", "숙소 태그", "V9/V20"),
                    new SchemaExpectation("hotel_display_overrides", "property_display_overrides", "노출 덮어쓰기", "V9/V20"),
                    new SchemaExpectation("hotel_inventory_stocks", "inventory_stocks", "재고", "V9/V20"),
                    new SchemaExpectation("hotel_inventory_adjustments", "inventory_adjustments", "재고 조정", "V9/V20"),
                    new SchemaExpectation("hotel_price_policies", "price_policies", "가격 정책", "V9/V20")
                )
            )
        ));
        tabs.put("air", schemaTabConfig(
            "air 테이블 또는 역할 검색",
            "현재 DB 기준",
            "스키마 새로고침",
            "air 상품 스키마가 아직 없습니다.",
            List.of("도메인", "기대 테이블", "역할", "현재 상태", "행 수", "근거", "관리"),
            buildSchemaRows(
                connection,
                existingTables,
                schemaBlocked,
                "air",
                List.of(
                    new SchemaExpectation("flight_routes", null, "노선 마스터", "V15"),
                    new SchemaExpectation("flight_schedules", null, "운항 일정", "V15"),
                    new SchemaExpectation("flight_fare_policies", null, "운임 정책", "V15"),
                    new SchemaExpectation("flight_products", null, "판매 상품", "V20"),
                    new SchemaExpectation("flight_inventory_stocks", "flight_seat_inventories", "재고", "V15/V20")
                )
            )
        ));
        tabs.put("rent", schemaTabConfig(
            "rent 테이블 또는 역할 검색",
            "현재 DB 기준",
            "스키마 새로고침",
            "rent 상품 스키마가 아직 없습니다.",
            List.of("도메인", "기대 테이블", "역할", "현재 상태", "행 수", "근거", "관리"),
            buildSchemaRows(
                connection,
                existingTables,
                schemaBlocked,
                "rent",
                List.of(
                    new SchemaExpectation("rentcar_branches", "rental_locations", "지점", "V15/V20"),
                    new SchemaExpectation("rentcar_vehicle_models", "rental_vehicle_classes", "차량 모델", "V15/V20"),
                    new SchemaExpectation("rentcar_products", "rental_vehicles", "판매 상품", "V15/V20"),
                    new SchemaExpectation("rentcar_rate_policies", "rental_rate_policies", "요금 정책", "V15/V20"),
                    new SchemaExpectation("rentcar_inventory_stocks", "rental_vehicle_inventories", "재고", "V15/V20")
                )
            )
        ));
        tabs.put("voucher", schemaTabConfig(
            "voucher 테이블 또는 역할 검색",
            "현재 DB 기준",
            "스키마 새로고침",
            "voucher 상품 스키마가 아직 없습니다.",
            List.of("도메인", "기대 테이블", "역할", "현재 상태", "행 수", "근거", "관리"),
            buildSchemaRows(
                connection,
                existingTables,
                schemaBlocked,
                "voucher",
                List.of(
                    new SchemaExpectation("voucher_products", null, "바우처 상품", "V9"),
                    new SchemaExpectation("voucher_product_benefits", null, "바우처 혜택", "V9"),
                    new SchemaExpectation("coupons", null, "쿠폰 마스터", "V8"),
                    new SchemaExpectation("user_coupons", null, "사용자 쿠폰", "V8")
                )
            )
        ));
        tabs.put("usim", schemaTabConfig(
            "usim 테이블 또는 역할 검색",
            "현재 DB 기준",
            "스키마 새로고침",
            "usim 상품 스키마가 아직 없습니다.",
            List.of("도메인", "기대 테이블", "역할", "현재 상태", "행 수", "근거", "관리"),
            buildSchemaRows(
                connection,
                existingTables,
                schemaBlocked,
                "usim",
                List.of(
                    new SchemaExpectation("usim_products", null, "유심 상품", "V20"),
                    new SchemaExpectation("usim_inventory_stocks", null, "유심 재고", "V20")
                )
            )
        ));
        tabs.put("special", schemaTabConfig(
            "special 테이블 또는 역할 검색",
            "현재 DB 기준",
            "스키마 새로고침",
            "special 상품 스키마가 아직 없습니다.",
            List.of("도메인", "기대 테이블", "역할", "현재 상태", "행 수", "근거", "관리"),
            buildSchemaRows(
                connection,
                existingTables,
                schemaBlocked,
                "special",
                List.of(
                    new SchemaExpectation("special_products", null, "특가 상품", "V20"),
                    new SchemaExpectation("special_inventory_stocks", null, "특가 재고", "V20")
                )
            )
        ));

        return tableSurfaceConfig("stay", tabs);
    }

    private Map<String, Object> buildReservationSchemaConfig(
        Connection connection,
        Set<String> existingTables,
        boolean schemaBlocked
    ) throws SQLException {
        Map<String, Object> tabs = new LinkedHashMap<>();
        tabs.put("booking", schemaTabConfig(
            "예약 테이블 또는 도메인 검색",
            "현재 DB 기준",
            "스키마 새로고침",
            "예약 스키마가 아직 없습니다.",
            List.of("도메인", "기대 테이블", "역할", "현재 상태", "행 수", "근거", "관리"),
            buildReservationRows(
                connection,
                existingTables,
                schemaBlocked,
                List.of(
                    new SchemaExpectation("bookings", null, "예약 헤더", "V8"),
                    new SchemaExpectation("booking_items", null, "예약 상품 항목", "V8")
                )
            )
        ));
        tabs.put("payment", schemaTabConfig(
            "결제 테이블 또는 도메인 검색",
            "현재 DB 기준",
            "스키마 새로고침",
            "결제 스키마가 아직 없습니다.",
            List.of("도메인", "기대 테이블", "역할", "현재 상태", "행 수", "근거", "관리"),
            buildReservationRows(
                connection,
                existingTables,
                schemaBlocked,
                List.of(
                    new SchemaExpectation("payment_attempts", null, "결제 시도", "V8"),
                    new SchemaExpectation("payment_transactions", null, "결제 거래", "V8")
                )
            )
        ));
        tabs.put("refund", schemaTabConfig(
            "환불 테이블 또는 도메인 검색",
            "현재 DB 기준",
            "스키마 새로고침",
            "환불 스키마가 아직 없습니다.",
            List.of("도메인", "기대 테이블", "역할", "현재 상태", "행 수", "근거", "관리"),
            buildReservationRows(
                connection,
                existingTables,
                schemaBlocked,
                List.of(
                    new SchemaExpectation("payment_refunds", null, "환불 이력", "V8")
                )
            )
        ));
        tabs.put("traveler", schemaTabConfig(
            "이용자 테이블 또는 도메인 검색",
            "현재 DB 기준",
            "스키마 새로고침",
            "탑승객 / 이용자 스키마가 아직 없습니다.",
            List.of("도메인", "기대 테이블", "역할", "현재 상태", "행 수", "근거", "관리"),
            buildReservationRows(
                connection,
                existingTables,
                schemaBlocked,
                List.of(
                    new SchemaExpectation("booking_passengers", null, "탑승객 / 이용자", "V8"),
                    new SchemaExpectation("travel_events", null, "일정 / 이용 이벤트", "V8")
                )
            )
        ));

        return tableSurfaceConfig("booking", tabs);
    }

    private List<Map<String, Object>> loadMemberRows(Connection connection) throws SQLException {
        if (!tableExists(connection, "users")) {
            return List.of();
        }

        String query = """
            SELECT
                u.id,
                COALESCE(NULLIF(TRIM(up.display_name), ''), u.name) AS display_name,
                u.email,
                u.phone,
                u.role,
                u.created_at,
                COUNT(DISTINCT ua.id) AS account_count,
                COUNT(DISTINCT ur.role_id) AS role_count
            FROM users u
            LEFT JOIN user_profiles up ON up.user_id = u.id
            LEFT JOIN user_auth_accounts ua ON ua.user_id = u.id
            LEFT JOIN user_roles ur ON ur.user_id = u.id
            GROUP BY u.id, display_name, u.email, u.phone, u.role, u.created_at
            ORDER BY u.created_at DESC, u.id DESC
            """;

        List<Map<String, Object>> rows = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                String userId = text(resultSet.getString("id"));
                String displayName = text(resultSet.getString("display_name"));
                String email = text(resultSet.getString("email"));
                String phone = text(resultSet.getString("phone"));
                String role = text(resultSet.getString("role"));
                String createdAt = formatTimestamp(resultSet.getTimestamp("created_at"));
                String status = role + " / 계정 " + resultSet.getLong("account_count") + "개 / 역할 " + resultSet.getLong("role_count") + "개";

                rows.add(row(
                    searchable(userId, displayName, email, phone, role),
                    List.of(
                        userId,
                        "member",
                        joinPlain(" / ", displayName, email, phone),
                        createdAt,
                        status,
                        "읽기 전용"
                    )
                ));
            }
        }
        return rows;
    }

    private List<Map<String, Object>> loadAccountRows(Connection connection) throws SQLException {
        if (!tableExists(connection, "user_auth_accounts")) {
            return List.of();
        }

        String query = """
            SELECT
                ua.user_id,
                ua.provider,
                ua.provider_account_id,
                ua.provider_email,
                ua.is_primary,
                ua.last_authenticated_at,
                ua.created_at
            FROM user_auth_accounts ua
            ORDER BY COALESCE(ua.last_authenticated_at, ua.created_at) DESC, ua.id DESC
            """;

        List<Map<String, Object>> rows = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                String userId = text(resultSet.getString("user_id"));
                String provider = text(resultSet.getString("provider"));
                String providerAccountId = text(resultSet.getString("provider_account_id"));
                String providerEmail = text(resultSet.getString("provider_email"));
                String recentAuth = formatTimestamp(coalesce(resultSet.getTimestamp("last_authenticated_at"), resultSet.getTimestamp("created_at")));
                String state = resultSet.getInt("is_primary") == 1 ? "PRIMARY" : "LINKED";

                rows.add(row(
                    searchable(userId, provider, providerAccountId, providerEmail),
                    List.of(
                        userId,
                        "account",
                        joinPlain(" / ", provider, providerAccountId, providerEmail),
                        recentAuth,
                        state,
                        "읽기 전용"
                    )
                ));
            }
        }
        return rows;
    }

    private List<Map<String, Object>> loadPermissionRows(Connection connection) throws SQLException {
        List<Map<String, Object>> rows = new ArrayList<>();

        if (tableExists(connection, "roles")) {
            String roleQuery = """
                SELECT
                    r.code,
                    r.name,
                    r.description,
                    r.created_at,
                    COUNT(DISTINCT rp.permission_id) AS permission_count,
                    COUNT(DISTINCT ur.user_id) AS assigned_user_count
                FROM roles r
                LEFT JOIN role_permissions rp ON rp.role_id = r.id
                LEFT JOIN user_roles ur ON ur.role_id = r.id
                GROUP BY r.id, r.code, r.name, r.description, r.created_at
                ORDER BY r.created_at DESC, r.code ASC
                """;

            try (PreparedStatement statement = connection.prepareStatement(roleQuery);
                 ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    String code = text(resultSet.getString("code"));
                    String name = text(resultSet.getString("name"));
                    String description = text(resultSet.getString("description"));
                    String createdAt = formatTimestamp(resultSet.getTimestamp("created_at"));
                    String state = "권한 " + resultSet.getLong("permission_count") + "개 / 사용자 " + resultSet.getLong("assigned_user_count") + "명";

                    rows.add(row(
                        searchable(code, name, description),
                        List.of(
                            code,
                            "role",
                            joinPlain(" / ", name, description),
                            createdAt,
                            state,
                            "읽기 전용"
                        )
                    ));
                }
            }
        }

        if (tableExists(connection, "permissions")) {
            String permissionQuery = """
                SELECT code, name, description, created_at
                FROM permissions
                ORDER BY created_at DESC, code ASC
                """;

            try (PreparedStatement statement = connection.prepareStatement(permissionQuery);
                 ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    String code = text(resultSet.getString("code"));
                    String name = text(resultSet.getString("name"));
                    String description = text(resultSet.getString("description"));
                    String createdAt = formatTimestamp(resultSet.getTimestamp("created_at"));

                    rows.add(row(
                        searchable(code, name, description),
                        List.of(
                            code,
                            "permission",
                            joinPlain(" / ", name, description),
                            createdAt,
                            "정의됨",
                            "읽기 전용"
                        )
                    ));
                }
            }
        }

        if (tableExists(connection, "user_roles")) {
            String assignmentQuery = """
                SELECT
                    ur.user_id,
                    r.code AS role_code,
                    COALESCE(NULLIF(TRIM(u.name), ''), ur.user_id) AS user_name,
                    ur.assigned_at,
                    ur.is_primary
                FROM user_roles ur
                INNER JOIN roles r ON r.id = ur.role_id
                LEFT JOIN users u ON u.id = ur.user_id
                ORDER BY ur.assigned_at DESC, ur.user_id ASC
                """;

            try (PreparedStatement statement = connection.prepareStatement(assignmentQuery);
                 ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    String userId = text(resultSet.getString("user_id"));
                    String roleCode = text(resultSet.getString("role_code"));
                    String userName = text(resultSet.getString("user_name"));
                    String assignedAt = formatTimestamp(resultSet.getTimestamp("assigned_at"));
                    String state = resultSet.getObject("is_primary") != null && resultSet.getInt("is_primary") == 1 ? "PRIMARY" : "LINKED";

                    rows.add(row(
                        searchable(userId, roleCode, userName),
                        List.of(
                            userId + " -> " + roleCode,
                            "assignment",
                            joinPlain(" / ", userName, roleCode),
                            assignedAt,
                            state,
                            "읽기 전용"
                        )
                    ));
                }
            }
        }

        return rows;
    }

    private List<Map<String, Object>> loadInquiryRows(Connection connection) throws SQLException {
        if (!tableExists(connection, "support_tickets")) {
            return List.of();
        }

        String query = """
            SELECT
                t.id,
                t.service_type,
                t.title,
                t.requester_name,
                t.requester_email,
                t.status,
                t.created_at,
                c.name AS category_name
            FROM support_tickets t
            LEFT JOIN support_categories c ON c.id = t.category_id
            ORDER BY t.created_at DESC, t.id DESC
            """;

        List<Map<String, Object>> rows = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                String title = text(resultSet.getString("title"));
                String requesterName = text(resultSet.getString("requester_name"));
                String requesterEmail = text(resultSet.getString("requester_email"));
                String serviceType = displayServiceType(resultSet.getString("service_type"));
                String categoryName = text(resultSet.getString("category_name"));
                String status = normalizeStatusLabel(resultSet.getString("status"));
                String createdAt = formatTimestamp(resultSet.getTimestamp("created_at"));

                rows.add(row(
                    searchable(String.valueOf(resultSet.getLong("id")), title, requesterName, requesterEmail, categoryName, status),
                    List.of(
                        String.valueOf(resultSet.getLong("id")),
                        serviceType,
                        joinPlain(" / ", title, requesterName, categoryName),
                        createdAt,
                        status,
                        "읽기 전용"
                    )
                ));
            }
        }
        return rows;
    }

    private List<Map<String, Object>> loadNoticeRows(Connection connection) throws SQLException {
        if (!tableExists(connection, "notices")) {
            return List.of();
        }

        String query = """
            SELECT id, service_type, title, published_at, created_at, is_active
            FROM notices
            ORDER BY COALESCE(published_at, created_at) DESC, id DESC
            """;

        List<Map<String, Object>> rows = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                String title = text(resultSet.getString("title"));
                String serviceType = displayServiceType(resultSet.getString("service_type"));
                Timestamp publishedAt = resultSet.getTimestamp("published_at");
                String scheduleText = publishedAt == null ? formatTimestamp(resultSet.getTimestamp("created_at")) : formatTimestamp(publishedAt);
                String statusKey = resolveNoticeStatusKey(resultSet.getInt("is_active"), publishedAt);
                String statusLabel = resolveStatusLabel(statusKey);

                rows.add(statusRow(
                    searchable(String.valueOf(resultSet.getLong("id")), title, serviceType),
                    List.of(
                        String.valueOf(resultSet.getLong("id")),
                        serviceType,
                        "notice",
                        title,
                        scheduleText,
                        statusLabel,
                        "읽기 전용"
                    ),
                    statusKey
                ));
            }
        }
        return rows;
    }

    private List<Map<String, Object>> loadFaqRows(Connection connection) throws SQLException {
        if (!tableExists(connection, "faqs")) {
            return List.of();
        }

        String query = """
            SELECT id, service_type, category, question, created_at, is_active
            FROM faqs
            ORDER BY created_at DESC, id DESC
            """;

        List<Map<String, Object>> rows = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                String question = text(resultSet.getString("question"));
                String serviceType = displayServiceType(resultSet.getString("service_type"));
                String category = text(resultSet.getString("category"));
                String statusKey = resultSet.getInt("is_active") == 1 ? "active" : "inactive";

                rows.add(statusRow(
                    searchable(String.valueOf(resultSet.getLong("id")), serviceType, category, question),
                    List.of(
                        String.valueOf(resultSet.getLong("id")),
                        serviceType,
                        category,
                        question,
                        formatTimestamp(resultSet.getTimestamp("created_at")),
                        resolveStatusLabel(statusKey),
                        "읽기 전용"
                    ),
                    statusKey
                ));
            }
        }
        return rows;
    }

    private List<Map<String, Object>> loadSupportCategoryRows(Connection connection) throws SQLException {
        if (!tableExists(connection, "support_categories")) {
            return List.of();
        }

        String query = """
            SELECT id, service_type, code, name, description, sort_order, is_active
            FROM support_categories
            ORDER BY service_type ASC, sort_order ASC, id ASC
            """;

        List<Map<String, Object>> rows = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                String serviceType = displayServiceType(resultSet.getString("service_type"));
                String code = text(resultSet.getString("code"));
                String name = text(resultSet.getString("name"));
                String description = text(resultSet.getString("description"));
                String statusKey = resultSet.getInt("is_active") == 1 ? "active" : "inactive";

                rows.add(statusRow(
                    searchable(String.valueOf(resultSet.getLong("id")), serviceType, code, name, description),
                    List.of(
                        String.valueOf(resultSet.getLong("id")),
                        serviceType,
                        code + " / " + resultSet.getInt("sort_order"),
                        name,
                        description.isBlank() ? "-" : description,
                        resolveStatusLabel(statusKey),
                        "읽기 전용"
                    ),
                    statusKey
                ));
            }
        }
        return rows;
    }

    private List<Map<String, Object>> buildSchemaRows(
        Connection connection,
        Set<String> existingTables,
        boolean schemaBlocked,
        String domainKey,
        List<SchemaExpectation> expectations
    ) throws SQLException {
        List<Map<String, Object>> rows = new ArrayList<>();
        for (SchemaExpectation expectation : expectations) {
            String activeTable = resolveExistingTable(existingTables, expectation.currentTable(), expectation.legacyTable());
            boolean available = activeTable != null;
            String count = available ? String.valueOf(countRows(connection, activeTable)) : "-";
            String currentState = available ? "사용 가능" : "미생성";
            String reason = available
                ? "현재 DB에서 조회 가능"
                : missingTableReason(schemaBlocked, expectation.requiredMigration(), expectation.legacyTable());

            rows.add(domainRow(
                searchable(domainKey, expectation.currentTable(), expectation.legacyTable(), expectation.role(), reason),
                List.of(
                    domainKey,
                    expectation.currentTableLabel(),
                    expectation.role(),
                    currentState,
                    count,
                    reason,
                    "읽기 전용"
                ),
                domainKey
            ));
        }
        return rows;
    }

    private List<Map<String, Object>> buildReservationRows(
        Connection connection,
        Set<String> existingTables,
        boolean schemaBlocked,
        List<SchemaExpectation> expectations
    ) throws SQLException {
        List<Map<String, Object>> rows = new ArrayList<>();
        for (String domainKey : RESERVATION_DOMAINS) {
            for (SchemaExpectation expectation : expectations) {
                boolean available = existingTables.contains(expectation.currentTable());
                String count = available ? String.valueOf(countRows(connection, expectation.currentTable())) : "-";
                String reason = available
                    ? "현재 DB에서 조회 가능"
                    : missingTableReason(schemaBlocked, expectation.requiredMigration(), expectation.legacyTable());

                rows.add(domainRow(
                    searchable(domainKey, expectation.currentTable(), expectation.role(), reason),
                    List.of(
                        domainKey,
                        expectation.currentTableLabel(),
                        expectation.role(),
                        available ? "사용 가능" : "미생성",
                        count,
                        reason,
                        "읽기 전용"
                    ),
                    domainKey
                ));
            }
        }
        return rows;
    }

    private List<Map<String, Object>> loadRecentActivity(Connection connection, String serviceType) throws SQLException {
        List<ActivitySnapshot> activities = new ArrayList<>();

        if (tableExists(connection, "notices")) {
            String query = """
                SELECT id, service_type, title, published_at, created_at, is_active
                FROM notices
                %s
                ORDER BY COALESCE(published_at, created_at) DESC, id DESC
                LIMIT 5
                """.formatted(serviceType == null ? "" : "WHERE service_type = ?");

            try (PreparedStatement statement = connection.prepareStatement(query)) {
                if (serviceType != null) {
                    statement.setString(1, serviceType);
                }

                try (ResultSet resultSet = statement.executeQuery()) {
                    while (resultSet.next()) {
                        Timestamp activityTime = coalesce(resultSet.getTimestamp("published_at"), resultSet.getTimestamp("created_at"));
                        activities.add(new ActivitySnapshot(
                            activityTime == null ? null : activityTime.toLocalDateTime(),
                            mapOf(
                                "type", "NOTICE",
                                "desc", "[" + displayServiceType(resultSet.getString("service_type")) + "] " + text(resultSet.getString("title")),
                                "time", formatTimestamp(activityTime),
                                "status", resultSet.getInt("is_active") == 1 ? "ACTIVE" : "INACTIVE"
                            )
                        ));
                    }
                }
            }
        }

        if (tableExists(connection, "support_tickets")) {
            String query = """
                SELECT id, service_type, title, status, created_at
                FROM support_tickets
                %s
                ORDER BY created_at DESC, id DESC
                LIMIT 5
                """.formatted(serviceType == null ? "" : "WHERE service_type = ?");

            try (PreparedStatement statement = connection.prepareStatement(query)) {
                if (serviceType != null) {
                    statement.setString(1, serviceType);
                }

                try (ResultSet resultSet = statement.executeQuery()) {
                    while (resultSet.next()) {
                        Timestamp createdAt = resultSet.getTimestamp("created_at");
                        activities.add(new ActivitySnapshot(
                            createdAt == null ? null : createdAt.toLocalDateTime(),
                            mapOf(
                                "type", "TICKET",
                                "desc", "[" + displayServiceType(resultSet.getString("service_type")) + "] " + text(resultSet.getString("title")),
                                "time", formatTimestamp(createdAt),
                                "status", normalizeStatusLabel(resultSet.getString("status")).toUpperCase(Locale.ROOT)
                            )
                        ));
                    }
                }
            }
        }

        activities.sort((left, right) -> {
            LocalDateTime leftTime = left.time();
            LocalDateTime rightTime = right.time();
            if (leftTime == null && rightTime == null) {
                return 0;
            }
            if (leftTime == null) {
                return 1;
            }
            if (rightTime == null) {
                return -1;
            }
            return rightTime.compareTo(leftTime);
        });

        return activities.stream()
            .limit(8)
            .map(ActivitySnapshot::payload)
            .toList();
    }

    private String normalizeDashboardDomain(String rawDomain) {
        if (!StringUtils.hasText(rawDomain)) {
            return "all";
        }
        String normalized = rawDomain.trim().toLowerCase(Locale.ROOT);
        return switch (normalized) {
            case "air", "stay", "rent", "all" -> normalized;
            default -> "all";
        };
    }

    private String normalizeSurface(String rawSurface) {
        if (!StringUtils.hasText(rawSurface)) {
            throw new IllegalArgumentException("surface가 필요합니다.");
        }
        return rawSurface.trim().toLowerCase(Locale.ROOT);
    }

    private Map<String, Object> tableSurfaceConfig(String defaultTab, Map<String, Object> tabs) {
        Map<String, Object> config = new LinkedHashMap<>();
        config.put("defaultTab", defaultTab);
        config.put("tabs", tabs);
        return config;
    }

    private Map<String, Object> tabConfig(
        String searchPlaceholder,
        String secondaryAction,
        String primaryAction,
        String emptyMessage,
        List<String> columns,
        List<Map<String, Object>> rows
    ) {
        return mapOf(
            "searchPlaceholder", searchPlaceholder,
            "primaryAction", primaryAction,
            "secondaryAction", secondaryAction,
            "emptyMessage", emptyMessage,
            "columns", columns,
            "rows", rows
        );
    }

    private Map<String, Object> schemaTabConfig(
        String searchPlaceholder,
        String secondaryAction,
        String primaryAction,
        String emptyMessage,
        List<String> columns,
        List<Map<String, Object>> rows
    ) {
        return tabConfig(searchPlaceholder, secondaryAction, primaryAction, emptyMessage, columns, rows);
    }

    private Map<String, Object> row(String searchText, List<String> cells) {
        return mapOf(
            "searchText", searchText,
            "cells", cells
        );
    }

    private Map<String, Object> domainRow(String searchText, List<String> cells, String domainKey) {
        return mapOf(
            "searchText", searchText,
            "cells", cells,
            "domainKey", domainKey
        );
    }

    private Map<String, Object> statusRow(String searchText, List<String> cells, String statusKey) {
        return mapOf(
            "searchText", searchText,
            "cells", cells,
            "statusKey", statusKey
        );
    }

    private long countAll(Connection connection, String tableName) throws SQLException {
        if (!tableExists(connection, tableName)) {
            return 0L;
        }
        return countRows(connection, tableName);
    }

    private long countByServiceType(Connection connection, String tableName, String serviceType) throws SQLException {
        if (!tableExists(connection, tableName)) {
            return 0L;
        }

        StringBuilder query = new StringBuilder("SELECT COUNT(*) FROM ").append(tableName);
        if (serviceType != null) {
            query.append(" WHERE service_type = ?");
        }

        try (PreparedStatement statement = connection.prepareStatement(query.toString())) {
            if (serviceType != null) {
                statement.setString(1, serviceType);
            }

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return 0L;
                }
                return resultSet.getLong(1);
            }
        }
    }

    private long countRows(Connection connection, String tableName) throws SQLException {
        try (Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery("SELECT COUNT(*) FROM " + tableName)) {
            if (!resultSet.next()) {
                return 0L;
            }
            return resultSet.getLong(1);
        }
    }

    private boolean tableExists(Connection connection, String tableName) throws SQLException {
        String query = """
            SELECT COUNT(*)
            FROM information_schema.tables
            WHERE table_schema = DATABASE()
              AND table_name = ?
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, tableName);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return false;
                }
                return resultSet.getLong(1) > 0L;
            }
        }
    }

    private Set<String> loadExistingTables(Connection connection) throws SQLException {
        Set<String> tables = new LinkedHashSet<>();
        try (Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery("SHOW TABLES")) {
            while (resultSet.next()) {
                tables.add(text(resultSet.getString(1)));
            }
        }
        return tables;
    }

    private boolean hasFlywayFailure(Connection connection) throws SQLException {
        if (!tableExists(connection, "flyway_schema_history")) {
            return false;
        }

        try (Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery("""
                 SELECT COUNT(*)
                 FROM flyway_schema_history
                 WHERE success = 0
                 """)) {
            if (!resultSet.next()) {
                return false;
            }
            return resultSet.getLong(1) > 0L;
        }
    }

    private String resolveExistingTable(Set<String> existingTables, String currentTable, String legacyTable) {
        if (existingTables.contains(currentTable)) {
            return currentTable;
        }
        if (legacyTable != null && existingTables.contains(legacyTable)) {
            return legacyTable;
        }
        return null;
    }

    private String missingTableReason(boolean schemaBlocked, String requiredMigration, String legacyTable) {
        if (schemaBlocked) {
            return "현재 DB가 V2 실패 뒤 멈춰 있어 " + requiredMigration + " 이후 스키마가 미적용";
        }
        if (legacyTable != null) {
            return "현재 테이블도 legacy 테이블도 DB에 없음";
        }
        return "현재 DB에 테이블이 없음";
    }

    private String resolveNoticeStatusKey(int isActive, Timestamp publishedAt) {
        if (isActive != 1) {
            return "inactive";
        }
        if (publishedAt == null) {
            return "draft";
        }
        return publishedAt.toLocalDateTime().isAfter(LocalDateTime.now()) ? "draft" : "active";
    }

    private String resolveStatusLabel(String statusKey) {
        return switch (statusKey) {
            case "active" -> "노출 중";
            case "draft" -> "예약 / 임시저장";
            case "inactive" -> "비노출";
            default -> statusKey;
        };
    }

    private String normalizeStatusLabel(String rawStatus) {
        if (!StringUtils.hasText(rawStatus)) {
            return "-";
        }

        String normalized = rawStatus.trim().toLowerCase(Locale.ROOT);
        return switch (normalized) {
            case "pending" -> "대기";
            case "in_progress" -> "처리 중";
            case "waiting" -> "응답 대기";
            case "open" -> "열림";
            case "answered" -> "답변 완료";
            case "resolved" -> "해결";
            case "closed" -> "종결";
            default -> rawStatus.trim();
        };
    }

    private String displayServiceType(String rawServiceType) {
        if (!StringUtils.hasText(rawServiceType)) {
            return "COMMON";
        }

        String normalized = rawServiceType.trim().toLowerCase(Locale.ROOT);
        return switch (normalized) {
            case "jeju-air" -> "AIR";
            case "jeju-stay" -> "STAY";
            case "jeju-rental" -> "RENT";
            case "common" -> "COMMON";
            default -> rawServiceType.trim().toUpperCase(Locale.ROOT);
        };
    }

    private String searchable(String... values) {
        List<String> parts = new ArrayList<>();
        for (String value : values) {
            if (StringUtils.hasText(value)) {
                parts.add(value.toLowerCase(Locale.ROOT));
            }
        }
        return String.join(" ", parts);
    }

    private String joinPlain(String delimiter, String... values) {
        List<String> parts = new ArrayList<>();
        for (String value : values) {
            if (StringUtils.hasText(value)) {
                parts.add(value);
            }
        }
        return parts.isEmpty() ? "-" : String.join(delimiter, parts);
    }

    private String text(String value) {
        return value == null ? "" : value.trim();
    }

    private String formatTimestamp(Timestamp timestamp) {
        if (timestamp == null) {
            return "-";
        }
        return DATE_TIME_FORMAT.format(timestamp.toLocalDateTime());
    }

    private Timestamp coalesce(Timestamp first, Timestamp second) {
        return first != null ? first : second;
    }

    private Connection openConnection() throws SQLException {
        String url = normalize(appProperties.alwaysdata().dbUrl());
        String user = normalize(appProperties.alwaysdata().dbUser());
        String password = normalize(appProperties.alwaysdata().dbPassword());

        if (!StringUtils.hasText(url) || !StringUtils.hasText(user) || !StringUtils.hasText(password)) {
            throw new SQLException("admin DB configuration is missing");
        }

        return DriverManager.getConnection(url, user, password);
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }

    private Map<String, Object> mapOf(Object... pairs) {
        Map<String, Object> map = new LinkedHashMap<>();
        for (int index = 0; index < pairs.length; index += 2) {
            map.put(String.valueOf(pairs[index]), pairs[index + 1]);
        }
        return map;
    }

    private record ActivitySnapshot(
        LocalDateTime time,
        Map<String, Object> payload
    ) {
    }

    private record SchemaExpectation(
        String currentTable,
        String legacyTable,
        String role,
        String requiredMigration
    ) {
        String currentTableLabel() {
            return legacyTable == null ? currentTable : currentTable + " (legacy: " + legacyTable + ")";
        }
    }
}
