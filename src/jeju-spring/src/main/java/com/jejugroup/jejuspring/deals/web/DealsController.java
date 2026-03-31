package com.jejugroup.jejuspring.deals.web;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DealsController {
    @GetMapping("/deals")
    public String deals(HttpServletRequest request) {
        return redirectToCanonical(request, "/jejustay/pages/deals/deals.html");
    }

    @GetMapping("/deals/member")
    public String member(HttpServletRequest request) {
        return redirectToCanonical(request, "/jejustay/pages/deals/deals_member.html");
    }

    @GetMapping("/deals/partner")
    public String partner(HttpServletRequest request) {
        return redirectToCanonical(request, "/jejustay/pages/deals/deals_partner.html");
    }

    private String redirectToCanonical(HttpServletRequest request, String canonicalPath) {
        String queryString = request.getQueryString();
        if (queryString == null || queryString.isBlank()) {
            return "redirect:%s".formatted(canonicalPath);
        }

        return "redirect:%s?%s".formatted(canonicalPath, queryString);
    }
}
