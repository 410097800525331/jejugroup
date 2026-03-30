package com.jejugroup.jejuspring.web;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jejugroup.jejuspring.admin.web.AdminBannerDbStore;

@RestController
@RequestMapping("/api/banners")
public class BannerApiController {
    private final AdminBannerDbStore bannerStore;

    public BannerApiController(AdminBannerDbStore bannerStore) {
        this.bannerStore = bannerStore;
    }

    @GetMapping(value = "/managed", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> managedBanners() {
        try {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", bannerStore.listPublicBanners()
            ));
        } catch (RuntimeException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Banner service unavailable");
        }
    }

    private ResponseEntity<Map<String, Object>> json(HttpStatus status, boolean success, String message) {
        return ResponseEntity.status(status).body(Map.of(
            "success", success,
            "message", message
        ));
    }
}
