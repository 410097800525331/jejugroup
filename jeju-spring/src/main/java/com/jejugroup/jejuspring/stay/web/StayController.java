package com.jejugroup.jejuspring.stay.web;

import java.util.List;
import java.util.Set;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.jejugroup.jejuspring.stay.application.StayHotelListFactory;
import com.jejugroup.jejuspring.stay.application.StayHotelListQuery;
import com.jejugroup.jejuspring.stay.view.StayHotelListPageView;

@Controller
public class StayController {
    private static final Set<String> SUPPORTED_SHELLS = Set.of("main", "stay", "air");

    private final StayHotelListFactory stayHotelListFactory;

    public StayController(StayHotelListFactory stayHotelListFactory) {
        this.stayHotelListFactory = stayHotelListFactory;
    }

    @GetMapping("/stay/hotel-list")
    public String hotelList(HttpServletRequest request) {
        return redirectToCanonical(request, "/jejustay/pages/hotel/hotel-list.html");
    }

    StayHotelListPageView buildPage(
        String shell,
        String region,
        String keyword,
        String checkIn,
        String checkOut,
        int adults,
        int children,
        int rooms,
        List<String> filters
    ) {
        return stayHotelListFactory.build(
            normalizeShell(shell),
            new StayHotelListQuery(region, keyword, checkIn, checkOut, Math.max(1, adults), Math.max(0, children), Math.max(1, rooms), filters)
        );
    }

    private String redirectToCanonical(HttpServletRequest request, String canonicalPath) {
        String queryString = request.getQueryString();
        if (queryString == null || queryString.isBlank()) {
            return "redirect:%s".formatted(canonicalPath);
        }

        return "redirect:%s?%s".formatted(canonicalPath, queryString);
    }

    private String normalizeShell(String shell) {
        if (shell == null) {
            return "stay";
        }

        String normalized = shell.trim().toLowerCase();
        return SUPPORTED_SHELLS.contains(normalized) ? normalized : "stay";
    }
}
