package com.jejugroup.jejuspring.stay.web;

import java.util.Set;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jejugroup.jejuspring.stay.application.StayHotelListFactory;
import com.jejugroup.jejuspring.stay.application.StayHotelListQuery;
import com.jejugroup.jejuspring.stay.view.StayHotelListPageView;

@Controller
public class StayController {
    private static final Set<String> SUPPORTED_SHELLS = Set.of("main", "stay", "air");

    private final ObjectMapper objectMapper;
    private final StayHotelListFactory stayHotelListFactory;

    public StayController(StayHotelListFactory stayHotelListFactory, ObjectMapper objectMapper) {
        this.stayHotelListFactory = stayHotelListFactory;
        this.objectMapper = objectMapper;
    }

    @GetMapping({ "/stay/hotel-list", "/jejustay/pages/hotel/hotel-list.html" })
    public String hotelList(
        @RequestParam(name = "shell", required = false) String shell,
        @RequestParam(name = "region", required = false) String region,
        @RequestParam(name = "keyword", required = false) String keyword,
        @RequestParam(name = "checkIn", required = false) String checkIn,
        @RequestParam(name = "checkOut", required = false) String checkOut,
        @RequestParam(name = "adults", required = false, defaultValue = "1") int adults,
        @RequestParam(name = "children", required = false, defaultValue = "0") int children,
        @RequestParam(name = "rooms", required = false, defaultValue = "1") int rooms,
        @RequestParam(name = "filter", required = false) List<String> filters,
        Model model
    ) {
        StayHotelListPageView page = stayHotelListFactory.build(
            normalizeShell(shell),
            new StayHotelListQuery(region, keyword, checkIn, checkOut, Math.max(1, adults), Math.max(0, children), Math.max(1, rooms), filters)
        );

        model.addAttribute("page", page);
        model.addAttribute("pageJson", toJson(page));
        return "stay/hotel-list";
    }

    private String toJson(StayHotelListPageView page) {
        try {
            return objectMapper.writeValueAsString(page);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Failed to serialize stay hotel list page payload", exception);
        }
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

    private String normalizeShell(String shell) {
        if (shell == null) {
            return "stay";
        }

        String normalized = shell.trim().toLowerCase();
        return SUPPORTED_SHELLS.contains(normalized) ? normalized : "stay";
    }
}
