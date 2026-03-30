package com.jejugroup.jejuspring.booking.view;

import java.math.BigDecimal;
import java.time.LocalDate;

public record BookingReservationView(
    String bookingNo,
    String reservationNo,
    String destination,
    BigDecimal amount,
    boolean memberBooking,
    LocalDate travelDate,
    String lastName,
    String firstName,
    String email
) {
    public BookingReservationView(
        String bookingNo,
        String destination,
        BigDecimal amount,
        boolean memberBooking,
        LocalDate travelDate,
        String lastName,
        String firstName,
        String email
    ) {
        this(bookingNo, bookingNo, destination, amount, memberBooking, travelDate, lastName, firstName, email);
    }
}
