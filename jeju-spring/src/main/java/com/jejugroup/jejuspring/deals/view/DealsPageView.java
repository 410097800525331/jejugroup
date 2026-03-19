package com.jejugroup.jejuspring.deals.view;

import java.util.List;

public record DealsPageView(
    String shell,
    String migrationPath,
    String title,
    String description,
    List<DealsCouponView> coupons,
    List<DealsCardView> cards
) {
}
