package com.jejugroup.jejuspring.stay.view;

import java.math.BigDecimal;
import java.util.List;

public record StayMonthlyDealListView(
    List<HotelDeal> items,
    int count
) {
    public record HotelDeal(
        String propertyCode,
        String title,
        String badgeText,
        String summaryText,
        String regionName,
        String heroImagePath,
        BigDecimal originalPrice,
        BigDecimal currentPrice,
        BigDecimal discountAmount,
        int discountRate,
        Double starRating,
        String roomTypeCode,
        String roomTypeName,
        Integer maxOccupancy,
        String policyCode,
        String policyName,
        List<Tag> tags,
        List<Benefit> benefits
    ) {
    }

    public record Tag(
        String name,
        String tagType,
        int sortOrder
    ) {
    }

    public record Benefit(
        String code,
        String name,
        String icon,
        int sortOrder
    ) {
    }
}
