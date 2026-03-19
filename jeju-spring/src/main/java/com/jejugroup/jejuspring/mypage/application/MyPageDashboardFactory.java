package com.jejugroup.jejuspring.mypage.application;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jejugroup.jejuspring.auth.model.SessionUser;
import com.jejugroup.jejuspring.mypage.view.MyPageBookingView;
import com.jejugroup.jejuspring.mypage.view.MyPageDashboardView;
import com.jejugroup.jejuspring.mypage.view.MyPageStatView;
import com.jejugroup.jejuspring.mypage.view.MyPageSupportView;

@Service
public class MyPageDashboardFactory {
    private static final List<String> FILTERS = List.of("all", "air", "stay", "rent");

    private static final List<MyPageBookingView> BOOKINGS = List.of(
        new MyPageBookingView("air-icn-nrt", "air", "ICN -> NRT 제주항공 7C1102", "출발 예정", "2026.11.20 09:10", "324,000원", List.of("모바일 탑승권", "위탁 수하물 15kg")),
        new MyPageBookingView("air-gmp-cju", "air", "GMP -> CJU 제주항공 7C113", "출발 예정", "2026.10.15 08:30", "124,000원", List.of("성인 1, 소아 1", "사전 수하물")),
        new MyPageBookingView("stay-jeju-ocean", "stay", "Jeju Ocean Suite", "체크인 예정", "2026.10.15 ~ 10.17", "480,000원", List.of("조식 포함", "수영장", "얼리 체크인")),
        new MyPageBookingView("rent-ioniq", "rent", "IONIQ 6 Long Range", "인수 예정", "2026.10.15 09:30", "135,000원", List.of("완전 자차", "공항 픽업", "전기차"))
    );

    private static final List<MyPageStatView> STATS = List.of(
        new MyPageStatView("보유 포인트", "wallet", "26,600P"),
        new MyPageStatView("사용 가능한 쿠폰", "wallet", "12장"),
        new MyPageStatView("예정된 항공 일정", "air", "2건"),
        new MyPageStatView("예정된 숙소 일정", "stay", "1건")
    );

    private static final List<MyPageSupportView> SUPPORT_ITEMS = List.of(
        new MyPageSupportView("qna", "1:1 문의 내역", 1, "#"),
        new MyPageSupportView("notice", "운항 및 예약 공지", 0, "#"),
        new MyPageSupportView("faq", "자주 묻는 질문", null, "#")
    );

    public MyPageDashboardView build(SessionUser sessionUser, String shell, String filter, String loginPath) {
        String selectedFilter = FILTERS.contains(filter) ? filter : "all";
        List<MyPageBookingView> filteredBookings = BOOKINGS.stream()
            .filter(booking -> "all".equals(selectedFilter) || booking.type().equals(selectedFilter))
            .toList();

        return new MyPageDashboardView(
            shell,
            sessionUser.name(),
            sessionUser.id(),
            sessionUser.role(),
            "%s@jejugroup.example".formatted(sessionUser.id()),
            "BLACK",
            loginPath,
            selectedFilter,
            FILTERS,
            List.of("Jeju Air 리프레시", "Jeju Stay 프레스티지"),
            STATS,
            filteredBookings,
            SUPPORT_ITEMS
        );
    }
}
