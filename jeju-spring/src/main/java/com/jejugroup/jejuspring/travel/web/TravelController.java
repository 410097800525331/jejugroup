package com.jejugroup.jejuspring.travel.web;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TravelController {
    @GetMapping("/travel/activities")
    public String activities(HttpServletRequest request) {
        return redirectToCanonical(request, "/jejustay/pages/travel/activities.html");
    }

    @GetMapping("/travel/esim")
    public String esim(HttpServletRequest request) {
        return redirectToCanonical(request, "/jejustay/pages/travel/esim.html");
    }

    @GetMapping("/travel/guide")
    public String guide(HttpServletRequest request) {
        return redirectToCanonical(request, "/jejustay/pages/travel/travel_guide.html");
    }

    @GetMapping("/travel/tips")
    public String tips(HttpServletRequest request) {
        return redirectToCanonical(request, "/jejustay/pages/travel/travel_tips.html");
    }

    private String redirectToCanonical(HttpServletRequest request, String canonicalPath) {
        String queryString = request.getQueryString();
        if (queryString == null || queryString.isBlank()) {
            return "redirect:%s".formatted(canonicalPath);
        }

        return "redirect:%s?%s".formatted(canonicalPath, queryString);
    }
}
