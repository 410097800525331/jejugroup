package com.jejugroup.jejuspring.booking.model;

import java.math.BigDecimal;
import java.time.LocalDate;

public record BookingCheckoutRequest(
    String paymentMethod,
    BigDecimal totalAmount,
    BigDecimal supplyAmount,
    BigDecimal vatAmount,
    Boolean memberBooking,
    String bookingType,
    String tripType,
    LocalDate checkInDate,
    LocalDate checkOutDate,
    String guestEmail,
    Lookup lookup,
    Payment payment,
    String destination,
    LocalDate travelDate,
    BigDecimal amount,
    String lastName,
    String firstName,
    String paymentProvider,
    String currency,
    String memo,
    String externalTransactionId
) {
    public record Lookup(
        String bookerLastName,
        String bookerFirstName,
        String passengerLastName,
        String passengerFirstName,
        LocalDate travelDate,
        String email
    ) {
    }

    public record Payment(
        String cardNumber,
        String cardHolder,
        String cardExpiry,
        String cardCvv,
        String mobileNumber
    ) {
    }
}
