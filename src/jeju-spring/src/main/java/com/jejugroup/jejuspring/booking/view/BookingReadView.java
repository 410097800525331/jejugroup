package com.jejugroup.jejuspring.booking.view;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record BookingReadView(
    String scopeUserId,
    UserView user,
    SummaryView summary,
    List<BookingView> bookings
) {
    public record UserView(
        String id,
        String name,
        String role,
        String email,
        String phone
    ) {
    }

    public record SummaryView(
        long bookingCount,
        long activeBookingCount,
        long paidBookingCount,
        long paymentAttemptCount,
        BigDecimal totalAmount,
        BigDecimal paidAmount
    ) {
    }

    public record BookingView(
        String bookingNo,
        String bookingType,
        String status,
        String paymentStatus,
        String title,
        String servicePeriod,
        String currency,
        BigDecimal totalAmount,
        BigDecimal paidAmount,
        LocalDateTime bookedAt,
        LocalDateTime cancelledAt,
        String memo,
        int itemCount,
        List<BookingItemView> items,
        PaymentAttemptView latestPaymentAttempt,
        List<PaymentAttemptView> paymentAttempts
    ) {
    }

    public record BookingItemView(
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

    public record PaymentAttemptView(
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
}
