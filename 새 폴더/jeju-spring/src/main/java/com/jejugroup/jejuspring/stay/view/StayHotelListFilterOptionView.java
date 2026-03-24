package com.jejugroup.jejuspring.stay.view;

public record StayHotelListFilterOptionView(
    String id,
    String label,
    Integer count,
    String description,
    boolean checked
) {
}
