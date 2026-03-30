package com.jejugroup.jejuspring.booking.application;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.jejugroup.jejuspring.auth.model.SessionUser;
import com.jejugroup.jejuspring.booking.model.BookingCheckoutRequest;
import com.jejugroup.jejuspring.booking.model.BookingGuestLookupRequest;
import com.jejugroup.jejuspring.booking.view.BookingReservationView;
import com.jejugroup.jejuspring.config.AppProperties;

@Service
public class BookingWriteService {
    private static final int MAX_BOOKING_NO_ATTEMPTS = 3;

    private final AppProperties appProperties;
    private final BookingCommandRepository bookingCommandRepository;
    private final BookingQueryRepository bookingQueryRepository;

    public BookingWriteService(
        AppProperties appProperties,
        BookingCommandRepository bookingCommandRepository,
        BookingQueryRepository bookingQueryRepository
    ) {
        this.appProperties = appProperties;
        this.bookingCommandRepository = bookingCommandRepository;
        this.bookingQueryRepository = bookingQueryRepository;
    }

    public BookingReservationView checkout(BookingCheckoutRequest request, SessionUser sessionUser) throws SQLException {
        boolean memberBooking = sessionUser != null && request != null && !Boolean.FALSE.equals(request.memberBooking());
        String userId = memberBooking ? normalizeSessionUserId(sessionUser.id()) : null;

        try (Connection connection = openConnection()) {
            BookingQueryRepository.BookingUserRow memberUser = memberBooking
                ? bookingQueryRepository.loadUser(connection, userId)
                : null;
            CheckoutContext normalized = normalizeCheckoutRequest(request, memberBooking, memberUser);

            for (int attempt = 0; attempt < MAX_BOOKING_NO_ATTEMPTS; attempt++) {
                try {
                    connection.setAutoCommit(false);
                    LocalDateTime completedAt = LocalDateTime.now();
                    String bookingNo = bookingCommandRepository.reserveRandomBookingNo(normalized.bookingType());
                    long bookingId = bookingCommandRepository.insertBooking(
                        connection,
                        bookingNo,
                        userId,
                        normalized.bookingType(),
                        normalized.destination(),
                        normalized.memo(),
                        normalized.amount(),
                        normalized.currency(),
                        completedAt
                    );
                    long bookingItemId = bookingCommandRepository.insertBookingItem(
                        connection,
                        bookingId,
                        normalized.bookingType(),
                        normalized.destination(),
                        normalized.serviceStartDate(),
                        normalized.serviceEndDate(),
                        normalized.amount(),
                        normalized.currency()
                    );
                    bookingCommandRepository.insertBookingPassenger(
                        connection,
                        bookingId,
                        bookingItemId,
                        userId,
                        normalized.contactEmail(),
                        normalized.lastName(),
                        normalized.firstName(),
                        memberBooking
                    );
                    long paymentAttemptId = bookingCommandRepository.insertPaymentAttempt(
                        connection,
                        bookingId,
                        normalized.amount(),
                        normalized.paymentProvider(),
                        normalized.paymentMethod(),
                        normalized.currency(),
                        completedAt
                    );
                    bookingCommandRepository.insertPaymentTransaction(
                        connection,
                        paymentAttemptId,
                        bookingNo,
                        normalized.amount(),
                        normalized.currency(),
                        normalized.externalTransactionId(),
                        completedAt
                    );
                    connection.commit();
                    return new BookingReservationView(
                        bookingNo,
                        normalized.destination(),
                        normalized.amount(),
                        memberBooking,
                        normalized.serviceStartDate(),
                        normalized.lastName(),
                        normalized.firstName(),
                        normalized.contactEmail()
                    );
                } catch (SQLException exception) {
                    rollbackQuietly(connection);
                    if (attempt == MAX_BOOKING_NO_ATTEMPTS - 1 || !isDuplicateKeyException(exception)) {
                        throw exception;
                    }
                }
            }
        }

        throw new SQLException("예약 번호를 생성할 수 없습니다.");
    }

    public BookingReservationView guestLookup(BookingGuestLookupRequest request) throws SQLException {
        BookingGuestLookupRequest normalized = normalizeGuestLookupRequest(request);

        try (Connection connection = openConnection()) {
            BookingQueryRepository.BookingGuestLookupRow row = StringUtils.hasText(normalized.email())
                ? bookingQueryRepository.loadGuestLookup(connection, normalized.reservationNo(), normalized.email())
                : bookingQueryRepository.loadGuestLookup(
                    connection,
                    normalized.reservationNo(),
                    normalized.travelDate(),
                    normalized.lastName(),
                    normalized.firstName()
                );

            return new BookingReservationView(
                row.bookingNo(),
                row.destination(),
                row.amount(),
                row.memberBooking(),
                row.travelDate(),
                row.lastName(),
                row.firstName(),
                row.email()
            );
        }
    }

    private CheckoutContext normalizeCheckoutRequest(
        BookingCheckoutRequest request,
        boolean memberBooking,
        BookingQueryRepository.BookingUserRow memberUser
    ) {
        if (request == null) {
            throw new IllegalArgumentException("입력값이 올바르지 않습니다.");
        }

        String bookingType = resolveBookingType(request);
        String destination = firstText(request.destination(), "제주");
        LocalDate serviceStartDate = firstDate(
            request.checkInDate(),
            request.travelDate(),
            request.lookup() == null ? null : request.lookup().travelDate()
        );
        LocalDate serviceEndDate = firstDate(
            request.checkOutDate(),
            request.travelDate(),
            serviceStartDate
        );
        BigDecimal amount = firstAmount(
            request.totalAmount(),
            request.amount(),
            sumAmount(request.supplyAmount(), request.vatAmount())
        );
        String lastName = firstText(
            request.lookup() == null ? null : request.lookup().passengerLastName(),
            request.lookup() == null ? null : request.lookup().bookerLastName(),
            request.lastName()
        );
        String firstName = firstText(
            request.lookup() == null ? null : request.lookup().passengerFirstName(),
            request.lookup() == null ? null : request.lookup().bookerFirstName(),
            request.firstName()
        );
        PassengerName passengerName = resolvePassengerName(
            lastName,
            firstName,
            memberUser,
            request.payment() == null ? null : request.payment().cardHolder()
        );
        String paymentMethod = firstText(request.paymentMethod());
        String paymentProvider = firstText(
            request.paymentProvider(),
            derivePaymentProvider(paymentMethod)
        );
        String currency = normalizeCurrency(request.currency());
        String memo = trimToNull(request.memo());
        String externalTransactionId = trimToNull(request.externalTransactionId());
        String contactEmail = firstText(
            request.guestEmail(),
            request.lookup() == null ? null : request.lookup().email(),
            memberBooking && memberUser != null ? memberUser.email() : null
        );

        return new CheckoutContext(
            bookingType,
            destination,
            serviceStartDate,
            serviceEndDate,
            amount,
            requireText(passengerName.lastName()),
            requireText(passengerName.firstName()),
            trimToNull(contactEmail),
            paymentProvider,
            paymentMethod,
            currency,
            memo,
            externalTransactionId
        );
    }

    private BookingGuestLookupRequest normalizeGuestLookupRequest(BookingGuestLookupRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("입력값이 올바르지 않습니다.");
        }

        if (!StringUtils.hasText(request.reservationNo())) {
            throw new IllegalArgumentException("입력값이 올바르지 않습니다.");
        }

        String email = trimToNull(request.email());
        LocalDate travelDate = request.travelDate();
        String lastName = trimToNull(request.lastName());
        String firstName = trimToNull(request.firstName());

        if (!StringUtils.hasText(email) && (travelDate == null || !StringUtils.hasText(lastName) || !StringUtils.hasText(firstName))) {
            throw new IllegalArgumentException("입력값이 올바르지 않습니다.");
        }

        return new BookingGuestLookupRequest(
            request.reservationNo().trim(),
            email,
            travelDate,
            lastName,
            firstName
        );
    }

    private Connection openConnection() throws SQLException {
        String url = normalize(appProperties.database().dbUrl());
        String user = normalize(appProperties.database().dbUser());
        String password = normalize(appProperties.database().dbPassword());

        if (!StringUtils.hasText(url) || !StringUtils.hasText(user) || !StringUtils.hasText(password)) {
            throw new SQLException("Booking DB configuration is missing");
        }

        return DriverManager.getConnection(url, user, password);
    }

    private void rollbackQuietly(Connection connection) {
        try {
            connection.rollback();
        } catch (SQLException ignored) {
            // rollback 실패는 원래 예외를 덮어쓰지 않는다.
        }
    }

    private boolean isDuplicateKeyException(SQLException exception) {
        String message = exception.getMessage();
        if (!StringUtils.hasText(message)) {
            return false;
        }

        String normalized = message.toLowerCase();
        return normalized.contains("duplicate") || normalized.contains("uk_bookings_booking_no");
    }

    private String requireText(String value) {
        if (!StringUtils.hasText(value)) {
            throw new IllegalArgumentException("입력값이 올바르지 않습니다.");
        }

        return value.trim();
    }

    private PassengerName resolvePassengerName(
        String lastName,
        String firstName,
        BookingQueryRepository.BookingUserRow memberUser,
        String fallbackName
    ) {
        String normalizedLastName = trimToNull(lastName);
        String normalizedFirstName = trimToNull(firstName);

        if (StringUtils.hasText(normalizedLastName) && StringUtils.hasText(normalizedFirstName)) {
            return new PassengerName(normalizedLastName, normalizedFirstName);
        }

        String resolvedFallbackName = firstText(
            memberUser == null ? null : memberUser.name(),
            fallbackName
        );
        if (!StringUtils.hasText(resolvedFallbackName)) {
            return new PassengerName(normalizedLastName, normalizedFirstName);
        }

        if (StringUtils.hasText(normalizedLastName) && !StringUtils.hasText(normalizedFirstName)) {
            return new PassengerName(normalizedLastName, resolvedFallbackName);
        }

        if (!StringUtils.hasText(normalizedLastName) && StringUtils.hasText(normalizedFirstName)) {
            return new PassengerName(resolvedFallbackName, normalizedFirstName);
        }

        String[] tokens = resolvedFallbackName.split("\\s+");
        if (tokens.length >= 2) {
            String resolvedLastName = tokens[0].trim();
            String resolvedFirstName = resolvedFallbackName.substring(resolvedLastName.length()).trim();
            return new PassengerName(resolvedLastName, resolvedFirstName);
        }

        if (resolvedFallbackName.length() >= 2) {
            return new PassengerName(resolvedFallbackName.substring(0, 1), resolvedFallbackName.substring(1));
        }

        return new PassengerName(resolvedFallbackName, resolvedFallbackName);
    }

    private String normalizeCurrency(String currency) {
        if (!StringUtils.hasText(currency)) {
            return "KRW";
        }

        String normalized = currency.trim().toUpperCase();
        if (normalized.length() != 3) {
            throw new IllegalArgumentException("입력값이 올바르지 않습니다.");
        }

        return normalized;
    }

    private String trimToNull(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }

        return value.trim();
    }

    private String normalizeSessionUserId(String userId) {
        if (!StringUtils.hasText(userId)) {
            throw new IllegalArgumentException("입력값이 올바르지 않습니다.");
        }

        return userId.trim();
    }

    private String firstText(String... values) {
        for (String value : values) {
            if (StringUtils.hasText(value)) {
                return value.trim();
            }
        }

        return null;
    }

    private LocalDate firstDate(LocalDate... values) {
        for (LocalDate value : values) {
            if (value != null) {
                return value;
            }
        }

        throw new IllegalArgumentException("입력값이 올바르지 않습니다.");
    }

    private BigDecimal firstAmount(BigDecimal... values) {
        for (BigDecimal value : values) {
            if (value != null && value.compareTo(BigDecimal.ZERO) > 0) {
                return value;
            }
        }

        throw new IllegalArgumentException("입력값이 올바르지 않습니다.");
    }

    private BigDecimal sumAmount(BigDecimal supplyAmount, BigDecimal vatAmount) {
        if (supplyAmount == null && vatAmount == null) {
            return null;
        }

        BigDecimal supply = supplyAmount == null ? BigDecimal.ZERO : supplyAmount;
        BigDecimal vat = vatAmount == null ? BigDecimal.ZERO : vatAmount;
        BigDecimal total = supply.add(vat);
        return total.compareTo(BigDecimal.ZERO) > 0 ? total : null;
    }

    private String derivePaymentProvider(String paymentMethod) {
        if (!StringUtils.hasText(paymentMethod)) {
            return "card";
        }

        String normalized = paymentMethod.trim().toLowerCase();
        return switch (normalized) {
            case "card", "credit_card", "credit-card" -> "card";
            case "transfer", "bank_transfer" -> "bank_transfer";
            case "mobile", "mobile_payment" -> "mobile";
            default -> normalized;
        };
    }

    private String resolveBookingType(BookingCheckoutRequest request) {
        String explicitBookingType = normalizeBookingType(request.bookingType());
        if (StringUtils.hasText(explicitBookingType)) {
            return explicitBookingType;
        }

        if (request.checkInDate() != null || request.checkOutDate() != null) {
            return "stay";
        }

        String tripType = trimToNull(request.tripType());
        if (StringUtils.hasText(tripType)) {
            return "air";
        }

        return "air";
    }

    private String normalizeBookingType(String bookingType) {
        String normalized = trimToNull(bookingType);
        if (!StringUtils.hasText(normalized)) {
            return null;
        }

        String lowered = normalized.toLowerCase();
        return switch (lowered) {
            case "stay", "hotel", "lodging" -> "stay";
            case "air", "flight" -> "air";
            default -> lowered;
        };
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }

    private record CheckoutContext(
        String bookingType,
        String destination,
        LocalDate serviceStartDate,
        LocalDate serviceEndDate,
        BigDecimal amount,
        String lastName,
        String firstName,
        String contactEmail,
        String paymentProvider,
        String paymentMethod,
        String currency,
        String memo,
        String externalTransactionId
    ) {
    }

    private record PassengerName(
        String lastName,
        String firstName
    ) {
    }
}
