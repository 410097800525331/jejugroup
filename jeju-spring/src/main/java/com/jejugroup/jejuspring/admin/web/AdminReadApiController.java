package com.jejugroup.jejuspring.admin.web;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
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

import com.jejugroup.jejuspring.auth.application.ActiveUserPresenceService;
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
    private static final Map<String, String> BOOKING_TYPE_BY_DOMAIN = Map.of(
        "flight", "air",
        "hotel", "stay",
        "rentcar", "rent"
    );
    private static final Map<String, String> SERVICE_TYPE_BY_DOMAIN = Map.of(
        "flight", "jeju-air",
        "hotel", "jeju-stay",
        "rentcar", "jeju-rental"
    );
    private static final List<String> RESERVATION_DOMAINS = List.of("air", "stay", "rent", "voucher");

    private final AppProperties appProperties;
    private final ActiveUserPresenceService activeUserPresenceService;

    AdminReadService(AppProperties appProperties, ActiveUserPresenceService activeUserPresenceService) {
        this.appProperties = appProperties;
        this.activeUserPresenceService = activeUserPresenceService;
    }

    Map<String, Object> loadDashboard(String rawDomain) throws SQLException {
        String domain = normalizeDashboardDomain(rawDomain);
        String bookingType = BOOKING_TYPE_BY_DOMAIN.get(domain);

        try (Connection connection = openConnection()) {
            connection.setReadOnly(true);

            Map<String, Object> data = new LinkedHashMap<>();
            data.put("kpi", loadDashboardKpi(connection, bookingType));
            data.put("recentActivity", loadRecentActivity(connection, bookingType));
            data.put("chartSeriesByRange", loadDashboardChartSeries(connection, bookingType));
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
        tabs.put("membership", tabConfig(
            "멤버십명 또는 회원명 검색",
            "새로고침",
            "멤버십 DB 보기",
            "현재 DB에 멤버십 데이터가 없습니다.",
            List.of("대상", "도메인", "기본 정보", "갱신 시각", "상태 / 혜택", "관리"),
            loadMembershipRows(connection)
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
        tabs.put("banner", tabConfig(
            "배너 제목이나 슬롯으로 검색",
            "배치 정리",
            "배너 DB 보기",
            "현재 DB에 배너 데이터가 없습니다.",
            List.of("배너 ID", "사이트 / 위치", "배치 / 형태", "노출 규칙 / 조건", "제목", "노출 기간", "노출 상태", "관리"),
            loadBannerRows(connection)
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
        tabs.put("booking", tabConfig(
            "예약번호나 고객명으로 검색",
            "신규 요청 처리",
            "예약 DB 보기",
            "예약 데이터가 없습니다.",
            List.of("번호", "도메인", "예약 / 결제 정보", "고객 / 연락처", "금액", "시각", "상태", "관리"),
            loadReservationBookingRows(connection)
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

    private List<Map<String, Object>> loadReservationBookingRows(Connection connection) throws SQLException {
        if (!tableExists(connection, "bookings")) {
            return List.of();
        }

        String query = """
            SELECT
                b.booking_no,
                b.booking_type,
                b.status,
                b.payment_status,
                b.total_amount,
                b.paid_amount,
                b.currency,
                b.booked_at,
                b.created_at,
                b.cancelled_at,
                COALESCE(NULLIF(TRIM(up.display_name), ''), u.name, b.user_id) AS display_name,
                u.email,
                u.phone
            FROM bookings b
            LEFT JOIN users u ON u.id = b.user_id
            LEFT JOIN user_profiles up ON up.user_id = b.user_id
            ORDER BY COALESCE(b.booked_at, b.created_at) DESC, b.id DESC
            """;

        List<Map<String, Object>> rows = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                String bookingType = text(resultSet.getString("booking_type"));
                String domainKey = toReservationDomainKey(bookingType);
                String bookingStatus = buildReservationBookingStatus(
                    resultSet.getString("status"),
                    resultSet.getString("payment_status"),
                    resultSet.getTimestamp("cancelled_at")
                );

                rows.add(domainRow(
                    searchable(
                        resultSet.getString("booking_no"),
                        resultSet.getString("display_name"),
                        resultSet.getString("email"),
                        resultSet.getString("phone"),
                        bookingStatus
                    ),
                    List.of(
                        text(resultSet.getString("booking_no")),
                        displayBookingType(bookingType),
                        joinPlain(" / ", normalizeReservationStatusLabel(resultSet.getString("status")), normalizePaymentStatusLabel(resultSet.getString("payment_status"))),
                        joinPlain(" / ", text(resultSet.getString("display_name")), text(resultSet.getString("email")), text(resultSet.getString("phone"))),
                        formatReservationAmount(resultSet.getBigDecimal("paid_amount"), resultSet.getBigDecimal("total_amount"), resultSet.getString("currency")),
                        formatTimestamp(coalesce(resultSet.getTimestamp("booked_at"), resultSet.getTimestamp("created_at"))),
                        bookingStatus,
                        "읽기 전용"
                    ),
                    domainKey
                ));
            }
        }

        return rows;
    }

    private List<Map<String, Object>> loadMembershipRows(Connection connection) throws SQLException {
        if (!tableExists(connection, "user_memberships") || !tableExists(connection, "membership_plans")) {
            return List.of();
        }

        String query = """
            SELECT
                um.user_id,
                COALESCE(NULLIF(TRIM(up.display_name), ''), u.name, um.user_id) AS display_name,
                mp.plan_code,
                mp.plan_name,
                mp.tier_level,
                mp.benefit_summary,
                um.membership_status,
                um.started_at,
                um.updated_at,
                COUNT(DISTINCT mpb.id) AS benefit_count
            FROM user_memberships um
            INNER JOIN membership_plans mp ON mp.id = um.membership_plan_id
            LEFT JOIN membership_plan_benefits mpb
                ON mpb.membership_plan_id = mp.id
               AND mpb.is_active = 1
            LEFT JOIN users u ON u.id = um.user_id
            LEFT JOIN user_profiles up ON up.user_id = um.user_id
            GROUP BY
                um.id,
                um.user_id,
                display_name,
                mp.plan_code,
                mp.plan_name,
                mp.tier_level,
                mp.benefit_summary,
                um.membership_status,
                um.started_at,
                um.updated_at
            ORDER BY COALESCE(um.updated_at, um.started_at, um.created_at) DESC, um.id DESC
            """;

        List<Map<String, Object>> rows = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                String userId = text(resultSet.getString("user_id"));
                String displayName = text(resultSet.getString("display_name"));
                String planCode = text(resultSet.getString("plan_code"));
                String planName = text(resultSet.getString("plan_name"));
                String updatedAt = formatTimestamp(coalesce(resultSet.getTimestamp("updated_at"), resultSet.getTimestamp("started_at")));
                String status = buildMembershipStatus(
                    resultSet.getString("membership_status"),
                    resultSet.getInt("tier_level"),
                    resultSet.getLong("benefit_count"),
                    resultSet.getString("benefit_summary")
                );

                rows.add(row(
                    searchable(userId, displayName, planCode, planName, status),
                    List.of(
                        joinPlain(" / ", displayName, userId),
                        "membership",
                        joinPlain(" / ", planName, planCode),
                        updatedAt,
                        status,
                        "읽기 전용"
                    )
                ));
            }
        }
        return rows;
    }

    private String buildMembershipStatus(String membershipStatus, int tierLevel, long benefitCount, String benefitSummary) {
        return joinPlain(
            " / ",
            normalizeMembershipStatusLabel(membershipStatus),
            "티어 " + tierLevel,
            "혜택 " + benefitCount + "개",
            text(benefitSummary)
        );
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

    private List<Map<String, Object>> loadBannerRows(Connection connection) throws SQLException {
        if (!tableExists(connection, "banners") || !tableExists(connection, "banner_slots")) {
            return List.of();
        }

        String query = """
            SELECT
                b.id,
                bs.slot_code,
                bs.slot_name,
                bs.placement,
                bs.screen_type,
                b.banner_code,
                b.title,
                b.subtitle,
                b.start_at,
                b.end_at,
                b.sort_order,
                b.is_active,
                COUNT(DISTINCT er.id) AS rule_count,
                MIN(er.service_type) AS service_type
            FROM banners b
            INNER JOIN banner_slots bs ON bs.id = b.banner_slot_id
            LEFT JOIN exposure_rules er
                ON er.target_type = 'banner'
               AND er.target_key = b.banner_code
            GROUP BY
                b.id,
                bs.slot_code,
                bs.slot_name,
                bs.placement,
                bs.screen_type,
                b.banner_code,
                b.title,
                b.subtitle,
                b.start_at,
                b.end_at,
                b.sort_order,
                b.is_active
            ORDER BY COALESCE(b.start_at, b.created_at) DESC, b.id DESC
            """;

        List<Map<String, Object>> rows = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                String bannerId = String.valueOf(resultSet.getLong("id"));
                String placement = joinPlain(
                    " / ",
                    displayServiceType(resultSet.getString("service_type")),
                    text(resultSet.getString("placement")),
                    text(resultSet.getString("slot_name"))
                );
                String layout = joinPlain(
                    " / ",
                    text(resultSet.getString("slot_code")),
                    text(resultSet.getString("screen_type")),
                    "정렬 " + resultSet.getInt("sort_order")
                );
                String exposure = buildBannerExposureSummary(
                    resultSet.getLong("rule_count"),
                    resultSet.getTimestamp("start_at"),
                    resultSet.getTimestamp("end_at")
                );
                String title = joinPlain(
                    " / ",
                    text(resultSet.getString("title")),
                    text(resultSet.getString("subtitle"))
                );
                String period = buildBannerPeriodLabel(resultSet.getTimestamp("start_at"), resultSet.getTimestamp("end_at"));
                String statusKey = resolveBannerStatusKey(
                    resultSet.getInt("is_active"),
                    resultSet.getTimestamp("start_at"),
                    resultSet.getTimestamp("end_at")
                );

                rows.add(statusRow(
                    searchable(
                        bannerId,
                        text(resultSet.getString("banner_code")),
                        text(resultSet.getString("title")),
                        text(resultSet.getString("slot_code")),
                        text(resultSet.getString("slot_name"))
                    ),
                    List.of(
                        bannerId,
                        placement,
                        layout,
                        exposure,
                        title,
                        period,
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

    private List<Map<String, Object>> loadRecentActivity(Connection connection, String bookingType) throws SQLException {
        List<ActivitySnapshot> activities = new ArrayList<>();
        activities.addAll(loadRecentBookingActivities(connection, bookingType));
        activities.addAll(loadRecentRefundActivities(connection, bookingType));
        activities.addAll(loadRecentAdminActionActivities(connection));

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

    private List<ActivitySnapshot> loadRecentBookingActivities(Connection connection, String bookingType) throws SQLException {
        if (!tableExists(connection, "bookings")) {
            return List.of();
        }

        StringBuilder query = new StringBuilder("""
            SELECT booking_no, booking_type, status, payment_status, booked_at, cancelled_at, created_at
            FROM bookings
            """);

        if (bookingType != null) {
            query.append(" WHERE booking_type = ?");
        }

        query.append(" ORDER BY COALESCE(cancelled_at, booked_at, created_at) DESC, id DESC LIMIT 5");

        List<ActivitySnapshot> activities = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query.toString())) {
            if (bookingType != null) {
                statement.setString(1, bookingType);
            }

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    Timestamp activityTime = coalesce(
                        resultSet.getTimestamp("cancelled_at"),
                        coalesce(resultSet.getTimestamp("booked_at"), resultSet.getTimestamp("created_at"))
                    );
                    boolean cancelled = isCancelledBooking(
                        resultSet.getString("status"),
                        resultSet.getString("payment_status"),
                        resultSet.getTimestamp("cancelled_at")
                    );
                    String bookingTypeLabel = displayBookingType(resultSet.getString("booking_type"));
                    String bookingNo = text(resultSet.getString("booking_no"));
                    String description = "[" + bookingTypeLabel + "] "
                        + (bookingNo.isBlank() ? "예약" : bookingNo)
                        + (cancelled ? " 취소" : " 예약 생성");

                    activities.add(new ActivitySnapshot(
                        activityTime == null ? null : activityTime.toLocalDateTime(),
                        mapOf(
                            "type", cancelled ? "cancel" : "reservation",
                            "description", description,
                            "time", formatTimestamp(activityTime),
                            "statusTone", cancelled ? "danger" : "success",
                            "statusLabel", cancelled ? "취소 완료" : "예약 접수"
                        )
                    ));
                }
            }
        }

        return activities;
    }

    private List<ActivitySnapshot> loadRecentRefundActivities(Connection connection, String bookingType) throws SQLException {
        if (!tableExists(connection, "payment_refunds")
            || !tableExists(connection, "payment_transactions")
            || !tableExists(connection, "payment_attempts")
            || !tableExists(connection, "bookings")) {
            return List.of();
        }

        StringBuilder query = new StringBuilder("""
            SELECT pr.refund_no, pr.status, pr.requested_at, pr.completed_at, pr.created_at,
                   b.booking_no, b.booking_type
            FROM payment_refunds pr
            INNER JOIN payment_transactions pt ON pt.id = pr.payment_transaction_id
            INNER JOIN payment_attempts pa ON pa.id = pt.payment_attempt_id
            INNER JOIN bookings b ON b.id = pa.booking_id
            """);

        if (bookingType != null) {
            query.append(" WHERE b.booking_type = ?");
        }

        query.append(" ORDER BY COALESCE(pr.completed_at, pr.requested_at, pr.created_at) DESC, pr.id DESC LIMIT 5");

        List<ActivitySnapshot> activities = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query.toString())) {
            if (bookingType != null) {
                statement.setString(1, bookingType);
            }

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    Timestamp activityTime = coalesce(
                        resultSet.getTimestamp("completed_at"),
                        coalesce(resultSet.getTimestamp("requested_at"), resultSet.getTimestamp("created_at"))
                    );
                    String refundNo = text(resultSet.getString("refund_no"));
                    String bookingNo = text(resultSet.getString("booking_no"));
                    String description = "[" + displayBookingType(resultSet.getString("booking_type")) + "] "
                        + (bookingNo.isBlank() ? "예약" : bookingNo)
                        + " / "
                        + (refundNo.isBlank() ? "환불" : refundNo);

                    activities.add(new ActivitySnapshot(
                        activityTime == null ? null : activityTime.toLocalDateTime(),
                        mapOf(
                            "type", "cancel",
                            "description", description,
                            "time", formatTimestamp(activityTime),
                            "statusTone", resolveRefundStatusTone(resultSet.getString("status")),
                            "statusLabel", resolveRefundStatusLabel(resultSet.getString("status"))
                        )
                    ));
                }
            }
        }

        return activities;
    }

    private List<ActivitySnapshot> loadRecentAdminActionActivities(Connection connection) throws SQLException {
        if (!tableExists(connection, "admin_action_logs")) {
            return List.of();
        }

        String query = """
            SELECT action_name, target_type, target_key, action_summary, created_at
            FROM admin_action_logs
            ORDER BY created_at DESC, id DESC
            LIMIT 5
            """;

        List<ActivitySnapshot> activities = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                Timestamp createdAt = resultSet.getTimestamp("created_at");
                activities.add(new ActivitySnapshot(
                    createdAt == null ? null : createdAt.toLocalDateTime(),
                    mapOf(
                        "type", "default",
                        "description", buildAdminActionDescription(
                            resultSet.getString("action_name"),
                            resultSet.getString("action_summary"),
                            resultSet.getString("target_type"),
                            resultSet.getString("target_key")
                        ),
                        "time", formatTimestamp(createdAt),
                        "statusTone", "info",
                        "statusLabel", "관리 작업"
                    )
                ));
            }
        }

        return activities;
    }

    private String normalizeDashboardDomain(String rawDomain) {
        if (!StringUtils.hasText(rawDomain)) {
            return "all";
        }
        String normalized = rawDomain.trim().toLowerCase(Locale.ROOT);
        return switch (normalized) {
            case "all", "flight", "hotel", "rentcar" -> normalized;
            case "air" -> "flight";
            case "stay" -> "hotel";
            case "rent" -> "rentcar";
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

    private Map<String, Object> loadDashboardKpi(Connection connection, String bookingType) throws SQLException {
        long todayReservations = countTodayReservations(connection, bookingType);
        long revenue = loadTodayRevenue(connection, bookingType);
        double cancelRate = loadTodayCancelRate(connection, bookingType, todayReservations);
        long activeUsers = activeUserPresenceService.countActiveUsers(connection);

        return mapOf(
            "todayReservations", todayReservations,
            "revenue", revenue,
            "cancelRate", cancelRate,
            "activeUsers", activeUsers
        );
    }

    private Map<String, Object> loadDashboardChartSeries(Connection connection, String bookingType) throws SQLException {
        Map<String, Object> chartSeriesByRange = new LinkedHashMap<>();
        chartSeriesByRange.put("hour", loadChartRangeSeries(connection, bookingType, buildHourlyBuckets()));
        chartSeriesByRange.put("day", loadChartRangeSeries(connection, bookingType, buildDailyBuckets()));
        chartSeriesByRange.put("week", loadChartRangeSeries(connection, bookingType, buildWeeklyBuckets()));

        Map<String, Object> monthSeries = loadChartRangeSeries(connection, bookingType, buildMonthlyBuckets());
        chartSeriesByRange.put("month", monthSeries);
        chartSeriesByRange.put("1year", copyChartSeries(monthSeries));
        chartSeriesByRange.put("5year", loadChartRangeSeries(connection, bookingType, buildFiveYearBuckets()));

        return chartSeriesByRange;
    }

    private Map<String, Object> loadChartRangeSeries(
        Connection connection,
        String bookingType,
        List<TimeBucket> buckets
    ) throws SQLException {
        return mapOf(
            "revenue", loadRevenueSeries(connection, bookingType, buckets),
            "reservation", loadReservationSeries(connection, bookingType, buckets)
        );
    }

    private List<Long> loadReservationSeries(
        Connection connection,
        String bookingType,
        List<TimeBucket> buckets
    ) throws SQLException {
        if (!tableExists(connection, "bookings")) {
            return zeroSeries(buckets.size());
        }

        StringBuilder query = new StringBuilder("""
            SELECT COUNT(*)
            FROM bookings
            WHERE COALESCE(booked_at, created_at) >= ?
              AND COALESCE(booked_at, created_at) < ?
            """);

        if (bookingType != null) {
            query.append(" AND booking_type = ?");
        }

        List<Long> series = new ArrayList<>();
        for (TimeBucket bucket : buckets) {
            series.add(queryForLong(connection, query.toString(), bucket.startInclusive(), bucket.endExclusive(), bookingType));
        }
        return series;
    }

    private List<Long> loadRevenueSeries(
        Connection connection,
        String bookingType,
        List<TimeBucket> buckets
    ) throws SQLException {
        if (!tableExists(connection, "payment_transactions")
            || !tableExists(connection, "payment_attempts")
            || !tableExists(connection, "bookings")) {
            return zeroSeries(buckets.size());
        }

        StringBuilder query = new StringBuilder("""
            SELECT COALESCE(SUM(pt.amount), 0)
            FROM payment_transactions pt
            JOIN payment_attempts pa ON pa.id = pt.payment_attempt_id
            JOIN bookings b ON b.id = pa.booking_id
            WHERE LOWER(COALESCE(pt.status, '')) IN ('approved', 'captured', 'paid', 'completed', 'success')
              AND COALESCE(pt.approved_at, pt.processed_at, pt.created_at) >= ?
              AND COALESCE(pt.approved_at, pt.processed_at, pt.created_at) < ?
            """);

        if (bookingType != null) {
            query.append(" AND b.booking_type = ?");
        }

        List<Long> series = new ArrayList<>();
        for (TimeBucket bucket : buckets) {
            BigDecimal amount = queryForDecimal(connection, query.toString(), bucket.startInclusive(), bucket.endExclusive(), bookingType);
            series.add(amount.setScale(0, RoundingMode.HALF_UP).longValue());
        }
        return series;
    }

    private List<TimeBucket> buildHourlyBuckets() {
        LocalDate today = LocalDate.now();
        List<TimeBucket> buckets = new ArrayList<>();
        for (int hour = 0; hour < 24; hour++) {
            LocalDateTime start = today.atTime(hour, 0);
            buckets.add(new TimeBucket(start, start.plusHours(1)));
        }
        return buckets;
    }

    private List<TimeBucket> buildDailyBuckets() {
        LocalDate today = LocalDate.now();
        List<TimeBucket> buckets = new ArrayList<>();
        for (int dayOffset = 6; dayOffset >= 0; dayOffset--) {
            LocalDateTime start = today.minusDays(dayOffset).atStartOfDay();
            buckets.add(new TimeBucket(start, start.plusDays(1)));
        }
        return buckets;
    }

    private List<TimeBucket> buildWeeklyBuckets() {
        LocalDate currentWeekStart = LocalDate.now().with(DayOfWeek.MONDAY);
        List<TimeBucket> buckets = new ArrayList<>();
        for (int weekOffset = 7; weekOffset >= 0; weekOffset--) {
            LocalDateTime start = currentWeekStart.minusWeeks(weekOffset).atStartOfDay();
            buckets.add(new TimeBucket(start, start.plusWeeks(1)));
        }
        return buckets;
    }

    private List<TimeBucket> buildMonthlyBuckets() {
        int currentYear = LocalDate.now().getYear();
        List<TimeBucket> buckets = new ArrayList<>();
        for (int month = 1; month <= 12; month++) {
            YearMonth yearMonth = YearMonth.of(currentYear, month);
            buckets.add(new TimeBucket(yearMonth.atDay(1).atStartOfDay(), yearMonth.plusMonths(1).atDay(1).atStartOfDay()));
        }
        return buckets;
    }

    private List<TimeBucket> buildFiveYearBuckets() {
        int currentYear = LocalDate.now().getYear();
        List<TimeBucket> buckets = new ArrayList<>();
        for (int year = currentYear - 4; year <= currentYear; year++) {
            LocalDateTime start = LocalDate.of(year, 1, 1).atStartOfDay();
            buckets.add(new TimeBucket(start, start.plusYears(1)));
        }
        return buckets;
    }

    private List<Long> zeroSeries(int length) {
        List<Long> series = new ArrayList<>();
        for (int index = 0; index < length; index++) {
            series.add(0L);
        }
        return series;
    }

    private Map<String, Object> copyChartSeries(Map<String, Object> source) {
        Map<String, Object> copy = new LinkedHashMap<>();
        copy.put("revenue", source.get("revenue"));
        copy.put("reservation", source.get("reservation"));
        return copy;
    }

    private long countTodayReservations(Connection connection, String bookingType) throws SQLException {
        if (!tableExists(connection, "bookings")) {
            return 0L;
        }

        StringBuilder query = new StringBuilder("""
            SELECT COUNT(*)
            FROM bookings
            WHERE DATE(COALESCE(booked_at, created_at)) = CURRENT_DATE()
            """);

        if (bookingType != null) {
            query.append(" AND booking_type = ?");
        }

        return queryForLong(connection, query.toString(), bookingType);
    }

    private boolean isCancelledBooking(String bookingStatus, String paymentStatus, Timestamp cancelledAt) {
        if (cancelledAt != null) {
            return true;
        }

        String normalizedStatus = text(bookingStatus).toLowerCase(Locale.ROOT);
        if ("cancelled".equals(normalizedStatus)) {
            return true;
        }

        String normalizedPaymentStatus = text(paymentStatus).toLowerCase(Locale.ROOT);
        return "cancelled".equals(normalizedPaymentStatus)
            || "refunded".equals(normalizedPaymentStatus)
            || "partial_refund".equals(normalizedPaymentStatus);
    }

    private String displayBookingType(String bookingType) {
        return switch (text(bookingType).toLowerCase(Locale.ROOT)) {
            case "air" -> "항공";
            case "stay" -> "숙박";
            case "rent" -> "렌터카";
            case "voucher" -> "바우처";
            default -> "예약";
        };
    }

    private String resolveRefundStatusTone(String rawStatus) {
        return switch (text(rawStatus).toLowerCase(Locale.ROOT)) {
            case "completed", "refunded", "approved" -> "success";
            case "failed", "rejected", "cancelled" -> "danger";
            default -> "warning";
        };
    }

    private String resolveRefundStatusLabel(String rawStatus) {
        return switch (text(rawStatus).toLowerCase(Locale.ROOT)) {
            case "requested", "pending" -> "환불 요청";
            case "completed", "refunded", "approved" -> "환불 완료";
            case "failed" -> "환불 실패";
            case "rejected" -> "환불 거절";
            case "cancelled" -> "환불 취소";
            default -> "환불 처리";
        };
    }

    private String buildAdminActionDescription(String actionName, String actionSummary, String targetType, String targetKey) {
        String normalizedActionName = text(actionName);
        String normalizedSummary = text(actionSummary);
        String normalizedTargetType = text(targetType);
        String normalizedTargetKey = text(targetKey);

        if (normalizedSummary.isBlank()) {
            return joinPlain(
                " / ",
                normalizedActionName.isBlank() ? "관리 작업" : normalizedActionName,
                normalizedTargetType,
                normalizedTargetKey
            );
        }

        return joinPlain(
            " / ",
            normalizedActionName.isBlank() ? "관리 작업" : normalizedActionName,
            normalizedSummary,
            normalizedTargetType.isBlank() && normalizedTargetKey.isBlank()
                ? ""
                : normalizedTargetType + ":" + normalizedTargetKey
        );
    }

    private long loadTodayRevenue(Connection connection, String bookingType) throws SQLException {
        if (!tableExists(connection, "payment_transactions")
            || !tableExists(connection, "payment_attempts")
            || !tableExists(connection, "bookings")) {
            return 0L;
        }

        StringBuilder query = new StringBuilder("""
            SELECT COALESCE(SUM(pt.amount), 0)
            FROM payment_transactions pt
            JOIN payment_attempts pa ON pa.id = pt.payment_attempt_id
            JOIN bookings b ON b.id = pa.booking_id
            WHERE LOWER(COALESCE(pt.status, '')) IN ('approved', 'captured', 'paid', 'completed', 'success')
              AND DATE(COALESCE(pt.approved_at, pt.processed_at, pt.created_at)) = CURRENT_DATE()
            """);

        if (bookingType != null) {
            query.append(" AND b.booking_type = ?");
        }

        BigDecimal revenue = queryForDecimal(connection, query.toString(), bookingType);
        return revenue.setScale(0, RoundingMode.HALF_UP).longValue();
    }

    private double loadTodayCancelRate(Connection connection, String bookingType, long todayReservations) throws SQLException {
        if (todayReservations <= 0L || !tableExists(connection, "bookings")) {
            return 0.0d;
        }

        StringBuilder query = new StringBuilder("""
            SELECT COUNT(*)
            FROM bookings
            WHERE (
                cancelled_at IS NOT NULL
                OR LOWER(COALESCE(status, '')) = 'cancelled'
                OR LOWER(COALESCE(payment_status, '')) IN ('cancelled', 'refunded', 'partial_refund')
            )
              AND DATE(COALESCE(cancelled_at, updated_at, created_at)) = CURRENT_DATE()
            """);

        if (bookingType != null) {
            query.append(" AND booking_type = ?");
        }

        long cancelledReservations = queryForLong(connection, query.toString(), bookingType);
        double rawRate = (cancelledReservations * 100.0d) / todayReservations;
        return Math.round(rawRate * 10.0d) / 10.0d;
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

    private long queryForLong(Connection connection, String query, String parameter) throws SQLException {
        try (PreparedStatement statement = connection.prepareStatement(query)) {
            if (parameter != null) {
                statement.setString(1, parameter);
            }

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return 0L;
                }
                return resultSet.getLong(1);
            }
        }
    }

    private long queryForLong(
        Connection connection,
        String query,
        LocalDateTime startInclusive,
        LocalDateTime endExclusive,
        String parameter
    ) throws SQLException {
        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setTimestamp(1, Timestamp.valueOf(startInclusive));
            statement.setTimestamp(2, Timestamp.valueOf(endExclusive));
            if (parameter != null) {
                statement.setString(3, parameter);
            }

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return 0L;
                }
                return resultSet.getLong(1);
            }
        }
    }

    private BigDecimal queryForDecimal(Connection connection, String query, String parameter) throws SQLException {
        try (PreparedStatement statement = connection.prepareStatement(query)) {
            if (parameter != null) {
                statement.setString(1, parameter);
            }

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return BigDecimal.ZERO;
                }

                BigDecimal value = resultSet.getBigDecimal(1);
                return value == null ? BigDecimal.ZERO : value;
            }
        }
    }

    private BigDecimal queryForDecimal(
        Connection connection,
        String query,
        LocalDateTime startInclusive,
        LocalDateTime endExclusive,
        String parameter
    ) throws SQLException {
        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setTimestamp(1, Timestamp.valueOf(startInclusive));
            statement.setTimestamp(2, Timestamp.valueOf(endExclusive));
            if (parameter != null) {
                statement.setString(3, parameter);
            }

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return BigDecimal.ZERO;
                }

                BigDecimal value = resultSet.getBigDecimal(1);
                return value == null ? BigDecimal.ZERO : value;
            }
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

    private String buildBannerExposureSummary(long ruleCount, Timestamp startAt, Timestamp endAt) {
        return joinPlain(
            " / ",
            ruleCount > 0 ? "규칙 " + ruleCount + "개" : "기본 노출",
            startAt != null ? "시작 " + formatTimestamp(startAt) : "",
            endAt != null ? "종료 " + formatTimestamp(endAt) : ""
        );
    }

    private String buildBannerPeriodLabel(Timestamp startAt, Timestamp endAt) {
        return joinPlain(
            " ~ ",
            startAt == null ? "" : formatTimestamp(startAt),
            endAt == null ? "" : formatTimestamp(endAt)
        );
    }

    private String resolveBannerStatusKey(int isActive, Timestamp startAt, Timestamp endAt) {
        if (isActive != 1) {
            return "inactive";
        }

        LocalDateTime now = LocalDateTime.now();
        if (startAt != null && startAt.toLocalDateTime().isAfter(now)) {
            return "draft";
        }
        if (endAt != null && endAt.toLocalDateTime().isBefore(now)) {
            return "inactive";
        }
        return "active";
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

    private String normalizeMembershipStatusLabel(String rawStatus) {
        if (!StringUtils.hasText(rawStatus)) {
            return "상태 미확인";
        }

        return switch (rawStatus.trim().toLowerCase(Locale.ROOT)) {
            case "active" -> "활성";
            case "pending" -> "가입 대기";
            case "paused" -> "일시중지";
            case "expired" -> "만료";
            case "cancelled" -> "해지";
            default -> rawStatus.trim();
        };
    }

    private String normalizeReservationStatusLabel(String rawStatus) {
        if (!StringUtils.hasText(rawStatus)) {
            return "예약 미확인";
        }

        return switch (rawStatus.trim().toLowerCase(Locale.ROOT)) {
            case "pending" -> "예약 대기";
            case "confirmed", "booked" -> "예약 확정";
            case "completed" -> "이용 완료";
            case "cancelled" -> "예약 취소";
            default -> rawStatus.trim();
        };
    }

    private String normalizePaymentStatusLabel(String rawStatus) {
        if (!StringUtils.hasText(rawStatus)) {
            return "결제 미확인";
        }

        return switch (rawStatus.trim().toLowerCase(Locale.ROOT)) {
            case "paid", "approved", "captured" -> "결제 완료";
            case "pending", "requested", "unpaid" -> "결제 대기";
            case "refunded", "partial_refund" -> "환불 완료";
            case "cancelled" -> "결제 취소";
            default -> rawStatus.trim();
        };
    }

    private String buildReservationBookingStatus(String bookingStatus, String paymentStatus, Timestamp cancelledAt) {
        if (cancelledAt != null || "cancelled".equalsIgnoreCase(text(bookingStatus))) {
            return "취소 완료";
        }
        if ("refunded".equalsIgnoreCase(text(paymentStatus)) || "partial_refund".equalsIgnoreCase(text(paymentStatus))) {
            return "환불 완료";
        }
        if ("paid".equalsIgnoreCase(text(paymentStatus)) || "approved".equalsIgnoreCase(text(paymentStatus)) || "captured".equalsIgnoreCase(text(paymentStatus))) {
            return "예약 확정";
        }
        return "처리 대기";
    }

    private String formatReservationAmount(BigDecimal paidAmount, BigDecimal totalAmount, String currency) {
        BigDecimal amount = paidAmount != null && paidAmount.compareTo(BigDecimal.ZERO) > 0 ? paidAmount : totalAmount;
        if (amount == null) {
            amount = BigDecimal.ZERO;
        }
        String suffix = !StringUtils.hasText(currency) || "KRW".equalsIgnoreCase(currency) ? "원" : " " + currency;
        return amount.setScale(0, RoundingMode.HALF_UP).toPlainString() + suffix;
    }

    private String toReservationDomainKey(String bookingType) {
        return switch (text(bookingType).toLowerCase(Locale.ROOT)) {
            case "air" -> "flight";
            case "stay" -> "hotel";
            case "rent" -> "rentcar";
            case "voucher" -> "voucher";
            default -> "all";
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

    private record TimeBucket(
        LocalDateTime startInclusive,
        LocalDateTime endExclusive
    ) {
    }
}
