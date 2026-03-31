package com.jejugroup.jejuspring.travel.view;

import java.util.List;

public record TravelActivitiesPageView(
    String shell,
    String authLoginPath,
    String authPassPath,
    String migrationPath,
    List<TravelCategoryView> categories,
    List<TravelActivityView> activities
) {
}
