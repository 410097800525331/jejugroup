package com.jejugroup.jejuspring.admin.web;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Set;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jejugroup.jejuspring.auth.model.SessionUser;

@RestController
@RequestMapping("/api/admin/cms/banners")
public class AdminBannerApiController {
    private final AdminBannerDbStore adminBannerStore;

    public AdminBannerApiController(AdminBannerDbStore adminBannerStore) {
        this.adminBannerStore = adminBannerStore;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> listBanners(HttpSession session) {
        return runWithAdmin(session, () -> adminBannerStore.listBanners());
    }

    @GetMapping(value = "/{bannerId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getBanner(
        @PathVariable("bannerId") String bannerId,
        HttpSession session
    ) {
        return runWithAdmin(session, () -> adminBannerStore.getBanner(normalizeBannerId(bannerId)));
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createBanner(
        @RequestBody(required = false) AdminBannerUpsertRequest request,
        HttpSession session
    ) {
        return runWithAdmin(session, () -> adminBannerStore.createBanner(request));
    }

    @PutMapping(value = "/{bannerId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateBanner(
        @PathVariable("bannerId") String bannerId,
        @RequestBody(required = false) AdminBannerUpsertRequest request,
        HttpSession session
    ) {
        return runWithAdmin(session, () -> adminBannerStore.updateBanner(normalizeBannerId(bannerId), request));
    }

    @PutMapping(value = "/{bannerId}/active", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> toggleBannerActive(
        @PathVariable("bannerId") String bannerId,
        @RequestBody(required = false) AdminBannerActiveRequest request,
        HttpSession session
    ) {
        return runWithAdmin(session, () -> adminBannerStore.toggleBannerActive(normalizeBannerId(bannerId), request));
    }

    @DeleteMapping(value = "/{bannerId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> deleteBanner(
        @PathVariable("bannerId") String bannerId,
        HttpSession session
    ) {
        return runWithAdmin(session, () -> adminBannerStore.deleteBanner(normalizeBannerId(bannerId)));
    }

    @PutMapping(value = "/reorder", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> reorderBanners(
        @RequestBody(required = false) AdminBannerReorderRequest request,
        HttpSession session
    ) {
        return runWithAdmin(session, () -> adminBannerStore.reorderBanners(request));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleUnreadableJson(HttpMessageNotReadableException exception) {
        return json(HttpStatus.BAD_REQUEST, false, "요청 JSON이 올바르지 않습니다.");
    }

    private ResponseEntity<?> runWithAdmin(HttpSession session, ThrowingSupplier<Object> supplier) {
        ResponseEntity<?> denied = requireAdmin(session);
        if (denied != null) {
            return denied;
        }

        try {
            return ok(supplier.get());
        } catch (IllegalArgumentException exception) {
            return json(HttpStatus.BAD_REQUEST, false, exception.getMessage());
        } catch (NoSuchElementException exception) {
            return json(HttpStatus.NOT_FOUND, false, exception.getMessage());
        } catch (RuntimeException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Admin banner service unavailable");
        }
    }

    private ResponseEntity<?> requireAdmin(HttpSession session) {
        Object sessionUser = session.getAttribute("user");
        if (!(sessionUser instanceof SessionUser user)) {
            return json(HttpStatus.UNAUTHORIZED, false, "로그인이 필요합니다.");
        }

        if (!isAdmin(user)) {
            return json(HttpStatus.FORBIDDEN, false, "권한이 없습니다.");
        }

        return null;
    }

    private boolean isAdmin(SessionUser user) {
        return user.role() != null && user.role().equalsIgnoreCase("ADMIN");
    }

    private String normalizeBannerId(String rawValue) {
        if (!StringUtils.hasText(rawValue)) {
            throw new IllegalArgumentException("bannerId is required");
        }

        return rawValue.trim();
    }

    private ResponseEntity<Map<String, Object>> ok(Object data) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", true);
        body.put("data", data);
        return ResponseEntity.ok(body);
    }

    private ResponseEntity<Map<String, Object>> json(HttpStatus status, boolean success, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", success);
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }

    @FunctionalInterface
    private interface ThrowingSupplier<T> {
        T get();
    }
}

class AdminBannerStore {
    private static final List<String> ALLOWED_FAMILIES = List.of(
        "promo_card_family",
        "inline_cta_banner_family",
        "hero_image_set"
    );
    private static final Set<String> ALLOWED_SITES = Set.of("air", "stay", "integrated");
    private static final Set<String> ALLOWED_ICON_KEYS = Set.of(
        "plane",
        "coins",
        "car",
        "crown",
        "camera",
        "wine",
        "luggage",
        "map",
        "flower-2"
    );
    private static final Comparator<AdminBannerRecord> BANNER_ORDER = Comparator
        .comparingInt(AdminBannerRecord::sortOrder)
        .thenComparing(AdminBannerRecord::bannerId);

    private final LinkedHashMap<String, AdminBannerRecord> banners = new LinkedHashMap<>();

    AdminBannerStore() {
        seed();
    }

    synchronized Map<String, Object> listBanners() {
        List<Map<String, Object>> items = banners.values().stream()
            .sorted(BANNER_ORDER)
            .map(this::toResponse)
            .toList();

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("items", items);
        payload.put("count", items.size());
        return payload;
    }

    synchronized Map<String, Object> getBanner(String bannerId) {
        return toResponse(requireBanner(bannerId));
    }

    synchronized Map<String, Object> createBanner(AdminBannerUpsertRequest request) {
        AdminBannerUpsertRequest safeRequest = requireRequest(request);
        String bannerId = normalizeBannerId(safeRequest.slotKey());
        if (banners.containsKey(bannerId)) {
            throw new IllegalArgumentException("bannerId already exists");
        }

        AdminBannerRecord record = buildRecord(
            bannerId,
            safeRequest,
            resolveSortOrder(safeRequest.sortOrder(), nextSortOrder()),
            normalizeActive(safeRequest.active()),
            bannerId
        );
        banners.put(bannerId, record);
        return toResponse(record);
    }

    synchronized Map<String, Object> updateBanner(String bannerId, AdminBannerUpsertRequest request) {
        AdminBannerRecord current = requireBanner(bannerId);
        AdminBannerUpsertRequest safeRequest = requireRequest(request);
        String requestedSlotKey = normalizeOptionalBannerId(safeRequest.slotKey());
        if (StringUtils.hasText(requestedSlotKey) && !requestedSlotKey.equals(bannerId)) {
            throw new IllegalArgumentException("slotKey cannot change for an existing banner");
        }

        String updatedBannerId = bannerId;
        AdminBannerRecord updated = buildRecord(
            updatedBannerId,
            safeRequest,
            resolveSortOrder(safeRequest.sortOrder(), current.sortOrder()),
            normalizeActive(safeRequest.active(), current.active()),
            current.title()
        );

        banners.put(updatedBannerId, updated);
        return toResponse(updated);
    }

    synchronized Map<String, Object> deleteBanner(String bannerId) {
        AdminBannerRecord removed = banners.remove(bannerId);
        if (removed == null) {
            throw new NoSuchElementException("Banner not found");
        }

        return toResponse(removed);
    }

    synchronized Map<String, Object> toggleBannerActive(String bannerId, AdminBannerActiveRequest request) {
        AdminBannerRecord current = requireBanner(bannerId);
        boolean active = request == null || request.active() == null ? !current.active() : request.active();
        AdminBannerRecord updated = new AdminBannerRecord(
            current.bannerId(),
            current.site(),
            current.family(),
            current.slotKey(),
            current.eyebrow(),
            current.title(),
            current.body(),
            current.ctaLabel(),
            current.ctaHref(),
            current.imageUrl(),
            current.altText(),
            current.iconKey(),
            current.sortOrder(),
            active
        );
        banners.put(bannerId, updated);
        return toResponse(updated);
    }

    synchronized Map<String, Object> reorderBanners(AdminBannerReorderRequest request) {
        AdminBannerReorderRequest safeRequest = requireRequest(request);
        List<String> bannerIds = normalizeBannerOrder(safeRequest.bannerIds());
        if (bannerIds.size() != banners.size()) {
            throw new IllegalArgumentException("bannerIds must include every banner exactly once");
        }

        LinkedHashSet<String> uniqueIds = new LinkedHashSet<>(bannerIds);
        if (uniqueIds.size() != bannerIds.size()) {
            throw new IllegalArgumentException("bannerIds must not contain duplicates");
        }

        LinkedHashMap<String, AdminBannerRecord> reordered = new LinkedHashMap<>();
        int sortOrder = 10;
        for (String bannerId : bannerIds) {
            AdminBannerRecord current = requireBanner(bannerId);
            reordered.put(bannerId, current.withSortOrder(sortOrder));
            sortOrder += 10;
        }

        banners.clear();
        banners.putAll(reordered);
        return listBanners();
    }

    private void seed() {
        if (!banners.isEmpty()) {
            return;
        }

        List<AdminBannerSeed> seeds = List.of(
            new AdminBannerSeed("stay_hotel_promo_main", "stay", "promo_card_family", "stay_hotel_promo_main", "JEJU UNIVERSE", "Jeju Hotel Main Promotion", "A main card for checking hotel reservations together with flights.", "View Details", "#", "", "", "plane", 10, true),
            new AdminBannerSeed("stay_hotel_promo_sub_1", "stay", "promo_card_family", "stay_hotel_promo_sub_1", "REFRESH POINT", "Refresh Check-in", "A refresh card for the hotel check-in flow.", "Check Refresh", "#", "", "", "coins", 20, true),
            new AdminBannerSeed("stay_hotel_promo_sub_2", "stay", "promo_card_family", "stay_hotel_promo_sub_2", "PACKAGE DEAL", "Flight + Hotel Package", "A package discount card that bundles flights and stays.", "View Package", "#", "", "", "car", 30, true),
            new AdminBannerSeed("stay_private_promo_main", "stay", "promo_card_family", "stay_private_promo_main", "PREMIUM CHECK-IN", "Private Stay Main Promotion", "A main card that highlights premium check-in and member benefits.", "View Product", "#", "", "", "crown", 40, true),
            new AdminBannerSeed("stay_private_promo_sub_1", "stay", "promo_card_family", "stay_private_promo_sub_1", "SNAP PHOTO", "Private Stay Photo Guide", "A sub card that shows room photos and rental guidelines.", "View Photos", "#", "", "", "camera", 50, true),
            new AdminBannerSeed("stay_private_promo_sub_2", "stay", "promo_card_family", "stay_private_promo_sub_2", "DINING", "Dining and Lounge", "A sub card that highlights dining and lounge experiences.", "View Menu", "#", "", "", "wine", 60, true),
            new AdminBannerSeed("stay_life_synergy_banner", "stay", "inline_cta_banner_family", "stay_life_synergy_banner", "SYNERGY", "Jeju Air + Jeju Stay Synergy Banner", "A CTA banner that links flight and stay benefits together.", "View Synergy", "#", "", "", "luggage", 70, true),
            new AdminBannerSeed("stay_life_promo_1", "stay", "promo_card_family", "stay_life_promo_1", "LUGGAGE", "Luggage Storage Service", "A luggage add-on card connected to arrival flow.", "View Service", "#", "", "", "map", 80, true),
            new AdminBannerSeed("stay_life_promo_2", "stay", "promo_card_family", "stay_life_promo_2", "MEMBER CARD", "Royal Member Card", "A member benefit card for cafes, rental cars, and more.", "View Card", "#", "", "", "flower-2", 90, true),
            new AdminBannerSeed("stay_life_promo_3", "stay", "promo_card_family", "stay_life_promo_3", "GUIDE", "Travel Guide Promotion", "A guide card for resort and booking content.", "View Guide", "#", "", "", "plane", 100, true),
            new AdminBannerSeed("stay_activities_auth_banner", "stay", "inline_cta_banner_family", "stay_activities_auth_banner", "AUTH BANNER", "Activities Authentication Banner", "An inline CTA banner that connects to authenticated activity flows.", "Authenticate", "#", "", "", "coins", 110, true),
            new AdminBannerSeed("air_home_hero_1", "air", "hero_image_set", "air_home_hero_1", "AIR HERO", "Jeju Air Hero 1", "Jeju Air main page hero slide 1.", "", "", "/jejuair/assets/img/main/slide1.png", "Jeju Air main page slide 1", "", 120, true),
            new AdminBannerSeed("air_home_hero_2", "air", "hero_image_set", "air_home_hero_2", "AIR HERO", "Jeju Air Hero 2", "Jeju Air main page hero slide 2.", "", "", "/jejuair/assets/img/main/slide2.png", "Jeju Air main page slide 2", "", 130, true),
            new AdminBannerSeed("air_home_hero_3", "air", "hero_image_set", "air_home_hero_3", "AIR HERO", "Jeju Air Hero 3", "Jeju Air main page hero slide 3.", "", "", "/jejuair/assets/img/main/slide3.png", "Jeju Air main page slide 3", "", 140, true)
        );

        for (AdminBannerSeed seed : seeds) {
            AdminBannerRecord record = new AdminBannerRecord(
                seed.bannerId(),
                normalizeSite(seed.site()),
                normalizeFamily(seed.family()),
                normalizeBannerId(seed.slotKey()),
                normalizeText(seed.eyebrow()),
                normalizeText(seed.title()),
                normalizeText(seed.body()),
                normalizeText(seed.ctaLabel()),
                normalizeText(seed.ctaHref()),
                normalizeText(seed.imageUrl()),
                normalizeText(seed.altText()),
                seed.iconKey(),
                seed.sortOrder(),
                seed.active()
            );
            banners.put(record.bannerId(), record);
        }
    }

    private AdminBannerRecord requireBanner(String bannerId) {
        AdminBannerRecord record = banners.get(bannerId);
        if (record == null) {
            throw new NoSuchElementException("Banner not found");
        }
        return record;
    }

    private AdminBannerUpsertRequest requireRequest(AdminBannerUpsertRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request body is required");
        }
        return request;
    }

    private AdminBannerReorderRequest requireRequest(AdminBannerReorderRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request body is required");
        }
        return request;
    }

    private String normalizeBannerId(String rawValue) {
        if (!StringUtils.hasText(rawValue)) {
            throw new IllegalArgumentException("slotKey is required");
        }
        return rawValue.trim();
    }

    private String normalizeOptionalBannerId(String rawValue) {
        return StringUtils.hasText(rawValue) ? rawValue.trim() : "";
    }

    private String normalizeFamily(String rawValue) {
        String value = normalizeText(rawValue).toLowerCase(Locale.ROOT);
        if (!StringUtils.hasText(value)) {
            throw new IllegalArgumentException("family is required");
        }
        if (!ALLOWED_FAMILIES.contains(value)) {
            throw new IllegalArgumentException("family must be one of promo_card_family, inline_cta_banner_family, hero_image_set");
        }
        return value;
    }

    private String normalizeSite(String rawValue) {
        String value = normalizeText(rawValue).toLowerCase(Locale.ROOT);
        if (!StringUtils.hasText(value)) {
            throw new IllegalArgumentException("site is required");
        }
        if (!ALLOWED_SITES.contains(value)) {
            throw new IllegalArgumentException("site must be one of air, stay, integrated");
        }
        return value;
    }

    private String resolveIconKey(String family, String rawValue) {
        if ("hero_image_set".equals(family)) {
            return "";
        }

        return normalizeIconKey(rawValue);
    }

    private String normalizeIconKey(String rawValue) {
        String value = normalizeText(rawValue).toLowerCase(Locale.ROOT);
        if (!StringUtils.hasText(value)) {
            return "";
        }
        if (!ALLOWED_ICON_KEYS.contains(value)) {
            throw new IllegalArgumentException("iconKey must be one of plane, coins, car, crown, camera, wine, luggage, map, flower-2");
        }
        return value;
    }

    private String normalizeText(String rawValue) {
        return rawValue == null ? "" : rawValue.trim();
    }

    private boolean normalizeActive(Boolean rawValue) {
        return rawValue == null || rawValue;
    }

    private boolean normalizeActive(Boolean rawValue, boolean fallback) {
        return rawValue == null ? fallback : rawValue;
    }

    private int resolveSortOrder(Integer requestedSortOrder, int fallbackSortOrder) {
        if (requestedSortOrder == null) {
            return fallbackSortOrder;
        }
        if (requestedSortOrder <= 0) {
            throw new IllegalArgumentException("sortOrder must be a positive number");
        }
        return requestedSortOrder;
    }

    private int nextSortOrder() {
        return banners.values().stream()
            .mapToInt(AdminBannerRecord::sortOrder)
            .max()
            .orElse(0) + 10;
    }

    private List<String> normalizeBannerOrder(List<String> rawBannerIds) {
        if (rawBannerIds == null || rawBannerIds.isEmpty()) {
            throw new IllegalArgumentException("bannerIds is required");
        }

        List<String> bannerIds = new ArrayList<>();
        for (String rawBannerId : rawBannerIds) {
            bannerIds.add(normalizeBannerId(rawBannerId));
        }
        return bannerIds;
    }

    private Map<String, Object> toResponse(AdminBannerRecord record) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("bannerId", record.bannerId());
        body.put("id", record.bannerId());
        body.put("slotKey", record.slotKey());
        body.put("family", record.family());
        body.put("site", record.site());
        body.put("serviceType", record.site());
        body.put("eyebrow", record.eyebrow());
        body.put("title", record.title());
        body.put("body", record.body());
        body.put("ctaLabel", record.ctaLabel());
        body.put("ctaHref", record.ctaHref());
        body.put("imageUrl", record.imageUrl());
        body.put("altText", record.altText());
        body.put("iconKey", record.iconKey());
        body.put("sortOrder", record.sortOrder());
        body.put("active", record.active());
        return body;
    }

    private AdminBannerRecord buildRecord(
        String bannerId,
        AdminBannerUpsertRequest request,
        int sortOrder,
        boolean active,
        String fallbackTitle
    ) {
        String slotKey = StringUtils.hasText(request.slotKey()) ? normalizeBannerId(request.slotKey()) : bannerId;
        if (!bannerId.equals(slotKey)) {
            throw new IllegalArgumentException("slotKey must match bannerId");
        }

        String family = normalizeFamily(request.family());
        String title = resolveTitle(family, request.title(), request.altText(), fallbackTitle, slotKey);
        String iconKey = resolveIconKey(family, request.iconKey());

        return new AdminBannerRecord(
            bannerId,
            normalizeSite(firstText(request.site(), request.service(), request.serviceType())),
            family,
            slotKey,
            normalizeText(request.eyebrow()),
            title,
            normalizeText(request.body()),
            normalizeText(request.ctaLabel()),
            normalizeText(request.ctaHref()),
            normalizeText(request.imageUrl()),
            normalizeText(request.altText()),
            iconKey,
            sortOrder,
            active
        );
    }

    private String resolveTitle(
        String family,
        String rawTitle,
        String altText,
        String fallbackTitle,
        String slotKey
    ) {
        if ("hero_image_set".equals(family)) {
            return firstText(rawTitle, altText, fallbackTitle, slotKey);
        }

        return requireText(rawTitle, "title is required");
    }

    private String firstText(String... values) {
        for (String value : values) {
            if (StringUtils.hasText(value)) {
                return value.trim();
            }
        }
        return "";
    }

    private String requireText(String value, String message) {
        String normalized = normalizeText(value);
        if (!StringUtils.hasText(normalized)) {
            throw new IllegalArgumentException(message);
        }
        return normalized;
    }
}

record AdminBannerUpsertRequest(
    String slotKey,
    String family,
    String site,
    String service,
    String serviceType,
    String eyebrow,
    String title,
    String body,
    String ctaLabel,
    String ctaHref,
    String imageUrl,
    String altText,
    String iconKey,
    Integer sortOrder,
    Boolean active
) {
}

record AdminBannerReorderRequest(
    List<String> bannerIds
) {
}

record AdminBannerActiveRequest(
    Boolean active
) {
}

record AdminBannerSeed(
    String bannerId,
    String site,
    String family,
    String slotKey,
    String eyebrow,
    String title,
    String body,
    String ctaLabel,
    String ctaHref,
    String imageUrl,
    String altText,
    String iconKey,
    int sortOrder,
    boolean active
) {
}

record AdminBannerRecord(
    String bannerId,
    String site,
    String family,
    String slotKey,
    String eyebrow,
    String title,
    String body,
    String ctaLabel,
    String ctaHref,
    String imageUrl,
    String altText,
    String iconKey,
    int sortOrder,
    boolean active
) {
    AdminBannerRecord withSortOrder(int nextSortOrder) {
        return new AdminBannerRecord(
            bannerId,
            site,
            family,
            slotKey,
            eyebrow,
            title,
            body,
            ctaLabel,
            ctaHref,
            imageUrl,
            altText,
            iconKey,
            nextSortOrder,
            active
        );
    }
}
