package com.jejugroup.jejuspring.stay.view;

import java.util.List;

public record StayHotelListItemView(
    String id,
    String title,
    String stars,
    String location,
    String locationId,
    String propertyTypeId,
    String reviewScore,
    String reviewLabel,
    String originalPrice,
    String currentPrice,
    String imageUrl,
    String badge,
    List<String> filterIds,
    List<String> tags
) {
}
