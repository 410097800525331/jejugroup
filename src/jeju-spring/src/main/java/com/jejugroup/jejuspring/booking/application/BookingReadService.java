package com.jejugroup.jejuspring.booking.application;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.jejugroup.jejuspring.booking.view.BookingReadView;
import com.jejugroup.jejuspring.config.AppProperties;

@Service
public class BookingReadService {
    private final AppProperties appProperties;
    private final BookingQueryRepository bookingQueryRepository;

    public BookingReadService(AppProperties appProperties, BookingQueryRepository bookingQueryRepository) {
        this.appProperties = appProperties;
        this.bookingQueryRepository = bookingQueryRepository;
    }

    public BookingReadView readUserBookings(String userId) throws SQLException {
        String normalizedUserId = requireUserId(userId);
        try (Connection connection = openConnection()) {
            BookingQueryRepository.BookingUserRow user = bookingQueryRepository.loadUser(connection, normalizedUserId);
            List<BookingQueryRepository.BookingRow> bookings = bookingQueryRepository.loadBookings(connection, normalizedUserId);

            List<BookingReadView.BookingView> bookingViews = new ArrayList<>();
            long paymentAttemptCount = 0L;
            long activeBookingCount = 0L;
            long paidBookingCount = 0L;
            BigDecimal totalAmount = BigDecimal.ZERO;
            BigDecimal paidAmount = BigDecimal.ZERO;

            for (BookingQueryRepository.BookingRow booking : bookings) {
                List<BookingQueryRepository.BookingItemRow> items = bookingQueryRepository.loadBookingItems(connection, booking.id());
                List<BookingQueryRepository.PaymentAttemptRow> paymentAttempts = bookingQueryRepository.loadPaymentAttempts(connection, booking.id());
                List<BookingReadView.BookingItemView> itemViews = items.stream()
                    .map(this::toItemView)
                    .toList();
                List<BookingReadView.PaymentAttemptView> paymentAttemptViews = paymentAttempts.stream()
                    .map(this::toPaymentAttemptView)
                    .toList();

                paymentAttemptCount += paymentAttemptViews.size();
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
                    resolveTitle(booking, itemViews),
                    resolveServicePeriod(booking, itemViews),
                    booking.currency(),
                    booking.totalAmount(),
                    booking.paidAmount(),
                    booking.bookedAt(),
                    booking.cancelledAt(),
                    booking.memo(),
                    itemViews.size(),
                    List.copyOf(itemViews),
                    paymentAttemptViews.isEmpty() ? null : paymentAttemptViews.get(0),
                    List.copyOf(paymentAttemptViews)
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
    }

    private BookingReadView.UserView toUserView(BookingQueryRepository.BookingUserRow user) {
        return new BookingReadView.UserView(
            user.id(),
            user.name(),
            user.role(),
            user.email(),
            user.phone()
        );
    }

    private BookingReadView.BookingItemView toItemView(BookingQueryRepository.BookingItemRow item) {
        return new BookingReadView.BookingItemView(
            item.itemNo(),
            item.bookingType(),
            item.itemName(),
            item.productCode(),
            item.supplierName(),
            item.serviceStartDate(),
            item.serviceEndDate(),
            item.quantity(),
            item.unitPrice(),
            item.totalAmount(),
            item.currency()
        );
    }

    private BookingReadView.PaymentAttemptView toPaymentAttemptView(BookingQueryRepository.PaymentAttemptRow attempt) {
        return new BookingReadView.PaymentAttemptView(
            attempt.attemptNo(),
            attempt.paymentProvider(),
            attempt.paymentMethod(),
            attempt.status(),
            attempt.requestedAmount(),
            attempt.approvedAmount(),
            attempt.currency(),
            attempt.requestedAt(),
            attempt.completedAt(),
            attempt.failureCode(),
            attempt.failureMessage()
        );
    }

    private Connection openConnection() throws SQLException {
        String url = normalize(appProperties.database().dbUrl());
        String user = normalize(appProperties.database().dbUser());
        String password = normalize(appProperties.database().dbPassword());

        if (!StringUtils.hasText(url) || !StringUtils.hasText(user) || !StringUtils.hasText(password)) {
            throw new SQLException("Spring booking DB configuration is missing");
        }

        Connection connection = DriverManager.getConnection(url, user, password);
        connection.setReadOnly(true);
        return connection;
    }

    private String requireUserId(String userId) {
        if (!StringUtils.hasText(userId)) {
            throw new IllegalArgumentException("userId is required");
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

    private String resolveTitle(BookingQueryRepository.BookingRow booking, List<BookingReadView.BookingItemView> items) {
        if (!items.isEmpty() && StringUtils.hasText(items.get(0).itemName())) {
            return items.get(0).itemName();
        }

        return booking.bookingType() + " 예약";
    }

    private String resolveServicePeriod(BookingQueryRepository.BookingRow booking, List<BookingReadView.BookingItemView> items) {
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

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }
}
