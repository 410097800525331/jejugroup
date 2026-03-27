package com.jejugroup.jejuspring.mypage.view;

import java.util.List;

public record MyPageDashboardView(
    String shell,
    String userName,
    String userId,
    String userRole,
    String avatarUrl,
    String email,
    String tier,
    String redirectLoginPath,
    String selectedFilter,
    List<String> filters,
    List<String> memberships,
    List<MyPageStatView> stats,
    List<MyPageBookingView> bookings,
    List<MyPageSupportView> supportItems
) {
}
