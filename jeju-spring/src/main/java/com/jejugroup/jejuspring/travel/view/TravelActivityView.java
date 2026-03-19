package com.jejugroup.jejuspring.travel.view;

public record TravelActivityView(
    String id,
    String category,
    String title,
    String location,
    String rating,
    String reviewCount,
    String imageUrl,
    String badge,
    String benefitLabel,
    String originalPrice,
    String discountedPrice
) {
}
