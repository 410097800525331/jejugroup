package com.jejugroup.jejuspring.banner.web;

import java.io.IOException;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jejugroup.jejuspring.banner.application.BannerAssetService;

@RestController
@RequestMapping("/api/banners")
public class BannerAssetController {
    private final BannerAssetService bannerAssetService;

    public BannerAssetController(BannerAssetService bannerAssetService) {
        this.bannerAssetService = bannerAssetService;
    }

    @GetMapping("/assets/{bannerId}/{fileName:.+}")
    public ResponseEntity<?> loadBannerAsset(
        @PathVariable("bannerId") String bannerId,
        @PathVariable("fileName") String fileName
    ) {
        try {
            BannerAssetService.BannerAssetFile bannerAssetFile = bannerAssetService.loadBannerImage(bannerId, fileName);
            return ResponseEntity.ok()
                .contentType(bannerAssetFile.mediaType())
                .header(HttpHeaders.CACHE_CONTROL, "no-store")
                .body(bannerAssetFile.resource());
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().build();
        } catch (java.util.NoSuchElementException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IOException exception) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }
    }
}
