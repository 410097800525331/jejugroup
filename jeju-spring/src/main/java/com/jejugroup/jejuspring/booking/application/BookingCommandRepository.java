package com.jejugroup.jejuspring.booking.application;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.security.SecureRandom;
import java.util.Locale;

import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

@Repository
public class BookingCommandRepository {
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final int RESERVATION_NUMBER_DIGITS = 8;

    public String reserveRandomBookingNo(String bookingType) {
        return prefixForBookingType(bookingType) + randomDigits();
    }

    public long insertBooking(
        Connection connection,
        String bookingNo,
        String userId,
        String bookingType,
        String destination,
        String memo,
        BigDecimal amount,
        String currency,
        LocalDateTime bookedAt
    ) throws SQLException {
        String query = """
            INSERT INTO bookings (
                booking_no, user_id, destination, booking_type, status,
                payment_status, currency, total_amount, paid_amount,
                booked_at, memo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;

        try (PreparedStatement statement = connection.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {
            statement.setString(1, bookingNo);
            statement.setString(2, userId);
            statement.setString(3, destination);
            statement.setString(4, normalizeBookingType(bookingType));
            statement.setString(5, "confirmed");
            statement.setString(6, "paid");
            statement.setString(7, currency);
            statement.setBigDecimal(8, amount);
            statement.setBigDecimal(9, amount);
            statement.setObject(10, bookedAt);
            statement.setString(11, memo);
            statement.executeUpdate();
            return readGeneratedKey(statement);
        }
    }

    public long insertBookingItem(
        Connection connection,
        long bookingId,
        String bookingType,
        String destination,
        LocalDate serviceStartDate,
        LocalDate serviceEndDate,
        BigDecimal amount,
        String currency
    ) throws SQLException {
        String query = """
            INSERT INTO booking_items (
                booking_id, item_no, booking_type, item_name, product_code,
                supplier_name, service_start_date, service_end_date,
                quantity, unit_price, total_amount, currency
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;

        try (PreparedStatement statement = connection.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {
            statement.setLong(1, bookingId);
            statement.setInt(2, 1);
            String normalizedBookingType = normalizeBookingType(bookingType);
            statement.setString(3, normalizedBookingType);
            statement.setString(4, buildItemName(normalizedBookingType, destination));
            statement.setString(5, buildProductCode(normalizedBookingType, destination, serviceStartDate, serviceEndDate));
            statement.setString(6, buildSupplierName(normalizedBookingType));
            statement.setDate(7, java.sql.Date.valueOf(serviceStartDate));
            statement.setDate(8, java.sql.Date.valueOf(serviceEndDate));
            statement.setInt(9, 1);
            statement.setBigDecimal(10, amount);
            statement.setBigDecimal(11, amount);
            statement.setString(12, currency);
            statement.executeUpdate();
            return readGeneratedKey(statement);
        }
    }

    public long insertBookingPassenger(
        Connection connection,
        long bookingId,
        long bookingItemId,
        String userId,
        String email,
        String lastName,
        String firstName,
        boolean memberBooking
    ) throws SQLException {
        String query = """
            INSERT INTO booking_passengers (
                booking_id, booking_item_id, user_id, passenger_no,
                passenger_name, passenger_first_name, passenger_last_name,
                passenger_type, email, is_primary, is_member
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;

        try (PreparedStatement statement = connection.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {
            statement.setLong(1, bookingId);
            statement.setLong(2, bookingItemId);
            statement.setString(3, userId);
            statement.setInt(4, 1);
            statement.setString(5, buildPassengerName(lastName, firstName));
            statement.setString(6, firstName);
            statement.setString(7, lastName);
            statement.setString(8, memberBooking ? "member" : "guest");
            statement.setString(9, normalizeEmail(email));
            statement.setBoolean(10, true);
            statement.setBoolean(11, memberBooking);
            statement.executeUpdate();
            return readGeneratedKey(statement);
        }
    }

    public long insertPaymentAttempt(
        Connection connection,
        long bookingId,
        BigDecimal amount,
        String paymentProvider,
        String paymentMethod,
        String currency,
        LocalDateTime requestedAt
    ) throws SQLException {
        String query = """
            INSERT INTO payment_attempts (
                booking_id, attempt_no, payment_provider, payment_method,
                status, requested_amount, approved_amount, currency,
                requested_at, completed_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;

        try (PreparedStatement statement = connection.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {
            statement.setLong(1, bookingId);
            statement.setInt(2, 1);
            statement.setString(3, paymentProvider);
            statement.setString(4, paymentMethod);
            statement.setString(5, "completed");
            statement.setBigDecimal(6, amount);
            statement.setBigDecimal(7, amount);
            statement.setString(8, currency);
            statement.setObject(9, requestedAt);
            statement.setObject(10, requestedAt);
            statement.executeUpdate();
            return readGeneratedKey(statement);
        }
    }

    public long insertPaymentTransaction(
        Connection connection,
        long paymentAttemptId,
        String bookingNo,
        BigDecimal amount,
        String currency,
        String externalTransactionId,
        LocalDateTime processedAt
    ) throws SQLException {
        String query = """
            INSERT INTO payment_transactions (
                payment_attempt_id, transaction_no, transaction_type, status,
                amount, currency, external_transaction_id, processed_at, approved_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;

        String transactionNo = "PT-" + bookingNo;
        String resolvedExternalTransactionId = StringUtils.hasText(externalTransactionId)
            ? externalTransactionId.trim()
            : transactionNo;

        try (PreparedStatement statement = connection.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {
            statement.setLong(1, paymentAttemptId);
            statement.setString(2, transactionNo);
            statement.setString(3, "payment");
            statement.setString(4, "completed");
            statement.setBigDecimal(5, amount);
            statement.setString(6, currency);
            statement.setString(7, resolvedExternalTransactionId);
            statement.setObject(8, processedAt);
            statement.setObject(9, processedAt);
            statement.executeUpdate();
            return readGeneratedKey(statement);
        }
    }

    private long readGeneratedKey(PreparedStatement statement) throws SQLException {
        try (var generatedKeys = statement.getGeneratedKeys()) {
            if (!generatedKeys.next()) {
                throw new SQLException("Generated key was not returned");
            }

            return generatedKeys.getLong(1);
        }
    }

    private String randomDigits() {
        return String.format(Locale.ROOT, "%0" + RESERVATION_NUMBER_DIGITS + "d", RANDOM.nextInt(100_000_000));
    }

    private String prefixForBookingType(String bookingType) {
        return switch (normalizeBookingType(bookingType)) {
            case "stay" -> "JS";
            case "air" -> "JA";
            default -> "JB";
        };
    }

    private String normalizeBookingType(String bookingType) {
        String normalized = normalizeText(bookingType).toLowerCase(Locale.ROOT);
        if (!StringUtils.hasText(normalized)) {
            return "air";
        }

        return switch (normalized) {
            case "stay", "hotel", "lodging" -> "stay";
            case "air", "flight" -> "air";
            default -> normalized;
        };
    }

    private String buildItemName(String bookingType, String destination) {
        String normalizedDestination = normalizeText(destination);
        return switch (normalizeBookingType(bookingType)) {
            case "stay" -> normalizedDestination + " 숙박";
            case "air" -> normalizedDestination + " 항공권";
            default -> normalizedDestination + " 예약";
        };
    }

    private String buildSupplierName(String bookingType) {
        return switch (normalizeBookingType(bookingType)) {
            case "stay" -> "Jeju Stay";
            case "air" -> "Jeju Air";
            default -> "Jeju Group";
        };
    }

    private String buildProductCode(
        String bookingType,
        String destination,
        LocalDate serviceStartDate,
        LocalDate serviceEndDate
    ) {
        String destinationHash = String.format(Locale.ROOT, "%08X", normalizeText(destination).hashCode());
        String datePart = (serviceStartDate == null ? "" : serviceStartDate.toString().replace("-", ""))
            + "-"
            + (serviceEndDate == null ? "" : serviceEndDate.toString().replace("-", ""));
        return switch (normalizeBookingType(bookingType)) {
            case "stay" -> "STAY-" + destinationHash + "-" + datePart;
            case "air" -> "AIR-" + destinationHash + "-" + datePart;
            default -> "BOOK-" + destinationHash + "-" + datePart;
        };
    }

    private String buildPassengerName(String lastName, String firstName) {
        String normalizedLastName = normalizeText(lastName);
        String normalizedFirstName = normalizeText(firstName);
        if (normalizedLastName.isEmpty()) {
            return normalizedFirstName;
        }
        if (normalizedFirstName.isEmpty()) {
            return normalizedLastName;
        }
        return normalizedLastName + " " + normalizedFirstName;
    }

    private String normalizeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeEmail(String value) {
        String normalized = normalizeText(value);
        return StringUtils.hasText(normalized) ? normalized : null;
    }
}
