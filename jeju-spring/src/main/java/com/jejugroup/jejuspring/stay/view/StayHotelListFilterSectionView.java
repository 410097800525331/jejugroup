package com.jejugroup.jejuspring.stay.view;

import java.util.List;

public record StayHotelListFilterSectionView(
    String id,
    String title,
    List<StayHotelListFilterOptionView> options
) {
}
