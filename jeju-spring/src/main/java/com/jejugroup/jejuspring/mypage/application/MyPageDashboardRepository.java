package com.jejugroup.jejuspring.mypage.application;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import com.jejugroup.jejuspring.auth.model.SessionUser;
import com.jejugroup.jejuspring.booking.application.BookingQueryRepository;
import com.jejugroup.jejuspring.config.AppProperties;
import com.jejugroup.jejuspring.mypage.view.MyPageBookingView;
import com.jejugroup.jejuspring.mypage.view.MyPageStatView;
import com.jejugroup.jejuspring.mypage.view.MyPageSupportView;

@Repository
public class MyPageDashboardRepository {
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy.MM.dd", Locale.KOREA);
    private static final DateTimeFormatter DATE_TIME_FORMAT = DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm", Locale.KOREA);
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm", Locale.KOREA);
    private static final DecimalFormat MONEY_FORMAT = new DecimalFormat("#,###");

    private final AppProperties appProperties;
    private final BookingQueryRepository bookingQueryRepository;
    private final MyPageProfileQueryService profileQueryService;
    private final MyPageMembershipQueryService membershipQueryService;
    private final MyPageStatsQueryService statsQueryService;
    private final MyPageSupportQueryService supportQueryService;
    private final MyPageCompanionQueryService companionQueryService;
    private final MyPageTravelEventQueryService travelEventQueryService;
    private final MyPageItineraryService itineraryService;

    public MyPageDashboardRepository(
        AppProperties appProperties,
        BookingQueryRepository bookingQueryRepository,
        MyPageProfileQueryService profileQueryService,
        MyPageMembershipQueryService membershipQueryService,
        MyPageStatsQueryService statsQueryService,
        MyPageSupportQueryService supportQueryService,
        MyPageCompanionQueryService companionQueryService,
        MyPageTravelEventQueryService travelEventQueryService,
        MyPageItineraryService itineraryService
    ) {
        this.appProperties = appProperties;
        this.bookingQueryRepository = bookingQueryRepository;
        this.profileQueryService = profileQueryService;
        this.membershipQueryService = membershipQueryService;
        this.statsQueryService = statsQueryService;
        this.supportQueryService = supportQueryService;
        this.companionQueryService = companionQueryService;
        this.travelEventQueryService = travelEventQueryService;
        this.itineraryService = itineraryService;
    }

    public MyPageDashboardSnapshot load(String userId) throws SQLException {
        if (!StringUtils.hasText(userId)) {
            throw new IllegalArgumentException("userId is required");
        }

        try (Connection connection = openConnection()) {
            connection.setReadOnly(true);

            MyPageMembershipQueryService.MyPageMembershipSnapshot membershipSnapshot = membershipQueryService.loadMemberships(connection, userId);
            MyPageProfileSnapshot profile = profileQueryService.loadProfile(connection, userId, membershipSnapshot.tierLabel());
            List<MyPageItineraryCompanionSnapshot> linkedCompanions = companionQueryService.loadCompanionLinks(connection, userId);
            List<String> travelEventScopeUserIds = buildTravelEventScopeUserIds(userId, linkedCompanions);
            List<String> memberships = membershipSnapshot.memberships();
            List<MyPageBookingView> bookings = loadBookings(connection, userId);
            List<MyPageStatView> stats = statsQueryService.loadStats(connection, userId);
            List<MyPageSupportView> supportItems = supportQueryService.loadSupportItems(connection, userId);
            List<MyPageTravelEventSnapshot> travelEvents = travelEventQueryService.loadTravelEvents(connection, travelEventScopeUserIds);
            List<MyPageItinerarySnapshot> itinerary = itineraryService.buildItinerary(userId, travelEvents);

            return new MyPageDashboardSnapshot(
                profile,
                memberships,
                bookings,
                stats,
                supportItems,
                List.copyOf(linkedCompanions),
                travelEvents,
                itinerary
            );
        }
    }

    public record MyPageDashboardSnapshot(
        MyPageProfileSnapshot profile,
        List<String> memberships,
        List<MyPageBookingView> bookings,
        List<MyPageStatView> stats,
        List<MyPageSupportView> supportItems,
        List<MyPageItineraryCompanionSnapshot> linkedCompanions,
        List<MyPageTravelEventSnapshot> travelEvents,
        List<MyPageItinerarySnapshot> itinerary
    ) {
    }

    public record MyPageProfileSnapshot(
        String id,
        String name,
        String avatarUrl,
        String email,
        String phone,
        String role,
        String tier
    ) {
    }

    public record MyPageTravelEventSnapshot(
        String id,
        String dayId,
        String date,
        String time,
        String title,
        String activityLabel,
        String googleMapUrl,
        String status,
        String type,
        String ownerId,
        String ownerName
    ) {
    }

    public record MyPageItinerarySnapshot(
        String id,
        String date,
        String time,
        String title,
        String googleMapUrl,
        List<MyPageItineraryActivitySnapshot> activities,
        List<MyPageItineraryCompanionSnapshot> companions
    ) {
    }

    public record MyPageItineraryActivitySnapshot(
        String id,
        String label,
        boolean checked,
        String ownerId,
        String ownerName,
        String status,
        String type
    ) {
    }

    public record MyPageItineraryCompanionSnapshot(
        String id,
        String name,
        boolean isMember
    ) {
    }

    private MyPageProfileSnapshot loadProfile(Connection connection, String userId) throws SQLException {
        String query = """
            SELECT
                u.id,
                COALESCE(NULLIF(TRIM(up.display_name), ''), u.name) AS display_name,
                up.avatar_url,
                u.email,
                u.phone,
                u.role
            FROM users u
            LEFT JOIN user_profiles up ON up.user_id = u.id
            WHERE u.id = ?
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, userId);

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    throw new NoSuchElementException("MyPage user not found");
                }

                return new MyPageProfileSnapshot(
                    nullToEmpty(resultSet.getString("id")),
                    nullToEmpty(resultSet.getString("display_name")),
                    nullToEmpty(resultSet.getString("avatar_url")),
                    nullToEmpty(resultSet.getString("email")),
                    nullToEmpty(resultSet.getString("phone")),
                    nullToEmpty(resultSet.getString("role")),
                    loadTierLabel(connection, userId)
                );
            }
        }
    }

    private String loadTierLabel(Connection connection, String userId) throws SQLException {
        List<MembershipSnapshot> memberships = loadMembershipSnapshots(connection, userId);
        if (memberships.isEmpty()) {
            return "";
        }
        return memberships.getFirst().label();
    }

    private List<String> loadMemberships(Connection connection, String userId) throws SQLException {
        return loadMembershipSnapshots(connection, userId).stream()
            .map(MembershipSnapshot::label)
            .toList();
    }

    private List<MembershipSnapshot> loadMembershipSnapshots(Connection connection, String userId) throws SQLException {
        String query = """
            SELECT
                mp.plan_name,
                mp.tier_level
            FROM user_memberships um
            INNER JOIN membership_plans mp ON mp.id = um.membership_plan_id
            WHERE um.user_id = ?
              AND um.membership_status = 'active'
              AND mp.is_active = 1
            ORDER BY mp.tier_level DESC, um.started_at DESC, um.id DESC
            """;

        List<MembershipSnapshot> memberships = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, userId);

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    memberships.add(new MembershipSnapshot(
                        buildMembershipLabel(resultSet.getString("plan_name")),
                        resultSet.getInt("tier_level")
                    ));
                }
            }
        }

        return memberships;
    }

    private String buildMembershipLabel(String planName) {
        if (StringUtils.hasText(planName)) {
            return planName.trim();
        }

        return "";
    }

    private List<MyPageItineraryCompanionSnapshot> loadCompanionLinks(Connection connection, String userId) throws SQLException {
        String query = """
            SELECT
                cl.companion_user_id,
                COALESCE(NULLIF(TRIM(up.display_name), ''), u.name) AS companion_name
            FROM companion_links cl
            INNER JOIN users u ON u.id = cl.companion_user_id
            LEFT JOIN user_profiles up ON up.user_id = u.id
            WHERE cl.owner_user_id = ?
              AND cl.is_member = 1
            ORDER BY COALESCE(NULLIF(TRIM(up.display_name), ''), u.name) ASC, cl.sort_order ASC, cl.id ASC
            """;

        List<MyPageItineraryCompanionSnapshot> companions = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, userId);

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    companions.add(new MyPageItineraryCompanionSnapshot(
                        nullToEmpty(resultSet.getString("companion_user_id")),
                        nullToEmpty(resultSet.getString("companion_name")),
                        true
                    ));
                }
            }
        }

        return companions;
    }

    private List<MyPageBookingView> loadBookings(Connection connection, String userId) throws SQLException {
        List<MyPageBookingView> bookings = new ArrayList<>();
        for (BookingQueryRepository.BookingRow booking : bookingQueryRepository.loadBookingsForDashboard(connection, userId)) {
            BookingQueryRepository.BookingItemSummary itemSummary = bookingQueryRepository.loadBookingItemSummary(connection, booking.id());
            String bookingType = normalizeBookingType(booking.bookingType());
            String paymentMethod = bookingQueryRepository.loadLatestPaymentMethod(connection, booking.id());
            int passengerCount = bookingQueryRepository.loadPassengerCount(connection, booking.id());

            bookings.add(new MyPageBookingView(
                nullToEmpty(booking.bookingNo()),
                bookingType,
                buildBookingTitle(bookingType, itemSummary, booking.bookingNo()),
                buildBookingStatus(bookingType, booking.status(), booking.paymentStatus(), booking.cancelledAt() == null ? null : java.sql.Timestamp.valueOf(booking.cancelledAt())),
                buildBookingDateLabel(bookingType, booking.bookedAt() == null ? null : java.sql.Timestamp.valueOf(booking.bookedAt()), itemSummary),
                formatMoney(booking.paidAmount(), booking.totalAmount(), booking.currency()),
                buildBookingTags(bookingType, itemSummary, paymentMethod, passengerCount, booking.paymentStatus())
            ));
        }

        return bookings;
    }

    private BookingItemSummary loadBookingItemSummary(Connection connection, long bookingId) throws SQLException {
        String query = """
            SELECT item_name, supplier_name, service_start_date, service_end_date, quantity
            FROM booking_items
            WHERE booking_id = ?
            ORDER BY item_no ASC, id ASC
            LIMIT 1
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setLong(1, bookingId);

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return new BookingItemSummary("", "", null, null, 1);
                }

                return new BookingItemSummary(
                    nullToEmpty(resultSet.getString("item_name")),
                    nullToEmpty(resultSet.getString("supplier_name")),
                    resultSet.getDate("service_start_date"),
                    resultSet.getDate("service_end_date"),
                    resultSet.getInt("quantity")
                );
            }
        }
    }

    private String loadLatestPaymentMethod(Connection connection, long bookingId) throws SQLException {
        String query = """
            SELECT payment_method
            FROM payment_attempts
            WHERE booking_id = ?
            ORDER BY COALESCE(completed_at, requested_at, created_at) DESC, id DESC
            LIMIT 1
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setLong(1, bookingId);

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return "";
                }
                return nullToEmpty(resultSet.getString("payment_method"));
            }
        }
    }

    private int loadPassengerCount(Connection connection, long bookingId) throws SQLException {
        String query = """
            SELECT COUNT(*) AS passenger_count
            FROM booking_passengers
            WHERE booking_id = ?
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setLong(1, bookingId);

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return 0;
                }
                return resultSet.getInt("passenger_count");
            }
        }
    }

    private List<MyPageStatView> loadStats(Connection connection, String userId) throws SQLException {
        int pointBalance = loadCurrentPointBalance(connection, userId);
        int couponCount = loadAvailableCouponCount(connection, userId);
        int airTripCount = loadUpcomingTripCount(connection, userId, "air");
        int stayTripCount = loadUpcomingTripCount(connection, userId, "stay");

        return List.of(
            new MyPageStatView("보유 포인트", "wallet", formatPointBalance(pointBalance)),
            new MyPageStatView("사용 가능한 쿠폰", "wallet", couponCount + "장"),
            new MyPageStatView("예정된 항공 일정", "air", airTripCount + "건"),
            new MyPageStatView("예정된 숙소 일정", "stay", stayTripCount + "건")
        );
    }

    private int loadCurrentPointBalance(Connection connection, String userId) throws SQLException {
        String query = """
            SELECT balance_after
            FROM point_ledger
            WHERE user_id = ?
            ORDER BY occurred_at DESC, id DESC
            LIMIT 1
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, userId);

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return 0;
                }
                return resultSet.getInt("balance_after");
            }
        }
    }

    private int loadAvailableCouponCount(Connection connection, String userId) throws SQLException {
        String query = """
            SELECT COUNT(*) AS coupon_count
            FROM user_coupons uc
            INNER JOIN coupons c ON c.id = uc.coupon_id
            WHERE uc.user_id = ?
              AND uc.coupon_status = 'issued'
              AND c.is_active = 1
              AND (c.valid_from IS NULL OR c.valid_from <= CURDATE())
              AND (c.valid_to IS NULL OR c.valid_to >= CURDATE())
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, userId);

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return 0;
                }
                return resultSet.getInt("coupon_count");
            }
        }
    }

    private int loadUpcomingTripCount(Connection connection, String userId, String bookingType) throws SQLException {
        String query = """
            SELECT COUNT(DISTINCT booking_id) AS trip_count
            FROM travel_events
            WHERE user_id = ?
              AND booking_type = ?
              AND status = 'reserved'
              AND event_date >= CURDATE()
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, userId);
            statement.setString(2, bookingType);

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return 0;
                }
                return resultSet.getInt("trip_count");
            }
        }
    }

    private List<MyPageSupportView> loadSupportItems(Connection connection, String userId) throws SQLException {
        int totalCount = countSupportTickets(connection, userId, null);
        int activeCount = countSupportTickets(connection, userId, List.of("pending", "in_progress", "waiting", "open"));
        int closedCount = countSupportTickets(connection, userId, List.of("answered", "resolved", "closed"));

        return List.of(
            new MyPageSupportView("qna", "1:1 문의 내역", totalCount, "#"),
            new MyPageSupportView("notice", "처리 중 문의", activeCount, "#"),
            new MyPageSupportView("faq", "완료된 문의", closedCount, "#")
        );
    }

    private int countSupportTickets(Connection connection, String userId, List<String> statuses) throws SQLException {
        StringBuilder query = new StringBuilder("""
            SELECT COUNT(*) AS ticket_count
            FROM support_tickets
            WHERE user_id = ?
            """);

        if (statuses != null && !statuses.isEmpty()) {
            String placeholders = statuses.stream().map(status -> "?").collect(Collectors.joining(", "));
            query.append(" AND status IN (").append(placeholders).append(")");
        }

        try (PreparedStatement statement = connection.prepareStatement(query.toString())) {
            statement.setString(1, userId);

            if (statuses != null && !statuses.isEmpty()) {
                int index = 2;
                for (String status : statuses) {
                    statement.setString(index++, status);
                }
            }

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return 0;
                }
                return resultSet.getInt("ticket_count");
            }
        }
    }

    private List<String> buildTravelEventScopeUserIds(
        String userId,
        List<MyPageItineraryCompanionSnapshot> linkedCompanions
    ) {
        List<String> userScopeIds = new ArrayList<>();
        userScopeIds.add(userId);
        for (MyPageItineraryCompanionSnapshot companion : linkedCompanions) {
            if (!StringUtils.hasText(companion.id())) {
                continue;
            }

            if (!userScopeIds.contains(companion.id())) {
                userScopeIds.add(companion.id());
            }
        }
        return userScopeIds;
    }

    private List<MyPageTravelEventSnapshot> loadTravelEvents(
        Connection connection,
        List<String> userScopeIds
    ) throws SQLException {
        String placeholders = userScopeIds.stream().map(ignored -> "?").collect(Collectors.joining(", "));
        String query = """
            SELECT
                id,
                day_id,
                event_date,
                event_time,
                title,
                activity_label,
                google_map_url,
                status,
                booking_type,
                owner_name,
                user_id
            FROM travel_events
            WHERE user_id IN (%s)
            ORDER BY event_date ASC, event_time ASC, sort_order ASC, id ASC
            """.formatted(placeholders);

        List<MyPageTravelEventSnapshot> travelEvents = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query)) {
            int index = 1;
            for (String scopeUserId : userScopeIds) {
                statement.setString(index++, scopeUserId);
            }

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    travelEvents.add(new MyPageTravelEventSnapshot(
                        String.valueOf(resultSet.getLong("id")),
                        nullToEmpty(resultSet.getString("day_id")),
                        formatDate(resultSet.getDate("event_date")),
                        formatTime(resultSet.getTime("event_time")),
                        nullToEmpty(resultSet.getString("title")),
                        nullToEmpty(resultSet.getString("activity_label")),
                        nullToEmpty(resultSet.getString("google_map_url")),
                        normalizeTravelEventStatus(resultSet.getString("status")),
                        normalizeBookingType(resultSet.getString("booking_type")),
                        nullToEmpty(resultSet.getString("user_id")),
                        nullToEmpty(resultSet.getString("owner_name"))
                    ));
                }
            }
        }

        return travelEvents;
    }

    private List<MyPageItinerarySnapshot> buildItinerary(String userId, List<MyPageTravelEventSnapshot> travelEvents) {
        Map<String, List<MyPageTravelEventSnapshot>> groupedByDay = new LinkedHashMap<>();
        for (MyPageTravelEventSnapshot travelEvent : travelEvents) {
            String key = StringUtils.hasText(travelEvent.dayId()) ? travelEvent.dayId() : travelEvent.date() + "|" + travelEvent.time();
            groupedByDay.computeIfAbsent(key, ignored -> new ArrayList<>()).add(travelEvent);
        }

        List<MyPageItinerarySnapshot> itinerary = new ArrayList<>();
        for (List<MyPageTravelEventSnapshot> dayEvents : groupedByDay.values()) {
            if (dayEvents.isEmpty()) {
                continue;
            }

            MyPageTravelEventSnapshot first = dayEvents.getFirst();
            List<MyPageItineraryActivitySnapshot> activities = dayEvents.stream()
                .map(event -> new MyPageItineraryActivitySnapshot(
                    event.id(),
                    event.activityLabel(),
                    isCompletedTravelEvent(event.status()),
                    event.ownerId(),
                    event.ownerName(),
                    event.status(),
                    event.type()
                ))
                .toList();

            Map<String, MyPageItineraryCompanionSnapshot> companions = new LinkedHashMap<>();
            for (MyPageTravelEventSnapshot event : dayEvents) {
                if (!StringUtils.hasText(event.ownerId()) || userId.equals(event.ownerId())) {
                    continue;
                }

                if (!companions.containsKey(event.ownerId())) {
                    companions.put(
                        event.ownerId(),
                        new MyPageItineraryCompanionSnapshot(
                            event.ownerId(),
                            displayCompanionName(event.ownerName(), event.ownerId()),
                            true
                        )
                    );
                }
            }

            itinerary.add(new MyPageItinerarySnapshot(
                first.dayId().isBlank() ? first.id() : first.dayId(),
                first.date(),
                first.time().isBlank() ? "종일" : first.time(),
                first.title(),
                first.googleMapUrl(),
                activities,
                List.copyOf(companions.values())
            ));
        }

        return itinerary;
    }

    private record MembershipSnapshot(
        String label,
        int tierLevel
    ) {
    }

    private String buildBookingTitle(String bookingType, BookingQueryRepository.BookingItemSummary itemSummary, String bookingNo) {
        if (StringUtils.hasText(itemSummary.itemName())) {
            return itemSummary.itemName();
        }

        if ("air".equals(bookingType)) {
            return "항공 예약 " + bookingNo;
        }
        if ("stay".equals(bookingType)) {
            return "숙소 예약 " + bookingNo;
        }
        if ("rent".equals(bookingType)) {
            return "렌터카 예약 " + bookingNo;
        }
        if ("voucher".equals(bookingType)) {
            return "바우처 예약 " + bookingNo;
        }
        return bookingNo;
    }

    private String buildBookingStatus(String bookingType, String bookingStatus, String paymentStatus, java.sql.Timestamp cancelledAt) {
        if (cancelledAt != null || "cancelled".equalsIgnoreCase(bookingStatus)) {
            return "취소 완료";
        }

        if (StringUtils.hasText(paymentStatus) && !"paid".equalsIgnoreCase(paymentStatus) && !"captured".equalsIgnoreCase(paymentStatus)) {
            return "결제 대기";
        }

        return switch (normalizeBookingType(bookingType)) {
            case "air" -> "출발 예정";
            case "stay" -> "체크인 예정";
            case "rent" -> "인수 예정";
            case "voucher" -> "사용 예정";
            default -> "예약 완료";
        };
    }

    private String buildBookingDateLabel(String bookingType, java.sql.Timestamp bookedAt, BookingQueryRepository.BookingItemSummary itemSummary) {
        if ("stay".equals(normalizeBookingType(bookingType)) && itemSummary.serviceStartDate() != null) {
            return formatStayDateRange(itemSummary.serviceStartDate(), itemSummary.serviceEndDate());
        }

        if (bookedAt != null) {
            LocalDateTime dateTime = bookedAt.toLocalDateTime();
            return DATE_TIME_FORMAT.format(dateTime);
        }

        if (itemSummary.serviceStartDate() != null) {
            return formatDate(itemSummary.serviceStartDate());
        }

        return "";
    }

    private List<String> buildBookingTags(
        String bookingType,
        BookingQueryRepository.BookingItemSummary itemSummary,
        String paymentMethod,
        int passengerCount,
        String paymentStatus
    ) {
        List<String> tags = new ArrayList<>();

        if ("air".equals(bookingType) && passengerCount > 0) {
            tags.add("탑승객 " + passengerCount + "명");
        } else if ("stay".equals(bookingType) && itemSummary.serviceStartDate() != null && itemSummary.serviceEndDate() != null) {
            tags.add(buildStayDateTag(itemSummary.serviceStartDate(), itemSummary.serviceEndDate()));
        } else if ("rent".equals(bookingType) && StringUtils.hasText(itemSummary.supplierName())) {
            tags.add(itemSummary.supplierName());
        } else if ("voucher".equals(bookingType)) {
            tags.add("바우처");
        }

        if (StringUtils.hasText(paymentMethod)) {
            tags.add(formatPaymentMethod(paymentMethod));
        }

        if (StringUtils.hasText(paymentStatus)) {
            tags.add(formatPaymentStatus(paymentStatus));
        }

        if (StringUtils.hasText(itemSummary.supplierName()) && !tags.contains(itemSummary.supplierName()) && tags.size() < 3) {
            tags.add(itemSummary.supplierName());
        }

        if (tags.isEmpty()) {
            tags.add(displayBookingType(bookingType));
        }

        return tags.stream()
            .filter(StringUtils::hasText)
            .distinct()
            .limit(3)
            .toList();
    }

    private String buildStayDateTag(java.sql.Date startDate, java.sql.Date endDate) {
        String start = formatDate(startDate);
        String end = formatDate(endDate);
        if (start.isBlank() || end.isBlank()) {
            return "숙박 일정";
        }
        if (start.equals(end)) {
            return start;
        }
        return start + " ~ " + end.substring(end.lastIndexOf('.') + 1);
    }

    private String formatMoney(BigDecimal paidAmount, BigDecimal totalAmount, String currency) {
        BigDecimal amount = paidAmount != null && paidAmount.compareTo(BigDecimal.ZERO) > 0
            ? paidAmount
            : totalAmount;
        if (amount == null) {
            amount = BigDecimal.ZERO;
        }
        String suffix = "KRW".equalsIgnoreCase(currency) || !StringUtils.hasText(currency) ? "원" : " " + currency;
        return MONEY_FORMAT.format(amount.setScale(0, RoundingMode.HALF_UP)) + suffix;
    }

    private String formatPointBalance(int balance) {
        return MONEY_FORMAT.format(balance) + "P";
    }

    private String formatPaymentMethod(String paymentMethod) {
        String normalized = paymentMethod.trim().toLowerCase(Locale.KOREA);
        return switch (normalized) {
            case "card", "credit_card", "credit-card" -> "카드 결제";
            case "transfer", "bank_transfer" -> "계좌이체";
            case "kakao_pay", "kakaopay" -> "카카오페이";
            case "naver_pay", "naverpay" -> "네이버페이";
            default -> paymentMethod;
        };
    }

    private String formatPaymentStatus(String paymentStatus) {
        return switch (paymentStatus.trim().toLowerCase(Locale.KOREA)) {
            case "paid", "captured", "approved" -> "결제 완료";
            case "unpaid", "pending", "requested" -> "결제 대기";
            case "refunded", "partial_refund" -> "환불 완료";
            case "cancelled" -> "결제 취소";
            default -> paymentStatus;
        };
    }

    private String displayBookingType(String bookingType) {
        return switch (normalizeBookingType(bookingType)) {
            case "air" -> "항공";
            case "stay" -> "숙박";
            case "rent" -> "렌터카";
            case "voucher" -> "바우처";
            default -> "예약";
        };
    }

    private String normalizeBookingType(String bookingType) {
        if (!StringUtils.hasText(bookingType)) {
            return "air";
        }
        return bookingType.trim().toLowerCase(Locale.KOREA);
    }

    private String normalizeTravelEventStatus(String status) {
        if (!StringUtils.hasText(status)) {
            return "reserved";
        }
        return status.trim().toLowerCase(Locale.KOREA);
    }

    private boolean isCompletedTravelEvent(String status) {
        String normalized = normalizeTravelEventStatus(status);
        return "used".equals(normalized) || "cancelled".equals(normalized) || "missed".equals(normalized);
    }

    private String formatDate(java.sql.Date date) {
        if (date == null) {
            return "";
        }
        return DATE_FORMAT.format(date.toLocalDate());
    }

    private String formatTime(java.sql.Time time) {
        if (time == null) {
            return "";
        }
        LocalTime localTime = time.toLocalTime();
        return TIME_FORMAT.format(localTime);
    }

    private String buildCompanionKey(String ownerId, String ownerName) {
        if (StringUtils.hasText(ownerId)) {
            return ownerId;
        }
        if (StringUtils.hasText(ownerName)) {
            return ownerName;
        }
        return "companion";
    }

    private String displayCompanionName(String ownerName, String ownerId) {
        if (StringUtils.hasText(ownerName)) {
            return ownerName;
        }
        return StringUtils.hasText(ownerId) ? ownerId : "여행자";
    }

    private String resolveCompanionId(ResultSet resultSet) throws SQLException {
        String companionUserId = nullToEmpty(resultSet.getString("companion_user_id"));
        if (StringUtils.hasText(companionUserId)) {
            return companionUserId;
        }

        return String.valueOf(resultSet.getLong("id"));
    }

    private Connection openConnection() throws SQLException {
        String url = normalize(appProperties.alwaysdata().dbUrl());
        String user = normalize(appProperties.alwaysdata().dbUser());
        String password = normalize(appProperties.alwaysdata().dbPassword());

        if (!StringUtils.hasText(url) || !StringUtils.hasText(user) || !StringUtils.hasText(password)) {
            throw new SQLException("Spring mypage DB configuration is missing");
        }

        return DriverManager.getConnection(url, user, password);
    }

    private MyPageDashboardSnapshot fallbackSnapshot(SessionUser sessionUser) {
        MyPageProfileSnapshot profile = new MyPageProfileSnapshot(
            sessionUser.id(),
            sessionUser.name(),
            "",
            sessionUser.id() + "@jejugroup.example",
            "",
            sessionUser.role(),
            ""
        );

        return new MyPageDashboardSnapshot(
            profile,
            List.of(),
            List.of(),
            List.of(
                new MyPageStatView("보유 포인트", "wallet", "0P"),
                new MyPageStatView("사용 가능한 쿠폰", "wallet", "0장"),
                new MyPageStatView("예정된 항공 일정", "air", "0건"),
                new MyPageStatView("예정된 숙소 일정", "stay", "0건")
            ),
            List.of(
                new MyPageSupportView("qna", "1:1 문의 내역", 0, "#"),
                new MyPageSupportView("notice", "처리 중 문의", 0, "#"),
                new MyPageSupportView("faq", "완료된 문의", 0, "#")
            ),
            List.of(),
            List.of(),
            List.of()
        );
    }

    private String formatStayDateRange(java.sql.Date startDate, java.sql.Date endDate) {
        if (startDate == null || endDate == null) {
            return formatDate(startDate);
        }

        String start = formatDate(startDate);
        String end = formatDate(endDate);
        if (start.isBlank() || end.isBlank()) {
            return start;
        }
        if (start.equals(end)) {
            return start;
        }

        if (start.substring(0, 7).equals(end.substring(0, 7))) {
            return start + " ~ " + end.substring(8);
        }

        return start + " ~ " + end;
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value;
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }

    private record BookingItemSummary(
        String itemName,
        String supplierName,
        java.sql.Date serviceStartDate,
        java.sql.Date serviceEndDate,
        int quantity
    ) {
    }
}
