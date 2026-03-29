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
    private final Map<String, AdminTableSurfaceQueryService> tableSurfaceQueryServices;

    AdminReadService(AppProperties appProperties, ActiveUserPresenceService activeUserPresenceService) {
        this.appProperties = appProperties;
        this.activeUserPresenceService = activeUserPresenceService;
        this.tableSurfaceQueryServices = Map.of(
            "members", new AdminMembersQueryService(),
            "cms", new AdminCmsQueryService(),
            "lodging", new AdminProductQueryService(),
            "reservations", new AdminReservationQueryService()
        );
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
        AdminTableSurfaceQueryService tableSurfaceQueryService = tableSurfaceQueryServices.get(surface);
        if (tableSurfaceQueryService == null) {
            throw new IllegalArgumentException("지원하지 않는 관리자 surface입니다.");
        }

        try (Connection connection = openConnection()) {
            connection.setReadOnly(true);
            return tableSurfaceQueryService.load(connection);
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

    private Map<String, Object> buildLodgingConfig(Connection connection) throws SQLException {
        Map<String, Object> tabs = new LinkedHashMap<>();
        tabs.put("stay", tabConfig(
            "숙박 코드나 상품명으로 검색",
            "상품 일괄 등록",
            "숙박 등록",
            "숙박 상품 데이터가 없습니다.",
            List.of("상품 코드", "도메인", "상품명 / 옵션", "재고 / 수량", "기준가", "상태", "관리"),
            loadLodgingStayRows(connection)
        ));
        tabs.put("flight", tabConfig(
            "항공 코드나 노선으로 검색",
            "상품 일괄 등록",
            "노선 등록",
            "항공 상품 데이터가 없습니다.",
            List.of("상품 코드", "도메인", "노선 / 편명", "좌석", "기준가", "상태", "관리"),
            loadLodgingFlightRows(connection)
        ));
        tabs.put("rentcar", tabConfig(
            "렌터카 코드나 차종으로 검색",
            "상품 일괄 등록",
            "차종 등록",
            "렌터카 상품 데이터가 없습니다.",
            List.of("상품 코드", "도메인", "차종 / 옵션", "보유 대수", "기준가", "상태", "관리"),
            loadLodgingRentcarRows(connection)
        ));
        tabs.put("voucher", tabConfig(
            "바우처 코드나 상품명으로 검색",
            "바우처 일괄 등록",
            "상품 등록",
            "바우처 상품 데이터가 없습니다.",
            List.of("상품 코드", "도메인", "바우처 / 옵션", "보유 수량", "판매가", "상태", "관리"),
            loadLodgingVoucherRows(connection)
        ));
        tabs.put("usim", tabConfig(
            "유심 코드나 상품명으로 검색",
            "유심 확인",
            "유심 등록",
            "유심 상품 데이터가 없습니다.",
            List.of("상품 코드", "도메인", "유심 / 기간", "재고", "판매가", "상태", "관리"),
            loadLodgingUsimRows(connection)
        ));
        tabs.put("special", tabConfig(
            "특가 코드나 상품명으로 검색",
            "선택 항목 확인",
            "특가 생성",
            "특가 / 쿠폰 데이터가 없습니다.",
            List.of("상품 코드", "도메인", "특가 / 쿠폰", "발행 수량", "금액", "상태", "관리"),
            loadLodgingSpecialRows(connection)
        ));

        return tableSurfaceConfig("stay", tabs);
    }

    private List<Map<String, Object>> loadLodgingStayRows(Connection connection) throws SQLException {
        if (!tableExists(connection, "hotel_properties") || !tableExists(connection, "hotel_room_types")) {
            return List.of();
        }

        String query = """
            SELECT
                hp.property_code,
                hp.name AS property_name,
                hp.region_name,
                hp.is_active AS property_active,
                hrt.room_type_code,
                hrt.name AS room_type_name,
                hrt.base_price,
                hrt.max_occupancy,
                hrt.is_active AS room_type_active,
                (
                    SELECT his.available_quantity
                    FROM hotel_inventory_stocks his
                    WHERE his.hotel_room_type_id = hrt.id
                    ORDER BY his.stock_date DESC, his.id DESC
                    LIMIT 1
                ) AS available_quantity,
                (
                    SELECT his.total_quantity
                    FROM hotel_inventory_stocks his
                    WHERE his.hotel_room_type_id = hrt.id
                    ORDER BY his.stock_date DESC, his.id DESC
                    LIMIT 1
                ) AS total_quantity,
                (
                    SELECT his.status
                    FROM hotel_inventory_stocks his
                    WHERE his.hotel_room_type_id = hrt.id
                    ORDER BY his.stock_date DESC, his.id DESC
                    LIMIT 1
                ) AS inventory_status
            FROM hotel_properties hp
            INNER JOIN hotel_room_types hrt ON hrt.hotel_property_id = hp.id
            ORDER BY hp.is_active DESC, hrt.is_active DESC, hp.name ASC, hrt.name ASC
            """;

        List<Map<String, Object>> rows = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                Integer availableQuantity = nullableInteger(resultSet, "available_quantity");
                Integer totalQuantity = nullableInteger(resultSet, "total_quantity");
                boolean active = resultSet.getInt("property_active") == 1 && resultSet.getInt("room_type_active") == 1;

                rows.add(row(
                    searchable(
                        resultSet.getString("property_code"),
                        resultSet.getString("room_type_code"),
                        resultSet.getString("property_name"),
                        resultSet.getString("room_type_name"),
                        resultSet.getString("region_name")
                    ),
                    List.of(
                        joinCode(resultSet.getString("property_code"), resultSet.getString("room_type_code")),
                        "숙박",
                        joinPlain(
                            " / ",
                            text(resultSet.getString("property_name")),
                            text(resultSet.getString("room_type_name")),
                            resultSet.getInt("max_occupancy") > 0 ? "정원 " + resultSet.getInt("max_occupancy") + "인" : ""
                        ),
                        formatQuantity(availableQuantity, totalQuantity, "실", "재고 미집계"),
                        formatAmount(resultSet.getBigDecimal("base_price"), "KRW"),
                        buildCatalogStatusLabel(active, resultSet.getString("inventory_status"), availableQuantity),
                        "읽기 전용"
                    )
                ));
            }
        }

        return rows;
    }

    private List<Map<String, Object>> loadLodgingFlightRows(Connection connection) throws SQLException {
        if (!tableExists(connection, "flight_products") || !tableExists(connection, "flight_routes")) {
            return List.of();
        }

        String query = """
            SELECT
                fp.product_code,
                fp.product_name,
                fp.flight_no,
                fp.cabin_class,
                fp.fare_class,
                fp.is_active AS product_active,
                fr.route_name,
                fr.departure_airport_code,
                fr.arrival_airport_code,
                fr.is_active AS route_active,
                (
                    SELECT fis.available_seats
                    FROM flight_inventory_stocks fis
                    INNER JOIN flight_schedules fs ON fs.id = fis.flight_schedule_id
                    WHERE fs.flight_route_id = fp.flight_route_id
                      AND (fp.flight_no IS NULL OR fs.flight_no = fp.flight_no)
                    ORDER BY fis.inventory_date DESC, fis.id DESC
                    LIMIT 1
                ) AS available_seats,
                (
                    SELECT fis.total_seats
                    FROM flight_inventory_stocks fis
                    INNER JOIN flight_schedules fs ON fs.id = fis.flight_schedule_id
                    WHERE fs.flight_route_id = fp.flight_route_id
                      AND (fp.flight_no IS NULL OR fs.flight_no = fp.flight_no)
                    ORDER BY fis.inventory_date DESC, fis.id DESC
                    LIMIT 1
                ) AS total_seats,
                (
                    SELECT fis.status
                    FROM flight_inventory_stocks fis
                    INNER JOIN flight_schedules fs ON fs.id = fis.flight_schedule_id
                    WHERE fs.flight_route_id = fp.flight_route_id
                      AND (fp.flight_no IS NULL OR fs.flight_no = fp.flight_no)
                    ORDER BY fis.inventory_date DESC, fis.id DESC
                    LIMIT 1
                ) AS inventory_status,
                (
                    SELECT ffp.base_fare
                    FROM flight_fare_policies ffp
                    WHERE ffp.flight_route_id = fp.flight_route_id
                      AND (ffp.fare_class = fp.fare_class OR ffp.fare_class IS NULL)
                    ORDER BY ffp.is_active DESC, ffp.priority ASC, ffp.id ASC
                    LIMIT 1
                ) AS base_fare
            FROM flight_products fp
            INNER JOIN flight_routes fr ON fr.id = fp.flight_route_id
            ORDER BY fp.is_active DESC, fr.route_name ASC, fp.flight_no ASC, fp.product_code ASC
            """;

        List<Map<String, Object>> rows = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                Integer availableSeats = nullableInteger(resultSet, "available_seats");
                Integer totalSeats = nullableInteger(resultSet, "total_seats");
                boolean active = resultSet.getInt("product_active") == 1 && resultSet.getInt("route_active") == 1;

                rows.add(row(
                    searchable(
                        resultSet.getString("product_code"),
                        resultSet.getString("product_name"),
                        resultSet.getString("route_name"),
                        resultSet.getString("flight_no"),
                        resultSet.getString("departure_airport_code"),
                        resultSet.getString("arrival_airport_code")
                    ),
                    List.of(
                        text(resultSet.getString("product_code")),
                        "항공",
                        joinPlain(
                            " / ",
                            text(resultSet.getString("route_name")),
                            text(resultSet.getString("flight_no")),
                            joinPlain(" ", normalizeCabinClassLabel(resultSet.getString("cabin_class")), normalizeFareClassLabel(resultSet.getString("fare_class")))
                        ),
                        formatQuantity(availableSeats, totalSeats, "석", "좌석 미집계"),
                        formatAmount(resultSet.getBigDecimal("base_fare"), "KRW"),
                        buildCatalogStatusLabel(active, resultSet.getString("inventory_status"), availableSeats),
                        "읽기 전용"
                    )
                ));
            }
        }

        return rows;
    }

    private List<Map<String, Object>> loadLodgingRentcarRows(Connection connection) throws SQLException {
        if (!tableExists(connection, "rentcar_products")
            || !tableExists(connection, "rentcar_branches")
            || !tableExists(connection, "rentcar_vehicle_models")) {
            return List.of();
        }

        String query = """
            SELECT
                rp.vehicle_code,
                rp.vehicle_name,
                rp.manufacturer,
                rp.model_name,
                rp.status AS product_status,
                rp.is_active AS product_active,
                rb.location_name,
                rvm.class_name,
                rvm.vehicle_category,
                (
                    SELECT ris.is_rentable
                    FROM rentcar_inventory_stocks ris
                    WHERE ris.rentcar_product_id = rp.id
                    ORDER BY ris.inventory_date DESC, ris.id DESC
                    LIMIT 1
                ) AS is_rentable,
                (
                    SELECT ris.inventory_status
                    FROM rentcar_inventory_stocks ris
                    WHERE ris.rentcar_product_id = rp.id
                    ORDER BY ris.inventory_date DESC, ris.id DESC
                    LIMIT 1
                ) AS inventory_status,
                (
                    SELECT rrp.daily_rate
                    FROM rentcar_rate_policies rrp
                    WHERE rrp.rentcar_branch_id = rp.rentcar_branch_id
                      AND rrp.rentcar_vehicle_model_id = rp.rentcar_vehicle_model_id
                    ORDER BY rrp.is_active DESC, rrp.priority ASC, rrp.id ASC
                    LIMIT 1
                ) AS daily_rate
            FROM rentcar_products rp
            INNER JOIN rentcar_branches rb ON rb.id = rp.rentcar_branch_id
            INNER JOIN rentcar_vehicle_models rvm ON rvm.id = rp.rentcar_vehicle_model_id
            ORDER BY rp.is_active DESC, rvm.class_name ASC, rp.vehicle_name ASC
            """;

        List<Map<String, Object>> rows = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                Integer rentable = nullableInteger(resultSet, "is_rentable");
                Integer availableQuantity = rentable == null ? null : (rentable == 1 ? 1 : 0);

                rows.add(row(
                    searchable(
                        resultSet.getString("vehicle_code"),
                        resultSet.getString("vehicle_name"),
                        resultSet.getString("manufacturer"),
                        resultSet.getString("model_name"),
                        resultSet.getString("class_name"),
                        resultSet.getString("location_name")
                    ),
                    List.of(
                        text(resultSet.getString("vehicle_code")),
                        "렌터카",
                        joinPlain(
                            " / ",
                            text(resultSet.getString("vehicle_name")),
                            text(resultSet.getString("class_name")),
                            text(resultSet.getString("location_name"))
                        ),
                        formatQuantity(availableQuantity, 1, "대", "보유량 미집계"),
                        formatAmount(resultSet.getBigDecimal("daily_rate"), "KRW"),
                        buildRentcarStatusLabel(
                            resultSet.getInt("product_active") == 1,
                            resultSet.getString("product_status"),
                            resultSet.getString("inventory_status"),
                            rentable
                        ),
                        "읽기 전용"
                    )
                ));
            }
        }

        return rows;
    }

    private List<Map<String, Object>> loadLodgingVoucherRows(Connection connection) throws SQLException {
        if (!tableExists(connection, "voucher_products")) {
            return List.of();
        }

        String query = """
            SELECT
                vp.voucher_code,
                vp.product_name,
                vp.voucher_type,
                vp.sale_price,
                vp.valid_days,
                vp.is_active,
                hp.name AS property_name,
                (
                    SELECT COUNT(*)
                    FROM voucher_product_benefits vpb
                    WHERE vpb.voucher_product_id = vp.id
                      AND vpb.is_active = 1
                ) AS benefit_count
            FROM voucher_products vp
            LEFT JOIN hotel_properties hp ON hp.id = vp.property_id
            ORDER BY vp.is_active DESC, vp.product_name ASC, vp.voucher_code ASC
            """;

        List<Map<String, Object>> rows = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                Integer benefitCount = nullableInteger(resultSet, "benefit_count");

                rows.add(row(
                    searchable(
                        resultSet.getString("voucher_code"),
                        resultSet.getString("product_name"),
                        resultSet.getString("voucher_type"),
                        resultSet.getString("property_name")
                    ),
                    List.of(
                        text(resultSet.getString("voucher_code")),
                        "바우처",
                        joinPlain(
                            " / ",
                            text(resultSet.getString("product_name")),
                            normalizeVoucherTypeLabel(resultSet.getString("voucher_type")),
                            text(resultSet.getString("property_name"))
                        ),
                        benefitCount == null ? "제한 없음" : "혜택 " + benefitCount + "개",
                        formatAmount(resultSet.getBigDecimal("sale_price"), "KRW"),
                        resultSet.getInt("is_active") == 1 ? "판매 중" : "비활성",
                        "읽기 전용"
                    )
                ));
            }
        }

        return rows;
    }

    private List<Map<String, Object>> loadLodgingUsimRows(Connection connection) throws SQLException {
        if (!tableExists(connection, "usim_products")) {
            return List.of();
        }

        String query = """
            SELECT
                up.product_code,
                up.product_name,
                up.carrier_name,
                up.plan_type,
                up.valid_days,
                up.sale_price,
                up.is_active,
                (
                    SELECT uis.available_quantity
                    FROM usim_inventory_stocks uis
                    WHERE uis.usim_product_id = up.id
                    ORDER BY uis.inventory_date DESC, uis.id DESC
                    LIMIT 1
                ) AS available_quantity,
                (
                    SELECT uis.total_quantity
                    FROM usim_inventory_stocks uis
                    WHERE uis.usim_product_id = up.id
                    ORDER BY uis.inventory_date DESC, uis.id DESC
                    LIMIT 1
                ) AS total_quantity,
                (
                    SELECT uis.status
                    FROM usim_inventory_stocks uis
                    WHERE uis.usim_product_id = up.id
                    ORDER BY uis.inventory_date DESC, uis.id DESC
                    LIMIT 1
                ) AS inventory_status
            FROM usim_products up
            ORDER BY up.is_active DESC, up.product_name ASC, up.product_code ASC
            """;

        List<Map<String, Object>> rows = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                Integer availableQuantity = nullableInteger(resultSet, "available_quantity");
                Integer totalQuantity = nullableInteger(resultSet, "total_quantity");

                rows.add(row(
                    searchable(
                        resultSet.getString("product_code"),
                        resultSet.getString("product_name"),
                        resultSet.getString("carrier_name"),
                        resultSet.getString("plan_type")
                    ),
                    List.of(
                        text(resultSet.getString("product_code")),
                        "유심",
                        joinPlain(
                            " / ",
                            text(resultSet.getString("product_name")),
                            normalizeUsimPlanLabel(resultSet.getString("plan_type")),
                            resultSet.getInt("valid_days") > 0 ? resultSet.getInt("valid_days") + "일" : ""
                        ),
                        formatQuantity(availableQuantity, totalQuantity, "개", "재고 미집계"),
                        formatAmount(resultSet.getBigDecimal("sale_price"), "KRW"),
                        buildCatalogStatusLabel(resultSet.getInt("is_active") == 1, resultSet.getString("inventory_status"), availableQuantity),
                        "읽기 전용"
                    )
                ));
            }
        }

        return rows;
    }

    private List<Map<String, Object>> loadLodgingSpecialRows(Connection connection) throws SQLException {
        List<Map<String, Object>> rows = new ArrayList<>();
        rows.addAll(loadSpecialProductRows(connection));
        rows.addAll(loadCouponRows(connection));
        return rows;
    }

    private List<Map<String, Object>> loadSpecialProductRows(Connection connection) throws SQLException {
        if (!tableExists(connection, "special_products")) {
            return List.of();
        }

        String query = """
            SELECT
                sp.product_code,
                sp.product_name,
                sp.product_type,
                sp.channel_code,
                sp.is_active,
                (
                    SELECT sis.available_quantity
                    FROM special_inventory_stocks sis
                    WHERE sis.special_product_id = sp.id
                    ORDER BY sis.inventory_date DESC, sis.id DESC
                    LIMIT 1
                ) AS available_quantity,
                (
                    SELECT sis.total_quantity
                    FROM special_inventory_stocks sis
                    WHERE sis.special_product_id = sp.id
                    ORDER BY sis.inventory_date DESC, sis.id DESC
                    LIMIT 1
                ) AS total_quantity,
                (
                    SELECT sis.status
                    FROM special_inventory_stocks sis
                    WHERE sis.special_product_id = sp.id
                    ORDER BY sis.inventory_date DESC, sis.id DESC
                    LIMIT 1
                ) AS inventory_status
            FROM special_products sp
            ORDER BY sp.is_active DESC, sp.product_name ASC, sp.product_code ASC
            """;

        List<Map<String, Object>> rows = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                Integer availableQuantity = nullableInteger(resultSet, "available_quantity");
                Integer totalQuantity = nullableInteger(resultSet, "total_quantity");

                rows.add(row(
                    searchable(
                        resultSet.getString("product_code"),
                        resultSet.getString("product_name"),
                        resultSet.getString("product_type"),
                        resultSet.getString("channel_code")
                    ),
                    List.of(
                        text(resultSet.getString("product_code")),
                        "특가",
                        joinPlain(
                            " / ",
                            text(resultSet.getString("product_name")),
                            normalizeSpecialTypeLabel(resultSet.getString("product_type")),
                            text(resultSet.getString("channel_code"))
                        ),
                        formatQuantity(availableQuantity, totalQuantity, "개", "발행량 미집계"),
                        "-",
                        buildCatalogStatusLabel(resultSet.getInt("is_active") == 1, resultSet.getString("inventory_status"), availableQuantity),
                        "읽기 전용"
                    )
                ));
            }
        }

        return rows;
    }

    private List<Map<String, Object>> loadCouponRows(Connection connection) throws SQLException {
        if (!tableExists(connection, "coupons")) {
            return List.of();
        }

        String query = """
            SELECT
                c.coupon_code,
                c.coupon_name,
                c.coupon_type,
                c.discount_value,
                c.issue_limit,
                c.is_active
            FROM coupons c
            ORDER BY c.is_active DESC, c.coupon_name ASC, c.coupon_code ASC
            """;

        List<Map<String, Object>> rows = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                Integer issueLimit = nullableInteger(resultSet, "issue_limit");

                rows.add(row(
                    searchable(
                        resultSet.getString("coupon_code"),
                        resultSet.getString("coupon_name"),
                        resultSet.getString("coupon_type")
                    ),
                    List.of(
                        text(resultSet.getString("coupon_code")),
                        "쿠폰",
                        joinPlain(
                            " / ",
                            text(resultSet.getString("coupon_name")),
                            normalizeCouponTypeLabel(resultSet.getString("coupon_type"))
                        ),
                        issueLimit == null ? "제한 없음" : issueLimit + "개",
                        formatAmount(resultSet.getBigDecimal("discount_value"), "KRW"),
                        resultSet.getInt("is_active") == 1 ? "발행 중" : "비활성",
                        "읽기 전용"
                    )
                ));
            }
        }

        return rows;
    }

    private Map<String, Object> buildReservationConfig(Connection connection) throws SQLException {
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
            "결제번호나 주문명으로 검색",
            "정산 내역 보기",
            "결제 등록",
            "결제 데이터가 없습니다.",
            List.of("번호", "도메인", "결제 수단 / 주문", "고객 / 연락처", "확인 금액", "확인 시각", "상태", "관리"),
            loadReservationPaymentRows(connection)
        ));
        tabs.put("refund", schemaTabConfig(
            "환불번호나 사유로 검색",
            "승인 대기 보기",
            "환불 승인",
            "환불 데이터가 없습니다.",
            List.of("번호", "도메인", "환불 / 사유", "고객 / 연락처", "환불액", "처리 시각", "상태", "관리"),
            loadReservationRefundRows(connection)
        ));
        tabs.put("traveler", schemaTabConfig(
            "이용자나 탑승객 정보로 검색",
            "이용자 확인",
            "명단 등록",
            "탑승객 / 이용자 데이터가 없습니다.",
            List.of("번호", "도메인", "예약 / 이용 상품", "이용자", "체크인 / 이용", "상태", "관리"),
            loadReservationTravelerRows(connection)
        ));

        return tableSurfaceConfig("booking", tabs);
    }

    private interface AdminTableSurfaceQueryService {
        Map<String, Object> load(Connection connection) throws SQLException;
    }

    private final class AdminMembersQueryService implements AdminTableSurfaceQueryService {
        @Override
        public Map<String, Object> load(Connection connection) throws SQLException {
            return buildMembersConfig(connection);
        }
    }

    private final class AdminCmsQueryService implements AdminTableSurfaceQueryService {
        @Override
        public Map<String, Object> load(Connection connection) throws SQLException {
            return buildCmsConfig(connection);
        }
    }

    private final class AdminProductQueryService implements AdminTableSurfaceQueryService {
        @Override
        public Map<String, Object> load(Connection connection) throws SQLException {
            return buildLodgingConfig(connection);
        }
    }

    private final class AdminReservationQueryService implements AdminTableSurfaceQueryService {
        @Override
        public Map<String, Object> load(Connection connection) throws SQLException {
            return buildReservationConfig(connection);
        }
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

    private List<Map<String, Object>> loadReservationPaymentRows(Connection connection) throws SQLException {
        if (!tableExists(connection, "payment_transactions")
            || !tableExists(connection, "payment_attempts")
            || !tableExists(connection, "bookings")) {
            return List.of();
        }

        String query = """
            SELECT
                pt.transaction_no,
                pt.status AS transaction_status,
                pt.amount,
                pt.currency,
                pt.approved_at,
                pt.processed_at,
                pt.created_at AS transaction_created_at,
                pa.payment_provider,
                pa.payment_method,
                pa.status AS attempt_status,
                pa.requested_at,
                pa.completed_at,
                pa.requested_amount,
                pa.approved_amount,
                b.booking_no,
                b.booking_type,
                COALESCE(NULLIF(TRIM(up.display_name), ''), u.name, b.user_id) AS display_name,
                u.email,
                u.phone
            FROM payment_transactions pt
            INNER JOIN payment_attempts pa ON pa.id = pt.payment_attempt_id
            INNER JOIN bookings b ON b.id = pa.booking_id
            LEFT JOIN users u ON u.id = b.user_id
            LEFT JOIN user_profiles up ON up.user_id = b.user_id
            ORDER BY COALESCE(pt.approved_at, pt.processed_at, pa.completed_at, pa.requested_at, pt.created_at) DESC, pt.id DESC
            """;

        List<Map<String, Object>> rows = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                String bookingType = text(resultSet.getString("booking_type"));
                String domainKey = toReservationDomainKey(bookingType);
                String paymentStatus = text(resultSet.getString("transaction_status"));
                if (paymentStatus.isBlank()) {
                    paymentStatus = text(resultSet.getString("attempt_status"));
                }
                String paymentStatusLabel = normalizePaymentStatusLabel(paymentStatus);
                String paymentMethodLabel = normalizePaymentMethodLabel(resultSet.getString("payment_method"));

                rows.add(domainRow(
                    searchable(
                        resultSet.getString("transaction_no"),
                        resultSet.getString("booking_no"),
                        resultSet.getString("display_name"),
                        resultSet.getString("email"),
                        resultSet.getString("phone"),
                        resultSet.getString("payment_provider"),
                        resultSet.getString("payment_method"),
                        paymentStatusLabel
                    ),
                    List.of(
                        text(resultSet.getString("transaction_no")),
                        displayBookingType(bookingType),
                        joinPlain(" / ", paymentMethodLabel, text(resultSet.getString("booking_no"))),
                        joinPlain(" / ", text(resultSet.getString("display_name")), text(resultSet.getString("email")), text(resultSet.getString("phone"))),
                        formatAmount(
                            firstNonNullAmount(
                                resultSet.getBigDecimal("amount"),
                                resultSet.getBigDecimal("approved_amount"),
                                resultSet.getBigDecimal("requested_amount")
                            ),
                            resultSet.getString("currency")
                        ),
                        formatTimestamp(firstNonNull(
                            resultSet.getTimestamp("approved_at"),
                            resultSet.getTimestamp("processed_at"),
                            resultSet.getTimestamp("completed_at"),
                            resultSet.getTimestamp("requested_at"),
                            resultSet.getTimestamp("transaction_created_at")
                        )),
                        paymentStatusLabel,
                        "읽기 전용"
                    ),
                    domainKey
                ));
            }
        }

        return rows;
    }

    private List<Map<String, Object>> loadReservationRefundRows(Connection connection) throws SQLException {
        if (!tableExists(connection, "payment_refunds")
            || !tableExists(connection, "payment_transactions")
            || !tableExists(connection, "payment_attempts")
            || !tableExists(connection, "bookings")) {
            return List.of();
        }

        String query = """
            SELECT
                pr.refund_no,
                pr.status,
                pr.refund_amount,
                pr.currency,
                pr.reason,
                pr.requested_at,
                pr.completed_at,
                pr.created_at,
                b.booking_no,
                b.booking_type,
                COALESCE(NULLIF(TRIM(up.display_name), ''), u.name, b.user_id) AS display_name,
                u.email,
                u.phone
            FROM payment_refunds pr
            INNER JOIN payment_transactions pt ON pt.id = pr.payment_transaction_id
            INNER JOIN payment_attempts pa ON pa.id = pt.payment_attempt_id
            INNER JOIN bookings b ON b.id = pa.booking_id
            LEFT JOIN users u ON u.id = b.user_id
            LEFT JOIN user_profiles up ON up.user_id = b.user_id
            ORDER BY COALESCE(pr.completed_at, pr.requested_at, pr.created_at) DESC, pr.id DESC
            """;

        List<Map<String, Object>> rows = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                String bookingType = text(resultSet.getString("booking_type"));
                String domainKey = toReservationDomainKey(bookingType);
                String refundStatusLabel = resolveRefundStatusLabel(resultSet.getString("status"));
                String refundReason = text(resultSet.getString("reason"));
                if (refundReason.isBlank()) {
                    refundReason = "사유 미입력";
                }

                rows.add(domainRow(
                    searchable(
                        resultSet.getString("refund_no"),
                        resultSet.getString("booking_no"),
                        refundReason,
                        resultSet.getString("display_name"),
                        resultSet.getString("email"),
                        resultSet.getString("phone"),
                        refundStatusLabel
                    ),
                    List.of(
                        text(resultSet.getString("refund_no")),
                        displayBookingType(bookingType),
                        joinPlain(" / ", text(resultSet.getString("booking_no")), refundReason),
                        joinPlain(" / ", text(resultSet.getString("display_name")), text(resultSet.getString("email")), text(resultSet.getString("phone"))),
                        formatAmount(resultSet.getBigDecimal("refund_amount"), resultSet.getString("currency")),
                        formatTimestamp(firstNonNull(
                            resultSet.getTimestamp("completed_at"),
                            resultSet.getTimestamp("requested_at"),
                            resultSet.getTimestamp("created_at")
                        )),
                        refundStatusLabel,
                        "읽기 전용"
                    ),
                    domainKey
                ));
            }
        }

        return rows;
    }

    private List<Map<String, Object>> loadReservationTravelerRows(Connection connection) throws SQLException {
        if (!tableExists(connection, "booking_passengers") || !tableExists(connection, "bookings")) {
            return List.of();
        }

        boolean hasTravelEvents = tableExists(connection, "travel_events");
        String query = hasTravelEvents
            ? """
                SELECT
                    b.booking_no,
                    b.booking_type,
                    b.status AS booking_status,
                    b.payment_status,
                    b.cancelled_at,
                    bp.passenger_no,
                    COALESCE(NULLIF(TRIM(bp.passenger_name), ''), NULLIF(TRIM(up.display_name), ''), u.name, b.user_id) AS traveler_name,
                    COALESCE(NULLIF(TRIM(bp.phone), ''), u.phone) AS traveler_phone,
                    COALESCE(NULLIF(TRIM(bp.email), ''), u.email) AS traveler_email,
                    DATE_FORMAT(te.event_date, '%Y.%m.%d') AS event_date_label,
                    DATE_FORMAT(te.event_time, '%H:%i') AS event_time_label,
                    COALESCE(NULLIF(TRIM(te.activity_label), ''), te.title) AS activity_label,
                    te.status AS event_status
                FROM booking_passengers bp
                INNER JOIN bookings b ON b.id = bp.booking_id
                LEFT JOIN users u ON u.id = COALESCE(bp.user_id, b.user_id)
                LEFT JOIN user_profiles up ON up.user_id = COALESCE(bp.user_id, b.user_id)
                LEFT JOIN travel_events te
                    ON te.id = (
                        SELECT te2.id
                        FROM travel_events te2
                        WHERE te2.booking_id = bp.booking_id
                          AND (te2.booking_passenger_id = bp.id OR te2.booking_passenger_id IS NULL)
                        ORDER BY te2.event_date DESC, te2.event_time DESC, te2.id DESC
                        LIMIT 1
                    )
                ORDER BY COALESCE(te.event_date, DATE(COALESCE(b.booked_at, b.created_at))) DESC, bp.booking_id DESC, bp.passenger_no ASC
                """
            : """
                SELECT
                    b.booking_no,
                    b.booking_type,
                    b.status AS booking_status,
                    b.payment_status,
                    b.cancelled_at,
                    bp.passenger_no,
                    COALESCE(NULLIF(TRIM(bp.passenger_name), ''), NULLIF(TRIM(up.display_name), ''), u.name, b.user_id) AS traveler_name,
                    COALESCE(NULLIF(TRIM(bp.phone), ''), u.phone) AS traveler_phone,
                    COALESCE(NULLIF(TRIM(bp.email), ''), u.email) AS traveler_email,
                    NULL AS event_date_label,
                    NULL AS event_time_label,
                    NULL AS activity_label,
                    NULL AS event_status
                FROM booking_passengers bp
                INNER JOIN bookings b ON b.id = bp.booking_id
                LEFT JOIN users u ON u.id = COALESCE(bp.user_id, b.user_id)
                LEFT JOIN user_profiles up ON up.user_id = COALESCE(bp.user_id, b.user_id)
                ORDER BY COALESCE(b.booked_at, b.created_at) DESC, bp.booking_id DESC, bp.passenger_no ASC
                """;

        List<Map<String, Object>> rows = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                String bookingType = text(resultSet.getString("booking_type"));
                String domainKey = toReservationDomainKey(bookingType);
                String travelerStatus = buildTravelerStatus(
                    resultSet.getString("event_status"),
                    resultSet.getString("booking_status"),
                    resultSet.getString("payment_status"),
                    resultSet.getTimestamp("cancelled_at")
                );
                String activityLabel = text(resultSet.getString("activity_label"));
                if (activityLabel.isBlank()) {
                    activityLabel = displayBookingType(bookingType) + " 일정";
                }

                String travelerNo = joinPlain("-", text(resultSet.getString("booking_no")), "P" + resultSet.getInt("passenger_no"));
                String travelerName = text(resultSet.getString("traveler_name"));
                String travelerPhone = text(resultSet.getString("traveler_phone"));
                String travelerEmail = text(resultSet.getString("traveler_email"));

                rows.add(domainRow(
                    searchable(
                        travelerNo,
                        resultSet.getString("booking_no"),
                        travelerName,
                        travelerPhone,
                        travelerEmail,
                        activityLabel,
                        travelerStatus
                    ),
                    List.of(
                        travelerNo,
                        displayBookingType(bookingType),
                        joinPlain(" / ", text(resultSet.getString("booking_no")), activityLabel),
                        joinPlain(" / ", travelerName, travelerPhone, travelerEmail),
                        buildTravelerScheduleLabel(
                            resultSet.getString("event_date_label"),
                            resultSet.getString("event_time_label"),
                            activityLabel
                        ),
                        travelerStatus,
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
            SELECT id, service_type, notice_type, title, published_at, created_at, is_active
            FROM notices
            ORDER BY COALESCE(published_at, created_at) DESC, id DESC
            """;

        List<Map<String, Object>> rows = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                String title = text(resultSet.getString("title"));
                String serviceType = displayServiceType(resultSet.getString("service_type"));
                String noticeType = text(resultSet.getString("notice_type"));
                Timestamp publishedAt = resultSet.getTimestamp("published_at");
                String scheduleText = publishedAt == null ? formatTimestamp(resultSet.getTimestamp("created_at")) : formatTimestamp(publishedAt);
                String statusKey = resolveNoticeStatusKey(resultSet.getInt("is_active"), publishedAt);
                String statusLabel = resolveStatusLabel(statusKey);

                rows.add(statusRow(
                    searchable(String.valueOf(resultSet.getLong("id")), title, serviceType),
                    List.of(
                        String.valueOf(resultSet.getLong("id")),
                        serviceType,
                        noticeType.isBlank() ? "notice" : noticeType,
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

    private String normalizePaymentMethodLabel(String rawMethod) {
        if (!StringUtils.hasText(rawMethod)) {
            return "결제수단 미확인";
        }

        return switch (rawMethod.trim().toLowerCase(Locale.ROOT)) {
            case "card", "credit_card" -> "카드";
            case "bank_transfer", "transfer", "account_transfer" -> "계좌이체";
            case "simple", "simple_pay", "easy_pay", "kakao_pay", "naver_pay", "toss_pay" -> "간편결제";
            case "cash" -> "현금";
            default -> rawMethod.trim();
        };
    }

    private String normalizeCabinClassLabel(String rawCabinClass) {
        if (!StringUtils.hasText(rawCabinClass)) {
            return "";
        }

        return switch (rawCabinClass.trim().toLowerCase(Locale.ROOT)) {
            case "economy" -> "이코노미";
            case "premium_economy" -> "프리미엄 이코노미";
            case "business" -> "비즈니스";
            case "first" -> "퍼스트";
            default -> rawCabinClass.trim();
        };
    }

    private String normalizeFareClassLabel(String rawFareClass) {
        if (!StringUtils.hasText(rawFareClass)) {
            return "";
        }

        return switch (rawFareClass.trim().toLowerCase(Locale.ROOT)) {
            case "standard" -> "스탠다드";
            case "flex" -> "플렉스";
            case "sale" -> "특가";
            default -> rawFareClass.trim();
        };
    }

    private String normalizeVoucherTypeLabel(String rawVoucherType) {
        if (!StringUtils.hasText(rawVoucherType)) {
            return "";
        }

        return switch (rawVoucherType.trim().toLowerCase(Locale.ROOT)) {
            case "discount" -> "할인권";
            case "package" -> "패키지";
            case "gift" -> "기프트";
            default -> rawVoucherType.trim();
        };
    }

    private String normalizeUsimPlanLabel(String rawPlanType) {
        if (!StringUtils.hasText(rawPlanType)) {
            return "";
        }

        return switch (rawPlanType.trim().toLowerCase(Locale.ROOT)) {
            case "daily" -> "일간형";
            case "unlimited" -> "무제한";
            case "fixed" -> "정액형";
            default -> rawPlanType.trim();
        };
    }

    private String normalizeSpecialTypeLabel(String rawProductType) {
        if (!StringUtils.hasText(rawProductType)) {
            return "";
        }

        return switch (rawProductType.trim().toLowerCase(Locale.ROOT)) {
            case "special" -> "특가";
            case "promotion" -> "프로모션";
            case "flash_sale" -> "타임세일";
            default -> rawProductType.trim();
        };
    }

    private String normalizeCouponTypeLabel(String rawCouponType) {
        if (!StringUtils.hasText(rawCouponType)) {
            return "";
        }

        return switch (rawCouponType.trim().toLowerCase(Locale.ROOT)) {
            case "amount" -> "정액 할인";
            case "rate", "percent" -> "정률 할인";
            case "special" -> "특가 쿠폰";
            default -> rawCouponType.trim();
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

    private String buildTravelerStatus(String eventStatus, String bookingStatus, String paymentStatus, Timestamp cancelledAt) {
        if (StringUtils.hasText(eventStatus)) {
            return normalizeTravelerStatusLabel(eventStatus);
        }
        return buildReservationBookingStatus(bookingStatus, paymentStatus, cancelledAt);
    }

    private String normalizeTravelerStatusLabel(String rawStatus) {
        if (!StringUtils.hasText(rawStatus)) {
            return "이용 상태 미확인";
        }

        return switch (rawStatus.trim().toLowerCase(Locale.ROOT)) {
            case "reserved", "scheduled" -> "이용 예정";
            case "checked_in" -> "체크인 완료";
            case "boarded" -> "탑승 완료";
            case "in_progress", "active" -> "이용 중";
            case "completed" -> "이용 완료";
            case "cancelled" -> "이용 취소";
            default -> rawStatus.trim();
        };
    }

    private String formatReservationAmount(BigDecimal paidAmount, BigDecimal totalAmount, String currency) {
        BigDecimal amount = paidAmount != null && paidAmount.compareTo(BigDecimal.ZERO) > 0 ? paidAmount : totalAmount;
        if (amount == null) {
            amount = BigDecimal.ZERO;
        }
        String suffix = !StringUtils.hasText(currency) || "KRW".equalsIgnoreCase(currency) ? "원" : " " + currency;
        return amount.setScale(0, RoundingMode.HALF_UP).toPlainString() + suffix;
    }

    private String formatAmount(BigDecimal amount, String currency) {
        BigDecimal safeAmount = amount == null ? BigDecimal.ZERO : amount;
        String suffix = !StringUtils.hasText(currency) || "KRW".equalsIgnoreCase(currency) ? "원" : " " + currency;
        return safeAmount.setScale(0, RoundingMode.HALF_UP).toPlainString() + suffix;
    }

    private String formatQuantity(Integer availableQuantity, Integer totalQuantity, String unit, String emptyLabel) {
        if (availableQuantity == null && totalQuantity == null) {
            return emptyLabel;
        }
        if (totalQuantity == null) {
            return availableQuantity + unit;
        }
        int safeAvailableQuantity = availableQuantity == null ? 0 : availableQuantity;
        return safeAvailableQuantity + unit + " / " + totalQuantity + unit;
    }

    private String joinCode(String firstCode, String secondCode) {
        String normalizedFirstCode = text(firstCode);
        String normalizedSecondCode = text(secondCode);
        if (normalizedFirstCode.isBlank()) {
            return normalizedSecondCode;
        }
        if (normalizedSecondCode.isBlank()) {
            return normalizedFirstCode;
        }
        return normalizedFirstCode + "-" + normalizedSecondCode;
    }

    private String buildTravelerScheduleLabel(String dateLabel, String timeLabel, String activityLabel) {
        String when = joinPlain(" ", text(dateLabel), text(timeLabel));
        String schedule = joinPlain(" / ", "-".equals(when) ? "" : when, text(activityLabel));
        return "-".equals(schedule) ? "일정 미확정" : schedule;
    }

    private String buildCatalogStatusLabel(boolean active, String rawInventoryStatus, Integer availableQuantity) {
        if (!active) {
            return "비활성";
        }
        if (availableQuantity != null && availableQuantity <= 0) {
            return "품절";
        }

        String normalized = text(rawInventoryStatus).toLowerCase(Locale.ROOT);
        return switch (normalized) {
            case "", "open", "available", "active" -> "판매 중";
            case "blocked", "maintenance", "inactive" -> "운영 중지";
            case "sold_out", "closed", "full" -> "품절";
            default -> rawInventoryStatus == null ? "판매 중" : rawInventoryStatus.trim();
        };
    }

    private String buildRentcarStatusLabel(boolean active, String productStatus, String inventoryStatus, Integer rentable) {
        if (!active) {
            return "비활성";
        }
        if (rentable != null && rentable == 0) {
            return "대여 불가";
        }

        String normalizedProductStatus = text(productStatus).toLowerCase(Locale.ROOT);
        if ("maintenance".equals(normalizedProductStatus) || "repair".equals(normalizedProductStatus)) {
            return "정비 중";
        }
        if ("reserved".equals(normalizedProductStatus) || "rented".equals(normalizedProductStatus)) {
            return "대여 중";
        }

        String normalizedInventoryStatus = text(inventoryStatus).toLowerCase(Locale.ROOT);
        return switch (normalizedInventoryStatus) {
            case "", "available", "open" -> "대여 가능";
            case "reserved", "booked" -> "예약 중";
            case "blocked", "maintenance", "inactive" -> "운영 중지";
            default -> normalizedProductStatus.isBlank() ? "대여 가능" : productStatus.trim();
        };
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

    private Timestamp firstNonNull(Timestamp... values) {
        for (Timestamp value : values) {
            if (value != null) {
                return value;
            }
        }
        return null;
    }

    private BigDecimal firstNonNullAmount(BigDecimal... values) {
        for (BigDecimal value : values) {
            if (value != null && value.compareTo(BigDecimal.ZERO) > 0) {
                return value;
            }
        }

        for (BigDecimal value : values) {
            if (value != null) {
                return value;
            }
        }
        return BigDecimal.ZERO;
    }

    private Integer nullableInteger(ResultSet resultSet, String columnLabel) throws SQLException {
        int value = resultSet.getInt(columnLabel);
        return resultSet.wasNull() ? null : value;
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
