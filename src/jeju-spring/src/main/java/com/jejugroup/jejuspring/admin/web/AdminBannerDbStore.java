package com.jejugroup.jejuspring.admin.web;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Set;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.jejugroup.jejuspring.banner.application.BannerAssetService;
import com.jejugroup.jejuspring.config.AppProperties;

@Service
public class AdminBannerDbStore {
    private static final List<AdminBannerSeed> MANAGED_BANNER_SEEDS = List.of(
        new AdminBannerSeed("stay_hotel_promo_main", "stay", "promo_card_family", "stay_hotel_promo_main", "JEJU UNIVERSE", "제주항공 탑승객 인증 시 전 세계 호텔 7% 추가 할인", "제주항공 예약 확인서를 업로드하고 특별 할인을 받으세요", "자세히 보기", "#", "", "", "plane", 10, true),
        new AdminBannerSeed("stay_hotel_promo_sub_1", "stay", "promo_card_family", "stay_hotel_promo_sub_1", "REFRESH POINT", "리프레시 포인트로 호텔 결제 가능", "", "포인트 사용하기", "#", "", "", "coins", 20, true),
        new AdminBannerSeed("stay_hotel_promo_sub_2", "stay", "promo_card_family", "stay_hotel_promo_sub_2", "PACKAGE DEAL", "숙소 + 렌터카 패키지 최대 15% 할인", "", "패키지 보기", "#", "", "", "car", 30, true),
        new AdminBannerSeed("stay_private_promo_main", "stay", "promo_card_family", "stay_private_promo_main", "PREMIUM CHECK-IN", "프라이빗 스테이 예약 시 얼리 체크인 & 웰컴 키트 제공", "제주 유니버스 회원을 위한 특별한 시작", "혜택 확인하기", "#", "", "", "crown", 40, true),
        new AdminBannerSeed("stay_private_promo_sub_1", "stay", "promo_card_family", "stay_private_promo_sub_1", "SNAP PHOTO", "인생샷 포인트 스냅 촬영 할인", "", "작가 보기", "#", "", "", "camera", 50, true),
        new AdminBannerSeed("stay_private_promo_sub_2", "stay", "promo_card_family", "stay_private_promo_sub_2", "DINING", "인룸 다이닝 와인 & 플래터", "", "메뉴 보기", "#", "", "", "wine", 60, true),
        new AdminBannerSeed("stay_life_synergy_banner", "stay", "inline_cta_banner_family", "stay_life_synergy_banner", "", "전 세계 어디든 제주항공 X 모빌리티 혜택", "항공권 결합 시 리프레시 포인트 2배 적립 + 해외 렌터카 50% 할인!", "제주 유니버스 혜택 보기", "#", "", "", "plane", 70, true),
        new AdminBannerSeed("stay_life_promo_1", "stay", "promo_card_family", "stay_life_promo_1", "", "위탁 수하물 10kg 추가 증정", "짐이 많은 장기 여행도 걱정 없이, 제주항공 이용 시 혜택 제공", "", "#", "", "", "luggage", 80, true),
        new AdminBannerSeed("stay_life_promo_2", "stay", "promo_card_family", "stay_life_promo_2", "", "로컬 라이프 멤버십 카드", "현지인 맛집, 카페, 렌터카까지 최대 20% 제휴 할인", "", "#", "", "", "map", 90, true),
        new AdminBannerSeed("stay_life_promo_3", "stay", "promo_card_family", "stay_life_promo_3", "", "한 달 살기 가이드북 제공", "쓰레기 배출일부터 근처 인프라 정보까지 생활 필수 정보 수록", "", "#", "", "", "flower-2", 100, true),
        new AdminBannerSeed("stay_activities_auth_banner", "stay", "inline_cta_banner_family", "stay_activities_auth_banner", "", "제주항공 탑승객 인증", "항공권번호를 인증하고 최대 50% 추가 할인 혜택을 받으세요.", "인증하고 혜택받기", "#", "", "", "plane", 110, true),
        new AdminBannerSeed("air_home_hero_1", "air", "hero_image_set", "air_home_hero_1", "AIR HERO", "Jeju Air Hero 1", "Jeju Air main page hero slide 1.", "", "", "/api/banners/assets/air_home_hero_1/slide1.png", "Jeju Air main page slide 1", "", 120, true),
        new AdminBannerSeed("air_home_hero_2", "air", "hero_image_set", "air_home_hero_2", "AIR HERO", "Jeju Air Hero 2", "Jeju Air main page hero slide 2.", "", "", "/api/banners/assets/air_home_hero_2/slide2.png", "Jeju Air main page slide 2", "", 130, true),
        new AdminBannerSeed("air_home_hero_3", "air", "hero_image_set", "air_home_hero_3", "AIR HERO", "Jeju Air Hero 3", "Jeju Air main page hero slide 3.", "", "", "/api/banners/assets/air_home_hero_3/slide3.png", "Jeju Air main page slide 3", "", 140, true)
    );
    private static final List<String> MANAGED_BANNER_IDS = MANAGED_BANNER_SEEDS.stream()
        .map(AdminBannerSeed::bannerId)
        .toList();
    private static final Map<String, ManagedBannerTemplate> MANAGED_BANNER_TEMPLATES = buildManagedBannerTemplates();
    private static final Set<String> ALLOWED_FAMILIES = Set.of(
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

    private final AppProperties appProperties;
    private final BannerAssetService bannerAssetService;
    private boolean bootstrapped;

    public AdminBannerDbStore(AppProperties appProperties, BannerAssetService bannerAssetService) {
        this.appProperties = appProperties;
        this.bannerAssetService = bannerAssetService;
    }

    @PostConstruct
    public void initializeManagedBanners() {
        ensureBootstrapped();
    }

    public synchronized Map<String, Object> listBanners() {
        ensureBootstrapped();
        List<Map<String, Object>> items = loadManagedBanners().stream()
            .sorted(BANNER_ORDER)
            .map(this::toResponse)
            .toList();

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("items", items);
        payload.put("count", items.size());
        return payload;
    }

    public synchronized Map<String, Object> listPublicBanners() {
        ensureBootstrapped();
        List<Map<String, Object>> items = loadManagedBanners().stream()
            .filter(AdminBannerRecord::active)
            .sorted(BANNER_ORDER)
            .map(this::toResponse)
            .toList();

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("items", items);
        payload.put("count", items.size());
        return payload;
    }

    synchronized Map<String, Object> getBanner(String bannerId) {
        ensureBootstrapped();
        return toResponse(requireManagedBanner(bannerId));
    }

    synchronized Map<String, Object> createBanner(AdminBannerUpsertRequest request) {
        ensureBootstrapped();
        AdminBannerUpsertRequest safeRequest = requireRequest(request);
        String bannerId = normalizeBannerId(safeRequest.slotKey());
        ensureManagedBannerId(bannerId);

        if (findManagedBanner(bannerId) != null) {
            throw new IllegalArgumentException("bannerId already exists");
        }

        AdminBannerRecord record = buildRecord(
            bannerId,
            safeRequest,
            resolveSortOrder(safeRequest.sortOrder(), nextSortOrder()),
            normalizeActive(safeRequest.active())
        );
        persistBanner(record);
        return toResponse(record);
    }

    synchronized Map<String, Object> updateBanner(String bannerId, AdminBannerUpsertRequest request) {
        ensureBootstrapped();
        AdminBannerRecord current = requireManagedBanner(bannerId);
        AdminBannerUpsertRequest safeRequest = requireRequest(request);
        String requestedSlotKey = normalizeOptionalBannerId(safeRequest.slotKey());
        if (StringUtils.hasText(requestedSlotKey) && !requestedSlotKey.equals(bannerId)) {
            throw new IllegalArgumentException("slotKey cannot change for an existing banner");
        }

        AdminBannerRecord updated = buildRecord(
            bannerId,
            safeRequest,
            resolveSortOrder(safeRequest.sortOrder(), current.sortOrder()),
            normalizeActive(safeRequest.active(), current.active())
        );
        persistBanner(updated);
        return toResponse(updated);
    }

    synchronized String uploadBannerImage(String bannerId, MultipartFile image) {
        ensureBootstrapped();
        requireManagedBanner(bannerId);
        try {
            return bannerAssetService.storeBannerImage(bannerId, image);
        } catch (IOException exception) {
            throw new IllegalStateException("Admin banner service unavailable", exception);
        }
    }

    synchronized Map<String, Object> deleteBanner(String bannerId) {
        ensureBootstrapped();
        AdminBannerRecord removed = requireManagedBanner(bannerId);

        executeInTransaction(connection -> {
            deleteExposureRule(connection, bannerId);
            deleteBannerRow(connection, bannerId);
            return null;
        });

        return toResponse(removed);
    }

    synchronized Map<String, Object> toggleBannerActive(String bannerId, AdminBannerActiveRequest request) {
        ensureBootstrapped();
        AdminBannerRecord current = requireManagedBanner(bannerId);
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
        persistBanner(updated);
        return toResponse(updated);
    }

    synchronized Map<String, Object> reorderBanners(AdminBannerReorderRequest request) {
        ensureBootstrapped();
        AdminBannerReorderRequest safeRequest = requireRequest(request);
        List<String> bannerIds = normalizeBannerOrder(safeRequest.bannerIds());
        List<AdminBannerRecord> currentRecords = loadManagedBanners();
        if (bannerIds.size() != currentRecords.size()) {
            throw new IllegalArgumentException("bannerIds must include every banner exactly once");
        }

        LinkedHashSet<String> uniqueIds = new LinkedHashSet<>(bannerIds);
        if (uniqueIds.size() != bannerIds.size()) {
            throw new IllegalArgumentException("bannerIds must not contain duplicates");
        }

        Map<String, AdminBannerRecord> currentById = new LinkedHashMap<>();
        for (AdminBannerRecord record : currentRecords) {
            currentById.put(record.bannerId(), record);
        }

        executeInTransaction(connection -> {
            int sortOrder = 10;
            for (String reorderBannerId : bannerIds) {
                AdminBannerRecord current = currentById.get(reorderBannerId);
                if (current == null) {
                    throw new NoSuchElementException("Banner not found");
                }

                persistBanner(connection, current.withSortOrder(sortOrder));
                sortOrder += 10;
            }
            return null;
        });

        return listBanners();
    }

    private void ensureBootstrapped() {
        if (bootstrapped) {
            return;
        }

        synchronized (this) {
            if (bootstrapped) {
                return;
            }

            executeInTransaction(connection -> {
                if (countManagedBanners(connection) == 0L) {
                    for (AdminBannerSeed seed : MANAGED_BANNER_SEEDS) {
                        AdminBannerRecord record = new AdminBannerRecord(
                            seed.bannerId(),
                            seed.site(),
                            seed.family(),
                            seed.slotKey(),
                            seed.eyebrow(),
                            seed.title(),
                            seed.body(),
                            seed.ctaLabel(),
                            seed.ctaHref(),
                            seed.imageUrl(),
                            seed.altText(),
                            seed.iconKey(),
                            seed.sortOrder(),
                            seed.active()
                        );
                        persistBanner(connection, record);
                    }
                }
                return null;
            });

            ensureManagedHeroAssets();

            bootstrapped = true;
        }
    }

    private List<AdminBannerRecord> loadManagedBanners() {
        return executeInTransaction(connection -> {
            List<AdminBannerRecord> records = new ArrayList<>();
            String query = """
                SELECT
                    b.banner_code,
                    COALESCE(b.slot_key, b.banner_code) AS slot_key,
                    b.service_type,
                    b.family,
                    b.eyebrow,
                    b.title,
                    b.body,
                    b.cta_label,
                    b.cta_href,
                    b.image_url,
                    b.alt_text,
                    b.icon_key,
                    b.sort_order,
                    b.is_active
                FROM banners b
                WHERE b.banner_code IN (%s)
                ORDER BY b.sort_order ASC, b.banner_code ASC
                """.formatted(buildInClause(MANAGED_BANNER_IDS.size()));

            try (PreparedStatement statement = connection.prepareStatement(query)) {
                bindStrings(statement, MANAGED_BANNER_IDS);
                try (ResultSet resultSet = statement.executeQuery()) {
                    while (resultSet.next()) {
                        records.add(readRecord(resultSet));
                    }
                }
            }
            return records;
        });
    }

    private void ensureManagedHeroAssets() {
        for (AdminBannerRecord record : loadManagedBanners()) {
            if (!isManagedHeroBanner(record)) {
                continue;
            }

            String fileName = resolveManagedHeroFileName(record);
            if (!StringUtils.hasText(fileName)) {
                continue;
            }

            try {
                if (bannerAssetService.ensureStoredAsset(record.bannerId(), fileName)) {
                    String servedPath = bannerAssetService.buildServedPath(record.bannerId(), fileName);
                    if (!servedPath.equals(record.imageUrl())) {
                        persistBanner(new AdminBannerRecord(
                            record.bannerId(),
                            record.site(),
                            record.family(),
                            record.slotKey(),
                            record.eyebrow(),
                            record.title(),
                            record.body(),
                            record.ctaLabel(),
                            record.ctaHref(),
                            servedPath,
                            record.altText(),
                            record.iconKey(),
                            record.sortOrder(),
                            record.active()
                        ));
                    }
                }
            } catch (IOException ignored) {
                // 외부 파일이 없으면 자동 복구하지 않고, DB 보정도 건너뛴다.
            }
        }
    }

    private String resolveManagedHeroFileName(AdminBannerRecord record) {
        String fileName = StringUtils.getFilename(record.imageUrl());
        if (StringUtils.hasText(fileName)) {
            return fileName;
        }

        return switch (record.bannerId()) {
            case "air_home_hero_1" -> "slide1.png";
            case "air_home_hero_2" -> "slide2.png";
            case "air_home_hero_3" -> "slide3.png";
            default -> "";
        };
    }

    private AdminBannerRecord findManagedBanner(String bannerId) {
        return executeInTransaction(connection -> selectManagedBanner(connection, bannerId));
    }

    private AdminBannerRecord requireManagedBanner(String bannerId) {
        ensureManagedBannerId(bannerId);
        AdminBannerRecord record = findManagedBanner(bannerId);
        if (record == null) {
            throw new NoSuchElementException("Banner not found");
        }
        return record;
    }

    private void ensureManagedBannerId(String bannerId) {
        if (!MANAGED_BANNER_IDS.contains(bannerId)) {
            throw new IllegalArgumentException("slotKey is not managed");
        }
    }

    private boolean isManagedHeroBanner(AdminBannerRecord record) {
        return "air".equals(record.site()) && "hero_image_set".equals(record.family());
    }

    private AdminBannerRecord selectManagedBanner(Connection connection, String bannerId) throws SQLException {
        String query = """
            SELECT
                b.banner_code,
                COALESCE(b.slot_key, b.banner_code) AS slot_key,
                b.service_type,
                b.family,
                b.eyebrow,
                b.title,
                b.body,
                b.cta_label,
                b.cta_href,
                b.image_url,
                b.alt_text,
                b.icon_key,
                b.sort_order,
                b.is_active
            FROM banners b
            WHERE b.banner_code = ?
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, bannerId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return null;
                }
                return readRecord(resultSet);
            }
        }
    }

    private AdminBannerRecord readRecord(ResultSet resultSet) throws SQLException {
        String bannerId = normalizeText(resultSet.getString("banner_code"));
        String slotKey = firstText(resultSet.getString("slot_key"), bannerId);
        String site = normalizeSite(resultSet.getString("service_type"));
        String family = normalizeFamily(resultSet.getString("family"));
        String eyebrow = normalizeText(resultSet.getString("eyebrow"));
        String title = normalizeText(resultSet.getString("title"));
        String body = normalizeText(resultSet.getString("body"));
        String ctaLabel = normalizeText(resultSet.getString("cta_label"));
        String ctaHref = normalizeText(resultSet.getString("cta_href"));
        String imageUrl = normalizeText(resultSet.getString("image_url"));
        String altText = normalizeText(resultSet.getString("alt_text"));
        String iconKey = resolveIconKey(family, resultSet.getString("icon_key"));
        int sortOrder = resultSet.getInt("sort_order");
        boolean active = resultSet.getInt("is_active") != 0;
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
            sortOrder,
            active
        );
    }

    private void persistBanner(AdminBannerRecord record) {
        executeInTransaction(connection -> {
            persistBanner(connection, record);
            return null;
        });
    }

    private void persistBanner(Connection connection, AdminBannerRecord record) throws SQLException {
        validateManagedTemplate(record.slotKey(), record.site(), record.family());
        long slotId = upsertBannerSlot(connection, record);
        upsertBannerRow(connection, slotId, record);
        upsertExposureRule(connection, record);
    }

    private long upsertBannerSlot(Connection connection, AdminBannerRecord record) throws SQLException {
        String insert = """
            INSERT INTO banner_slots (
                slot_code,
                slot_name,
                placement,
                service_type,
                screen_type,
                is_active
            )
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                slot_name = VALUES(slot_name),
                placement = VALUES(placement),
                service_type = VALUES(service_type),
                screen_type = VALUES(screen_type),
                is_active = VALUES(is_active)
            """;

        try (PreparedStatement statement = connection.prepareStatement(insert)) {
            statement.setString(1, record.slotKey());
            statement.setString(2, resolveBannerSlotName(record));
            statement.setString(3, record.site());
            statement.setString(4, record.site());
            statement.setString(5, resolveScreenType(record.family()));
            statement.setInt(6, record.active() ? 1 : 0);
            statement.executeUpdate();
        }

        String query = "SELECT id FROM banner_slots WHERE slot_code = ?";
        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, record.slotKey());
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    throw new IllegalStateException("Managed banner slot not found");
                }
                return resultSet.getLong("id");
            }
        }
    }

    private void upsertBannerRow(Connection connection, long slotId, AdminBannerRecord record) throws SQLException {
        String insert = """
            INSERT INTO banners (
                banner_slot_id,
                banner_code,
                slot_key,
                service_type,
                family,
                eyebrow,
                title,
                body,
                cta_label,
                cta_href,
                image_url,
                alt_text,
                icon_key,
                subtitle,
                mobile_image_url,
                link_url,
                sort_order,
                is_active
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                banner_slot_id = VALUES(banner_slot_id),
                service_type = VALUES(service_type),
                slot_key = VALUES(slot_key),
                family = VALUES(family),
                eyebrow = VALUES(eyebrow),
                title = VALUES(title),
                body = VALUES(body),
                cta_label = VALUES(cta_label),
                cta_href = VALUES(cta_href),
                image_url = VALUES(image_url),
                alt_text = VALUES(alt_text),
                icon_key = VALUES(icon_key),
                subtitle = VALUES(subtitle),
                mobile_image_url = VALUES(mobile_image_url),
                link_url = VALUES(link_url),
                sort_order = VALUES(sort_order),
                is_active = VALUES(is_active)
            """;

        try (PreparedStatement statement = connection.prepareStatement(insert)) {
            statement.setLong(1, slotId);
            statement.setString(2, record.bannerId());
            statement.setString(3, record.slotKey());
            statement.setString(4, record.site());
            statement.setString(5, record.family());
            statement.setString(6, record.eyebrow());
            statement.setString(7, record.title());
            statement.setString(8, record.body());
            statement.setString(9, record.ctaLabel());
            statement.setString(10, record.ctaHref());
            statement.setString(11, record.imageUrl());
            statement.setString(12, record.altText());
            statement.setString(13, record.iconKey());
            statement.setString(14, resolveSubtitle(record));
            statement.setString(15, normalizeText(record.imageUrl()));
            statement.setString(16, normalizeText(record.ctaHref()));
            statement.setInt(17, record.sortOrder());
            statement.setInt(18, record.active() ? 1 : 0);
            statement.executeUpdate();
        }
    }

    private void upsertExposureRule(Connection connection, AdminBannerRecord record) throws SQLException {
        String insert = """
            INSERT INTO exposure_rules (
                rule_code,
                target_type,
                target_key,
                audience_type,
                service_type,
                device_type,
                country_code,
                start_at,
                end_at,
                priority,
                is_active
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                service_type = VALUES(service_type),
                priority = VALUES(priority),
                is_active = VALUES(is_active)
            """;

        try (PreparedStatement statement = connection.prepareStatement(insert)) {
            statement.setString(1, "banner-" + record.bannerId());
            statement.setString(2, "banner");
            statement.setString(3, record.bannerId());
            statement.setString(4, "all");
            statement.setString(5, record.site());
            statement.setString(6, "all");
            statement.setNull(7, java.sql.Types.CHAR);
            statement.setNull(8, java.sql.Types.TIMESTAMP);
            statement.setNull(9, java.sql.Types.TIMESTAMP);
            statement.setInt(10, record.sortOrder());
            statement.setInt(11, record.active() ? 1 : 0);
            statement.executeUpdate();
        }
    }

    private void deleteBannerRow(Connection connection, String bannerId) throws SQLException {
        String delete = "DELETE FROM banners WHERE banner_code = ?";
        try (PreparedStatement statement = connection.prepareStatement(delete)) {
            statement.setString(1, bannerId);
            statement.executeUpdate();
        }
    }

    private void deleteExposureRule(Connection connection, String bannerId) throws SQLException {
        String delete = "DELETE FROM exposure_rules WHERE target_type = 'banner' AND target_key = ?";
        try (PreparedStatement statement = connection.prepareStatement(delete)) {
            statement.setString(1, bannerId);
            statement.executeUpdate();
        }
    }

    private long countManagedBanners(Connection connection) throws SQLException {
        String query = "SELECT COUNT(*) FROM banners WHERE banner_code IN (%s)".formatted(buildInClause(MANAGED_BANNER_IDS.size()));
        try (PreparedStatement statement = connection.prepareStatement(query)) {
            bindStrings(statement, MANAGED_BANNER_IDS);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return 0L;
                }
                return resultSet.getLong(1);
            }
        }
    }

    private int nextSortOrder() {
        return executeInTransaction(connection -> {
            String query = "SELECT COALESCE(MAX(sort_order), 0) + 10 FROM banners WHERE banner_code IN (%s)".formatted(buildInClause(MANAGED_BANNER_IDS.size()));
            try (PreparedStatement statement = connection.prepareStatement(query)) {
                bindStrings(statement, MANAGED_BANNER_IDS);
                try (ResultSet resultSet = statement.executeQuery()) {
                    if (!resultSet.next()) {
                        return 10;
                    }
                    return resultSet.getInt(1);
                }
            }
        });
    }

    private Map<String, Object> toResponse(AdminBannerRecord record) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("bannerId", record.bannerId());
        body.put("id", record.bannerId());
        body.put("slotKey", record.slotKey());
        body.put("family", record.family());
        body.put("site", record.site());
        body.put("service", record.site());
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
        boolean active
    ) {
        String slotKey = StringUtils.hasText(request.slotKey()) ? normalizeBannerId(request.slotKey()) : bannerId;
        if (!bannerId.equals(slotKey)) {
            throw new IllegalArgumentException("slotKey must match bannerId");
        }

        ManagedBannerTemplate template = requireManagedTemplate(slotKey);
        String family = normalizeFamily(request.family());
        String site = normalizeSite(firstText(request.site(), request.service(), request.serviceType()));
        if (!template.site().equals(site)) {
            throw new IllegalArgumentException("slotKey site does not match managed template");
        }
        if (!template.family().equals(family)) {
            throw new IllegalArgumentException("slotKey family does not match managed template");
        }
        String title = resolveTitle(family, request.title(), request.altText(), bannerId);
        String iconKey = resolveIconKey(family, request.iconKey());
        String imageUrl = normalizeHeroImageUrl(bannerId, family, request.imageUrl());

        return new AdminBannerRecord(
            bannerId,
            site,
            family,
            slotKey,
            normalizeText(request.eyebrow()),
            title,
            normalizeText(request.body()),
            normalizeText(request.ctaLabel()),
            normalizeText(request.ctaHref()),
            imageUrl,
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
        String bannerId
    ) {
        if ("hero_image_set".equals(family)) {
            return firstText(rawTitle, altText, bannerId);
        }

        return requireText(rawTitle, "title is required");
    }

    private String normalizeHeroImageUrl(String bannerId, String family, String rawValue) {
        if (!"hero_image_set".equals(family)) {
            return normalizeText(rawValue);
        }

        String imageUrl = normalizeText(rawValue);
        String expectedPrefix = "/api/banners/assets/" + bannerId + "/";
        if (!StringUtils.hasText(imageUrl) || !imageUrl.startsWith(expectedPrefix)) {
            throw new IllegalArgumentException("hero imageUrl must use the served banner asset path");
        }

        return imageUrl;
    }

    private String resolveSubtitle(AdminBannerRecord record) {
        return firstText(record.body(), record.eyebrow(), record.ctaLabel(), record.slotKey());
    }

    private String resolveScreenType(String family) {
        return "hero_image_set".equals(family) ? "desktop" : "desktop";
    }

    private String resolveBannerSlotName(AdminBannerRecord record) {
        if ("hero_image_set".equals(record.family())) {
            return firstText(record.title(), record.altText(), record.slotKey());
        }
        return firstText(record.title(), record.slotKey());
    }

    private ManagedBannerTemplate requireManagedTemplate(String slotKey) {
        ManagedBannerTemplate template = MANAGED_BANNER_TEMPLATES.get(slotKey);
        if (template == null) {
            throw new IllegalArgumentException("slotKey is not managed");
        }
        return template;
    }

    private void validateManagedTemplate(String slotKey, String site, String family) {
        ManagedBannerTemplate template = requireManagedTemplate(slotKey);
        if (!template.site().equals(site)) {
            throw new IllegalArgumentException("slotKey site does not match managed template");
        }
        if (!template.family().equals(family)) {
            throw new IllegalArgumentException("slotKey family does not match managed template");
        }
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

    private List<String> normalizeBannerOrder(List<String> rawBannerIds) {
        if (rawBannerIds == null || rawBannerIds.isEmpty()) {
            throw new IllegalArgumentException("bannerIds is required");
        }

        List<String> bannerIds = new ArrayList<>();
        for (String rawBannerId : rawBannerIds) {
            String bannerId = normalizeBannerId(rawBannerId);
            ensureManagedBannerId(bannerId);
            bannerIds.add(bannerId);
        }
        return bannerIds;
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

    private String buildInClause(int size) {
        StringBuilder builder = new StringBuilder();
        for (int index = 0; index < size; index++) {
            if (index > 0) {
                builder.append(", ");
            }
            builder.append("?");
        }
        return builder.toString();
    }

    private static Map<String, ManagedBannerTemplate> buildManagedBannerTemplates() {
        Map<String, ManagedBannerTemplate> templates = new LinkedHashMap<>();
        for (AdminBannerSeed seed : MANAGED_BANNER_SEEDS) {
            templates.put(seed.bannerId(), new ManagedBannerTemplate(seed.bannerId(), seed.site(), seed.family()));
        }
        return templates;
    }

    private void bindStrings(PreparedStatement statement, List<String> values) throws SQLException {
        for (int index = 0; index < values.size(); index++) {
            statement.setString(index + 1, values.get(index));
        }
    }

    private Connection openConnection() throws SQLException {
        String url = normalize(appProperties.database().dbUrl());
        String user = normalize(appProperties.database().dbUser());
        String password = normalize(appProperties.database().dbPassword());

        if (!StringUtils.hasText(url) || !StringUtils.hasText(user) || !StringUtils.hasText(password)) {
            throw new SQLException("admin DB configuration is missing");
        }

        return DriverManager.getConnection(url, user, password);
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }

    private <T> T executeInTransaction(SqlFunction<Connection, T> function) {
        try (Connection connection = openConnection()) {
            boolean previousAutoCommit = connection.getAutoCommit();
            connection.setAutoCommit(false);
            try {
                T result = function.apply(connection);
                connection.commit();
                return result;
            } catch (SQLException exception) {
                connection.rollback();
                throw new IllegalStateException("Admin banner service unavailable", exception);
            } catch (RuntimeException exception) {
                connection.rollback();
                throw exception;
            } finally {
                connection.setAutoCommit(previousAutoCommit);
            }
        } catch (SQLException exception) {
            throw new IllegalStateException("Admin banner service unavailable", exception);
        }
    }

    @FunctionalInterface
    private interface SqlFunction<T, R> {
        R apply(T value) throws SQLException;
    }

    private record ManagedBannerTemplate(String slotKey, String site, String family) {
    }
}
