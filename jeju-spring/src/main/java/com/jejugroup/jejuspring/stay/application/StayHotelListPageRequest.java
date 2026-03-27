package com.jejugroup.jejuspring.stay.application;

public record StayHotelListPageRequest(
    String shell,
    StayHotelListQuery query
) {
}
