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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping(value = "/{bannerId}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> uploadBannerImage(
        @PathVariable("bannerId") String bannerId,
        @RequestPart("image") MultipartFile image,
        HttpSession session
    ) {
        return runWithAdminRaw(session, () -> Map.of(
            "imageUrl",
            adminBannerStore.uploadBannerImage(normalizeBannerId(bannerId), image)
        ));
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

    private ResponseEntity<?> runWithAdminRaw(HttpSession session, ThrowingSupplier<Object> supplier) {
        ResponseEntity<?> denied = requireAdmin(session);
        if (denied != null) {
            return denied;
        }

        try {
            return ResponseEntity.ok(supplier.get());
        } catch (IllegalArgumentException exception) {
            return json(HttpStatus.BAD_REQUEST, false, exception.getMessage());
        } catch (NoSuchElementException exception) {
            return json(HttpStatus.NOT_FOUND, false, exception.getMessage());
        } catch (RuntimeException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Admin banner service unavailable");
        }
    }

    @FunctionalInterface
    private interface ThrowingSupplier<T> {
        T get();
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
