package com.jejugroup.jejuspring.mypage.application;

import java.sql.SQLException;
import java.util.List;

import org.springframework.stereotype.Service;

import com.jejugroup.jejuspring.auth.model.SessionUser;
import com.jejugroup.jejuspring.mypage.application.MyPageDashboardRepository.MyPageDashboardSnapshot;
import com.jejugroup.jejuspring.mypage.view.MyPageBookingView;
import com.jejugroup.jejuspring.mypage.view.MyPageDashboardView;
import com.jejugroup.jejuspring.mypage.view.MyPageStatView;
import com.jejugroup.jejuspring.mypage.view.MyPageSupportView;

@Service
public class MyPageDashboardFactory {
    private static final List<String> FILTERS = List.of("all", "air", "stay", "rent");

    private final MyPageDashboardRepository dashboardRepository;

    public MyPageDashboardFactory(MyPageDashboardRepository dashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }

    public MyPageDashboardView build(SessionUser sessionUser, String shell, String filter, String loginPath) throws SQLException {
        MyPageDashboardSnapshot snapshot = dashboardRepository.load(sessionUser.id());
        String selectedFilter = FILTERS.contains(filter) ? filter : "all";
        List<MyPageBookingView> filteredBookings = snapshot.bookings().stream()
            .filter(booking -> "all".equals(selectedFilter) || booking.type().equals(selectedFilter))
            .toList();

        return new MyPageDashboardView(
            shell,
            fallbackValue(sessionUser.name(), snapshot.profile().name()),
            fallbackValue(sessionUser.id(), snapshot.profile().id()),
            fallbackValue(sessionUser.role(), snapshot.profile().role()),
            fallbackValue(snapshot.profile().email(), "%s@jejugroup.example".formatted(sessionUser.id())),
            fallbackValue(snapshot.profile().tier(), snapshot.memberships().isEmpty() ? "멤버십 없음" : snapshot.memberships().getFirst()),
            loginPath,
            selectedFilter,
            FILTERS,
            snapshot.memberships(),
            snapshot.stats(),
            filteredBookings,
            snapshot.supportItems()
        );
    }

    private String fallbackValue(String value, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        return value;
    }
}
