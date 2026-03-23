package com.jejugroup.jejuspring.booking.application;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.jejugroup.jejuspring.booking.view.BookingReadView;
import com.jejugroup.jejuspring.config.AppProperties;

@Service
public class BookingReadService {
    private final AppProperties appProperties;

    public BookingReadService(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    public BookingReadView readUserBookings(String userId) throws SQLException {
        String normalizedUserId = requireUserId(userId);
        BookingUserRow user = loadUser(normalizedUserId);
        List<BookingRow> bookings = loadBookings(normalizedUserId);

        List<BookingReadView.BookingView> bookingViews = new ArrayList<>();
        long paymentAttemptCount = 0L;
        long activeBookingCount = 0L;
        long paidBookingCount = 0L;
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal paidAmount = BigDecimal.ZERO;

        for (BookingRow booking : bookings) {
            List<BookingReadView.BookingItemView> items = loadBookingItems(booking.id());
            List<BookingReadView.PaymentAttemptView> paymentAttempts = loadPaymentAttempts(booking.id());

            paymentAttemptCount += paymentAttempts.size();
            if (isActiveBooking(booking.status())) {
                activeBookingCount++;
            }
            if (isPaidBooking(booking.paymentStatus())) {
                paidBookingCount++;
            }
            totalAmount = totalAmount.add(booking.totalAmount());
            paidAmount = paidAmount.add(booking.paidAmount());

            bookingViews.add(new BookingReadView.BookingView(
                booking.bookingNo(),
                booking.bookingType(),
                booking.status(),
                booking.paymentStatus(),
                resolveTitle(booking, items),
                resolveServicePeriod(booking, items),
                booking.currency(),
                booking.totalAmount(),
                booking.paidAmount(),
                booking.bookedAt(),
                booking.cancelledAt(),
                booking.memo(),
                items.size(),
                List.copyOf(items),
                paymentAttempts.isEmpty() ? null : paymentAttempts.get(0),
                List.copyOf(paymentAttempts)
            ));
        }

        BookingReadView.SummaryView summary = new BookingReadView.SummaryView(
            bookings.size(),
            activeBookingCount,
            paidBookingCount,
            paymentAttemptCount,
            totalAmount,
            paidAmount
        );

        return new BookingReadView(
            normalizedUserId,
            toUserView(user),
            summary,
            List.copyOf(bookingViews)
        );
    }

    private BookingReadView.UserView toUserView(BookingUserRow user) {
        return new BookingReadView.UserView(
            user.id(),
            user.name(),
            user.role(),
            user.email(),
            user.phone()
        );
    }

    private BookingUserRow loadUser(String userId) throws SQLException {
        String query = """
            SELECT id, name, role, email, phone
            FROM users
            WHERE id = ?
            """;

        try (Connection connection = openConnection();
             PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, userId);

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

    private List<BookingRow> loadBookings(String userId) throws SQLException {
        String query = """
            SELECT id, booking_no, booking_type, status, payment_status, currency,
                   total_amount, paid_amount, booked_at, cancelled_at, memo
            FROM bookings
            WHERE user_id = ?
            ORDER BY booked_at DESC, created_at DESC, id DESC
            """;

        List<BookingRow> bookings = new ArrayList<>();
        try (Connection connection = openConnection();
             PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, userId);

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

    private List<BookingReadView.BookingItemView> loadBookingItems(long bookingId) throws SQLException {
        String query = """
            SELECT item_no, booking_type, item_name, product_code, supplier_name,
                   service_start_date, service_end_date, quantity, unit_price,
                   total_amount, currency
            FROM booking_items
            WHERE booking_id = ?
            ORDER BY item_no ASC, id ASC
            """;

        List<BookingReadView.BookingItemView> items = new ArrayList<>();
        try (Connection connection = openConnection();
             PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setLong(1, bookingId);

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    items.add(new BookingReadView.BookingItemView(
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

    private List<BookingReadView.PaymentAttemptView> loadPaymentAttempts(long bookingId) throws SQLException {
        String query = """
            SELECT attempt_no, payment_provider, payment_method, status,
                   requested_amount, approved_amount, currency,
                   requested_at, completed_at, failure_code, failure_message
            FROM payment_attempts
            WHERE booking_id = ?
            ORDER BY attempt_no DESC, id DESC
            """;

        List<BookingReadView.PaymentAttemptView> attempts = new ArrayList<>();
        try (Connection connection = openConnection();
             PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setLong(1, bookingId);

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    attempts.add(new BookingReadView.PaymentAttemptView(
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

    private Connection openConnection() throws SQLException {
        String url = normalize(appProperties.alwaysdata().dbUrl());
        String user = normalize(appProperties.alwaysdata().dbUser());
        String password = normalize(appProperties.alwaysdata().dbPassword());

        if (!StringUtils.hasText(url) || !StringUtils.hasText(user) || !StringUtils.hasText(password)) {
            throw new SQLException("Spring booking DB configuration is missing");
        }

        Connection connection = DriverManager.getConnection(url, user, password);
        connection.setReadOnly(true);
        return connection;
    }

    private String requireUserId(String userId) {
        if (!StringUtils.hasText(userId)) {
            throw new IllegalArgumentException("userId가 필요합니다.");
        }

        return userId.trim();
    }

    private boolean isActiveBooking(String status) {
        return status != null
            && !status.equalsIgnoreCase("cancelled")
            && !status.equalsIgnoreCase("canceled")
            && !status.equalsIgnoreCase("failed");
    }

    private boolean isPaidBooking(String paymentStatus) {
        return paymentStatus != null
            && (paymentStatus.equalsIgnoreCase("paid")
                || paymentStatus.equalsIgnoreCase("completed")
                || paymentStatus.equalsIgnoreCase("captured")
                || paymentStatus.equalsIgnoreCase("approved")
                || paymentStatus.equalsIgnoreCase("success"));
    }

    private String resolveTitle(BookingRow booking, List<BookingReadView.BookingItemView> items) {
        if (!items.isEmpty() && StringUtils.hasText(items.get(0).itemName())) {
            return items.get(0).itemName();
        }

        return booking.bookingType() + " 예약";
    }

    private String resolveServicePeriod(BookingRow booking, List<BookingReadView.BookingItemView> items) {
        LocalDate start = null;
        LocalDate end = null;

        for (BookingReadView.BookingItemView item : items) {
            if (item.serviceStartDate() != null && (start == null || item.serviceStartDate().isBefore(start))) {
                start = item.serviceStartDate();
            }
            if (item.serviceEndDate() != null && (end == null || item.serviceEndDate().isAfter(end))) {
                end = item.serviceEndDate();
            }
        }

        if (start == null && end == null) {
            LocalDateTime bookedAt = booking.bookedAt();
            if (bookedAt != null) {
                return bookedAt.toLocalDate().toString();
            }
            return "";
        }

        if (start == null) {
            return end.toString();
        }

        if (end == null || start.equals(end)) {
            return start.toString();
        }

        return start + " ~ " + end;
    }

    private LocalDate toLocalDate(Date date) {
        return date == null ? null : date.toLocalDate();
    }

    private LocalDateTime toLocalDateTime(Timestamp timestamp) {
        return timestamp == null ? null : timestamp.toLocalDateTime();
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }

    private record BookingUserRow(
        String id,
        String name,
        String role,
        String email,
        String phone
    ) {
    }

    private record BookingRow(
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
}
