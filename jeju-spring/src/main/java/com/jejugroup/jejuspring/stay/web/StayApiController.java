package com.jejugroup.jejuspring.stay.web;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jejugroup.jejuspring.stay.view.StayHotelListPageView;

@RestController
public class StayApiController {
    private final StayController stayController;

    public StayApiController(StayController stayController) {
        this.stayController = stayController;
    }

    @GetMapping("/api/stay/hotel-list")
    public StayHotelListPageView hotelListData(
        @RequestParam(name = "shell", required = false) String shell,
        @RequestParam(name = "region", required = false) String region,
        @RequestParam(name = "keyword", required = false) String keyword,
        @RequestParam(name = "checkIn", required = false) String checkIn,
        @RequestParam(name = "checkOut", required = false) String checkOut,
        @RequestParam(name = "adults", required = false, defaultValue = "1") int adults,
        @RequestParam(name = "children", required = false, defaultValue = "0") int children,
        @RequestParam(name = "rooms", required = false, defaultValue = "1") int rooms,
        @RequestParam(name = "filter", required = false) List<String> filters
    ) {
        return stayController.buildPage(shell, region, keyword, checkIn, checkOut, adults, children, rooms, filters);
    }
}
