package com.jejugroup.jejuspring.stay.view;

import java.util.List;

public record StayHotelListPageView(
    String shell,
    String region,
    String regionLabel,
    String mapButtonLabel,
    String migrationPath,
    StayHotelListSearchSummaryView searchSummary,
    List<StayHotelListFilterSectionView> filterSections,
    List<StayHotelListItemView> hotels
) {
}
