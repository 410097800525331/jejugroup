package com.jejugroup.jejuspring.booking.application;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

@Repository
public class BookingQueryRepository {
    public BookingUserRow loadUser(Connection connection, String userId) throws SQLException {
        String normalizedUserId = requireUserId(userId);
        String query = """
            SELECT id, name, role, email, phone
            FROM users
            WHERE id = ?
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, normalizedUserId);

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    throw new NoSuchElementException("존재하지 않는 사용자입니다.");
                }

                return new BookingUserRow(
                    resultSet.getString("id"),
                    resultSet.getString("name"),
                    resultSet.getString("role"),
                    resultSet.getString("email"),
                    resultSet.getString("phone")
                );
            }
        }
    }

    public List<BookingRow> loadBookings(Connection connection, String userId) throws SQLException {
        String query = """
            SELECT id, booking_no, booking_type, status, payment_status, currency,
                   total_amount, paid_amount, booked_at, cancelled_at, memo
            FROM bookings
            WHERE user_id = ?
            ORDER BY booked_at DESC, created_at DESC, id DESC
            """;

        List<BookingRow> bookings = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, requireUserId(userId));

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    bookings.add(new BookingRow(
                        resultSet.getLong("id"),
                        resultSet.getString("booking_no"),
                        resultSet.getString("booking_type"),
                        resultSet.getString("status"),
                        resultSet.getString("payment_status"),
                        resultSet.getString("currency"),
                        resultSet.getBigDecimal("total_amount"),
                        resultSet.getBigDecimal("paid_amount"),
                        toLocalDateTime(resultSet.getTimestamp("booked_at")),
                        toLocalDateTime(resultSet.getTimestamp("cancelled_at")),
                        resultSet.getString("memo")
                    ));
                }
            }
        }

        return bookings;
    }

    public List<BookingRow> loadBookingsForDashboard(Connection connection, String userId) throws SQLException {
        String query = """
            SELECT id, booking_no, booking_type, status, payment_status, currency,
                   total_amount, paid_amount, booked_at, cancelled_at, memo
            FROM bookings
            WHERE user_id = ?
            ORDER BY COALESCE(booked_at, created_at) DESC, id DESC
            """;

        List<BookingRow> bookings = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, requireUserId(userId));

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    bookings.add(new BookingRow(
                        resultSet.getLong("id"),
                        resultSet.getString("booking_no"),
                        resultSet.getString("booking_type"),
                        resultSet.getString("status"),
                        resultSet.getString("payment_status"),
                        resultSet.getString("currency"),
                        resultSet.getBigDecimal("total_amount"),
                        resultSet.getBigDecimal("paid_amount"),
                        toLocalDateTime(resultSet.getTimestamp("booked_at")),
                        toLocalDateTime(resultSet.getTimestamp("cancelled_at")),
                        resultSet.getString("memo")
                    ));
                }
            }
        }

        return bookings;
    }

    public List<BookingItemRow> loadBookingItems(Connection connection, long bookingId) throws SQLException {
        String query = """
            SELECT item_no, booking_type, item_name, product_code, supplier_name,
                   service_start_date, service_end_date, quantity, unit_price,
                   total_amount, currency
            FROM booking_items
            WHERE booking_id = ?
            ORDER BY item_no ASC, id ASC
            """;

        List<BookingItemRow> items = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setLong(1, bookingId);

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    items.add(new BookingItemRow(
                        resultSet.getInt("item_no"),
                        resultSet.getString("booking_type"),
                        resultSet.getString("item_name"),
                        resultSet.getString("product_code"),
                        resultSet.getString("supplier_name"),
                        toLocalDate(resultSet.getDate("service_start_date")),
                        toLocalDate(resultSet.getDate("service_end_date")),
                        resultSet.getInt("quantity"),
                        resultSet.getBigDecimal("unit_price"),
                        resultSet.getBigDecimal("total_amount"),
                        resultSet.getString("currency")
                    ));
                }
            }
        }

        return items;
    }

    public List<PaymentAttemptRow> loadPaymentAttempts(Connection connection, long bookingId) throws SQLException {
        String query = """
            SELECT attempt_no, payment_provider, payment_method, status,
                   requested_amount, approved_amount, currency,
                   requested_at, completed_at, failure_code, failure_message
            FROM payment_attempts
            WHERE booking_id = ?
            ORDER BY attempt_no DESC, id DESC
            """;

        List<PaymentAttemptRow> attempts = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setLong(1, bookingId);

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    attempts.add(new PaymentAttemptRow(
                        resultSet.getInt("attempt_no"),
                        resultSet.getString("payment_provider"),
                        resultSet.getString("payment_method"),
                        resultSet.getString("status"),
                        resultSet.getBigDecimal("requested_amount"),
                        resultSet.getBigDecimal("approved_amount"),
                        resultSet.getString("currency"),
                        toLocalDateTime(resultSet.getTimestamp("requested_at")),
                        toLocalDateTime(resultSet.getTimestamp("completed_at")),
                        resultSet.getString("failure_code"),
                        resultSet.getString("failure_message")
                    ));
                }
            }
        }

        return attempts;
    }

    public BookingItemSummary loadBookingItemSummary(Connection connection, long bookingId) throws SQLException {
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

    public String loadLatestPaymentMethod(Connection connection, long bookingId) throws SQLException {
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

    public int loadPassengerCount(Connection connection, long bookingId) throws SQLException {
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

    public BookingGuestLookupRow loadGuestLookup(
        Connection connection,
        String reservationNo,
        String email
    ) throws SQLException {
        String query = """
            SELECT b.booking_no, b.destination, b.total_amount, b.user_id,
                   bi.service_start_date,
                   bp.passenger_last_name, bp.passenger_first_name,
                   COALESCE(NULLIF(TRIM(bp.email), ''), NULLIF(TRIM(u.email), '')) AS email
            FROM bookings b
            INNER JOIN booking_items bi
                ON bi.booking_id = b.id
               AND bi.item_no = 1
            INNER JOIN booking_passengers bp
                ON bp.booking_id = b.id
               AND bp.is_primary = 1
            LEFT JOIN users u
                ON u.id = b.user_id
            WHERE b.booking_no = ?
              AND LOWER(TRIM(COALESCE(NULLIF(bp.email, ''), NULLIF(u.email, '')))) = LOWER(TRIM(?))
            LIMIT 1
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, requireReservationNo(reservationNo));
            statement.setString(2, requireLookupEmail(email));

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    throw new NoSuchElementException("예약 정보를 찾을 수 없습니다.");
                }

                return new BookingGuestLookupRow(
                    resultSet.getString("booking_no"),
                    resultSet.getString("destination"),
                    resultSet.getBigDecimal("total_amount"),
                    resultSet.getString("user_id") != null,
                    toLocalDate(resultSet.getDate("service_start_date")),
                    resultSet.getString("passenger_last_name"),
                    resultSet.getString("passenger_first_name"),
                    resultSet.getString("email")
                );
            }
        }
    }

    public BookingGuestLookupRow loadGuestLookup(
        Connection connection,
        String reservationNo,
        java.time.LocalDate travelDate,
        String lastName,
        String firstName
    ) throws SQLException {
        String query = """
            SELECT b.booking_no, b.destination, b.total_amount, b.user_id,
                   bi.service_start_date,
                   bp.passenger_last_name, bp.passenger_first_name,
                   COALESCE(NULLIF(TRIM(bp.email), ''), NULLIF(TRIM(u.email), '')) AS email
            FROM bookings b
            INNER JOIN booking_items bi
                ON bi.booking_id = b.id
               AND bi.item_no = 1
            INNER JOIN booking_passengers bp
                ON bp.booking_id = b.id
               AND bp.is_primary = 1
            LEFT JOIN users u
                ON u.id = b.user_id
            WHERE b.booking_no = ?
              AND bi.service_start_date = ?
              AND bp.passenger_last_name = ?
              AND bp.passenger_first_name = ?
            LIMIT 1
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, requireReservationNo(reservationNo));
            statement.setDate(2, Date.valueOf(requireTravelDate(travelDate)));
            statement.setString(3, requireLookupName(lastName));
            statement.setString(4, requireLookupName(firstName));

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    throw new NoSuchElementException("예약 정보를 찾을 수 없습니다.");
                }

                return new BookingGuestLookupRow(
                    resultSet.getString("booking_no"),
                    resultSet.getString("destination"),
                    resultSet.getBigDecimal("total_amount"),
                    resultSet.getString("user_id") != null,
                    toLocalDate(resultSet.getDate("service_start_date")),
                    resultSet.getString("passenger_last_name"),
                    resultSet.getString("passenger_first_name"),
                    resultSet.getString("email")
                );
            }
        }
    }

    private String requireUserId(String userId) {
        if (!StringUtils.hasText(userId)) {
            throw new IllegalArgumentException("userId is required");
        }

        return userId.trim();
    }

    private String requireReservationNo(String reservationNo) {
        if (!StringUtils.hasText(reservationNo)) {
            throw new IllegalArgumentException("입력값이 올바르지 않습니다.");
        }

        return reservationNo.trim();
    }

    private String requireLookupEmail(String email) {
        if (!StringUtils.hasText(email)) {
            throw new IllegalArgumentException("입력값이 올바르지 않습니다.");
        }

        String normalized = email.trim();
        if (!normalized.contains("@")) {
            throw new IllegalArgumentException("입력값이 올바르지 않습니다.");
        }

        return normalized;
    }

    private java.time.LocalDate requireTravelDate(java.time.LocalDate travelDate) {
        if (travelDate == null) {
            throw new IllegalArgumentException("입력값이 올바르지 않습니다.");
        }

        return travelDate;
    }

    private String requireLookupName(String name) {
        if (!StringUtils.hasText(name)) {
            throw new IllegalArgumentException("입력값이 올바르지 않습니다.");
        }

        return name.trim();
    }

    private LocalDate toLocalDate(Date date) {
        return date == null ? null : date.toLocalDate();
    }

    private LocalDateTime toLocalDateTime(Timestamp timestamp) {
        return timestamp == null ? null : timestamp.toLocalDateTime();
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value;
    }

    public record BookingUserRow(
        String id,
        String name,
        String role,
        String email,
        String phone
    ) {
    }

    public record BookingRow(
        long id,
        String bookingNo,
        String bookingType,
        String status,
        String paymentStatus,
        String currency,
        BigDecimal totalAmount,
        BigDecimal paidAmount,
        LocalDateTime bookedAt,
        LocalDateTime cancelledAt,
        String memo
    ) {
    }

    public record BookingItemRow(
        int itemNo,
        String bookingType,
        String itemName,
        String productCode,
        String supplierName,
        LocalDate serviceStartDate,
        LocalDate serviceEndDate,
        int quantity,
        BigDecimal unitPrice,
        BigDecimal totalAmount,
        String currency
    ) {
    }

    public record BookingItemSummary(
        String itemName,
        String supplierName,
        Date serviceStartDate,
        Date serviceEndDate,
        int quantity
    ) {
    }

    public record PaymentAttemptRow(
        int attemptNo,
        String paymentProvider,
        String paymentMethod,
        String status,
        BigDecimal requestedAmount,
        BigDecimal approvedAmount,
        String currency,
        LocalDateTime requestedAt,
        LocalDateTime completedAt,
        String failureCode,
        String failureMessage
    ) {
    }

    public record BookingGuestLookupRow(
        String bookingNo,
        String destination,
        BigDecimal amount,
        boolean memberBooking,
        LocalDate travelDate,
        String lastName,
        String firstName,
        String email
    ) {
    }
}
