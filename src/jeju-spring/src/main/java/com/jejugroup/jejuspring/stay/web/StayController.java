package com.jejugroup.jejuspring.stay.web;

import java.util.List;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.jejugroup.jejuspring.stay.application.StayHotelListFactory;
import com.jejugroup.jejuspring.stay.application.StayHotelListQueryService;
import com.jejugroup.jejuspring.stay.application.StayHotelListPageRequest;
import com.jejugroup.jejuspring.stay.view.StayHotelListPageView;

@Controller
public class StayController {
    private final StayHotelListQueryService stayHotelListQueryService;
    private final StayHotelListFactory stayHotelListFactory;

    public StayController(StayHotelListQueryService stayHotelListQueryService, StayHotelListFactory stayHotelListFactory) {
        this.stayHotelListQueryService = stayHotelListQueryService;
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
        StayHotelListPageRequest request = stayHotelListQueryService.normalize(
            shell,
            region,
            keyword,
            checkIn,
            checkOut,
            adults,
            children,
            rooms,
            filters
        );
        return stayHotelListFactory.build(request);
    }

    private String redirectToCanonical(HttpServletRequest request, String canonicalPath) {
        String queryString = request.getQueryString();
        if (queryString == null || queryString.isBlank()) {
            return "redirect:%s".formatted(canonicalPath);
        }

        return "redirect:%s?%s".formatted(canonicalPath, queryString);
    }
}
