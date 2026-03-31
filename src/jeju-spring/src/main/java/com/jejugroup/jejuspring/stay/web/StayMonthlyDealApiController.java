package com.jejugroup.jejuspring.stay.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jejugroup.jejuspring.stay.application.StayMonthlyDealDbStore;
import com.jejugroup.jejuspring.stay.view.StayMonthlyDealListView;

@RestController
@RequestMapping("/api/stay")
public class StayMonthlyDealApiController {
    private final StayMonthlyDealDbStore stayMonthlyDealDbStore;

    public StayMonthlyDealApiController(StayMonthlyDealDbStore stayMonthlyDealDbStore) {
        this.stayMonthlyDealDbStore = stayMonthlyDealDbStore;
    }

    @GetMapping("/hotel-monthly-deals")
    public StayMonthlyDealListView hotelMonthlyDeals() {
        return stayMonthlyDealDbStore.loadVisibleMonthlyDeals();
    }
}
