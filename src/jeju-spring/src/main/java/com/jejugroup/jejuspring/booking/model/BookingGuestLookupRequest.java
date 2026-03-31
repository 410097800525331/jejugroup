package com.jejugroup.jejuspring.booking.model;

import java.time.LocalDate;

public record BookingGuestLookupRequest(
    String reservationNo,
    String email,
    LocalDate travelDate,
    String lastName,
    String firstName
) {
}
