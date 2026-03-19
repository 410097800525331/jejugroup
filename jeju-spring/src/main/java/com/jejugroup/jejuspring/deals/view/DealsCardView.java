package com.jejugroup.jejuspring.deals.view;

public record DealsCardView(
    String title,
    String subtitle,
    String originalPrice,
    String currentPrice,
    String category,
    String imageUrl,
    String badge
) {
}
