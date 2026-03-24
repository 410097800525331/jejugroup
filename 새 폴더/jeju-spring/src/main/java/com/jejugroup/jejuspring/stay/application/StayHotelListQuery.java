package com.jejugroup.jejuspring.stay.application;

import java.util.List;

public record StayHotelListQuery(
    String region,
    String keyword,
    String checkIn,
    String checkOut,
    int adults,
    int children,
    int rooms,
    List<String> filters
) {
    public StayHotelListQuery {
        filters = filters == null ? List.of() : List.copyOf(filters);
    }
}
