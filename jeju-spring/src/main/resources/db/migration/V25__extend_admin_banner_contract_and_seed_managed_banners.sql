-- V25 admin CMS banner schema extension and managed banner seeds
-- repeat-safe, source-aligned with front/admin/data/cms-config.js

ALTER TABLE banner_slots
    ADD COLUMN service_type VARCHAR(30) NOT NULL DEFAULT 'common' AFTER placement;

ALTER TABLE banner_slots
    ADD KEY idx_banner_slots_service_active (service_type, is_active);

ALTER TABLE banners
    ADD COLUMN slot_key VARCHAR(80) NOT NULL DEFAULT '' AFTER banner_slot_id;

ALTER TABLE banners
    ADD COLUMN family VARCHAR(80) NOT NULL DEFAULT 'legacy' AFTER slot_key;

ALTER TABLE banners
    ADD COLUMN service_type VARCHAR(30) NOT NULL DEFAULT 'common' AFTER family;

ALTER TABLE banners
    ADD COLUMN eyebrow VARCHAR(200) NULL AFTER subtitle;

ALTER TABLE banners
    ADD COLUMN body LONGTEXT NULL AFTER eyebrow;

ALTER TABLE banners
    ADD COLUMN cta_label VARCHAR(200) NULL AFTER link_url;

ALTER TABLE banners
    ADD COLUMN cta_href VARCHAR(500) NULL AFTER cta_label;

ALTER TABLE banners
    ADD COLUMN alt_text VARCHAR(500) NULL AFTER cta_href;

ALTER TABLE banners
    ADD KEY idx_banners_slot_key (slot_key);

ALTER TABLE banners
    ADD KEY idx_banners_family_service_sort (family, service_type, is_active, sort_order);

ALTER TABLE banners
    ADD KEY idx_banners_service_sort (service_type, is_active, sort_order);

UPDATE banner_slots s
JOIN exposure_rules r
  ON r.target_type = 'banner'
 AND r.target_key = s.slot_code
SET s.service_type = r.service_type
WHERE s.service_type = 'common';

UPDATE banners b
JOIN banner_slots s ON s.id = b.banner_slot_id
SET b.slot_key = COALESCE(NULLIF(b.slot_key, ''), s.slot_code),
    b.family = COALESCE(NULLIF(b.family, ''), 'legacy'),
    b.service_type = COALESCE(NULLIF(b.service_type, ''), s.service_type),
    b.eyebrow = COALESCE(b.eyebrow, b.subtitle),
    b.body = COALESCE(b.body, b.subtitle),
    b.cta_label = COALESCE(b.cta_label, ''),
    b.cta_href = COALESCE(b.cta_href, b.link_url),
    b.alt_text = COALESCE(b.alt_text, b.title)
WHERE b.slot_key = '' OR b.family = 'legacy';

INSERT INTO banner_slots (
    slot_code,
    slot_name,
    placement,
    service_type,
    screen_type,
    is_active
)
SELECT
    src.slot_key,
    src.title,
    src.site,
    src.site,
    'desktop',
    src.active
FROM (
    SELECT 'stay_hotel_promo_main' AS slot_key, 'stay' AS site, '제주 숙박 메인 프로모션' AS title, 10 AS sort_order, 1 AS active
    UNION ALL SELECT 'stay_hotel_promo_sub_1', 'stay', '리프레시 포인트', 20, 1
    UNION ALL SELECT 'stay_hotel_promo_sub_2', 'stay', '항공 + 숙박 패키지', 30, 1
    UNION ALL SELECT 'stay_private_promo_main', 'stay', '프라이빗 스테이 메인 프로모션', 40, 1
    UNION ALL SELECT 'stay_private_promo_sub_1', 'stay', '숙소 사진 인증', 50, 1
    UNION ALL SELECT 'stay_private_promo_sub_2', 'stay', '다이닝 & 라운지', 60, 1
    UNION ALL SELECT 'stay_life_synergy_banner', 'stay', '제주항공 + 제주스테이 시너지 배너', 70, 1
    UNION ALL SELECT 'stay_life_promo_1', 'stay', '수하물 혜택', 80, 1
    UNION ALL SELECT 'stay_life_promo_2', 'stay', '로컬 멤버 카드', 90, 1
    UNION ALL SELECT 'stay_life_promo_3', 'stay', '여행 가이드 혜택', 100, 1
    UNION ALL SELECT 'stay_activities_auth_banner', 'stay', '탑승객 인증 혜택 배너', 110, 1
    UNION ALL SELECT 'air_home_hero_1', 'air', '항공 홈 히어로 1', 120, 1
    UNION ALL SELECT 'air_home_hero_2', 'air', '항공 홈 히어로 2', 130, 1
    UNION ALL SELECT 'air_home_hero_3', 'air', '항공 홈 히어로 3', 140, 1
) AS src
ON DUPLICATE KEY UPDATE
    slot_name = VALUES(slot_name),
    placement = VALUES(placement),
    service_type = VALUES(service_type),
    screen_type = VALUES(screen_type),
    is_active = VALUES(is_active);

INSERT INTO banners (
    banner_slot_id,
    banner_code,
    slot_key,
    family,
    service_type,
    title,
    subtitle,
    eyebrow,
    body,
    cta_label,
    cta_href,
    image_url,
    mobile_image_url,
    alt_text,
    link_url,
    start_at,
    end_at,
    sort_order,
    is_active
)
SELECT
    s.id,
    src.slot_key,
    src.slot_key,
    src.family,
    src.site,
    src.title,
    src.eyebrow,
    src.eyebrow,
    src.body,
    src.cta_label,
    src.cta_href,
    src.image_url,
    CASE
        WHEN src.image_url = '' THEN NULL
        ELSE src.image_url
    END,
    src.alt_text,
    src.cta_href,
    NULL,
    NULL,
    src.sort_order,
    src.active
FROM (
    SELECT
        'stay_hotel_promo_main' AS slot_key,
        'promo_card_family' AS family,
        'stay' AS site,
        'JEJU UNIVERSE' AS eyebrow,
        '제주 숙박 메인 프로모션' AS title,
        '제주항공과 제휴 호텔 예약 혜택을 한 번에 확인하는 메인 카드.' AS body,
        '자세히 보기' AS cta_label,
        '#' AS cta_href,
        '' AS image_url,
        '' AS alt_text,
        10 AS sort_order,
        1 AS active
    UNION ALL SELECT 'stay_hotel_promo_sub_1', 'promo_card_family', 'stay', 'REFRESH POINT', '리프레시 포인트', '숙박 결제에 쓸 수 있는 혜택 카드.', '포인트 확인', '#', '', '', 20, 1
    UNION ALL SELECT 'stay_hotel_promo_sub_2', 'promo_card_family', 'stay', 'PACKAGE DEAL', '항공 + 숙박 패키지', '항공과 숙박을 함께 묶는 패키지 할인 카드.', '패키지 보기', '#', '', '', 30, 1
    UNION ALL SELECT 'stay_private_promo_main', 'promo_card_family', 'stay', 'PREMIUM CHECK-IN', '프라이빗 스테이 메인 프로모션', '프리미엄 체크인과 회원 혜택을 강조하는 메인 카드.', '상품 확인', '#', '', '', 40, 1
    UNION ALL SELECT 'stay_private_promo_sub_1', 'promo_card_family', 'stay', 'SNAP PHOTO', '숙소 사진 인증', '현장 사진과 리뷰 가이드를 보여주는 서브 카드.', '사진 보기', '#', '', '', 50, 1
    UNION ALL SELECT 'stay_private_promo_sub_2', 'promo_card_family', 'stay', 'DINING', '다이닝 & 라운지', '식음료 혜택을 강조하는 서브 카드.', '메뉴 보기', '#', '', '', 60, 1
    UNION ALL SELECT 'stay_life_synergy_banner', 'inline_cta_banner_family', 'stay', 'SYNERGY', '제주항공 + 제주스테이 시너지 배너', '항공권 인증과 숙박 혜택을 한 줄로 연결하는 CTA 배너.', '혜택 보기', '#', '', '', 70, 1
    UNION ALL SELECT 'stay_life_promo_1', 'promo_card_family', 'stay', 'LUGGAGE', '수하물 혜택', '장기 체류와 연결되는 수하물 추가 혜택 카드.', '혜택 확인', '#', '', '', 80, 1
    UNION ALL SELECT 'stay_life_promo_2', 'promo_card_family', 'stay', 'MEMBER CARD', '로컬 멤버 카드', '카페, 렌터카, 부가 혜택을 묶어 보여주는 카드.', '카드 보기', '#', '', '', 90, 1
    UNION ALL SELECT 'stay_life_promo_3', 'promo_card_family', 'stay', 'GUIDE', '여행 가이드 혜택', '장기 체류 전용 가이드 콘텐츠를 보여주는 카드.', '가이드 보기', '#', '', '', 100, 1
    UNION ALL SELECT 'stay_activities_auth_banner', 'inline_cta_banner_family', 'stay', 'AUTH BANNER', '탑승객 인증 혜택 배너', '항공권 인증 후 즉시 연결되는 inline CTA 배너.', '인증하기', '#', '', '', 110, 1
    UNION ALL SELECT 'air_home_hero_1', 'hero_image_set', 'air', 'AIR HERO', '항공 홈 히어로 1', '제주항공 메인 비주얼 슬라이드 1.', '', '', '/jejuair/assets/img/main/slide1.png', '제주항공 메인 슬라이드 1', 120, 1
    UNION ALL SELECT 'air_home_hero_2', 'hero_image_set', 'air', 'AIR HERO', '항공 홈 히어로 2', '제주항공 메인 비주얼 슬라이드 2.', '', '', '/jejuair/assets/img/main/slide2.png', '제주항공 메인 슬라이드 2', 130, 1
    UNION ALL SELECT 'air_home_hero_3', 'hero_image_set', 'air', 'AIR HERO', '항공 홈 히어로 3', '제주항공 메인 비주얼 슬라이드 3.', '', '', '/jejuair/assets/img/main/slide3.png', '제주항공 메인 슬라이드 3', 140, 1
) AS src
JOIN banner_slots s ON s.slot_code = src.slot_key
ON DUPLICATE KEY UPDATE
    banner_slot_id = VALUES(banner_slot_id),
    family = VALUES(family),
    service_type = VALUES(service_type),
    title = VALUES(title),
    subtitle = VALUES(subtitle),
    eyebrow = VALUES(eyebrow),
    body = VALUES(body),
    cta_label = VALUES(cta_label),
    cta_href = VALUES(cta_href),
    image_url = VALUES(image_url),
    mobile_image_url = VALUES(mobile_image_url),
    alt_text = VALUES(alt_text),
    link_url = VALUES(link_url),
    sort_order = VALUES(sort_order),
    is_active = VALUES(is_active);

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
SELECT
    CONCAT('banner-', src.slot_key) AS rule_code,
    'banner' AS target_type,
    src.slot_key AS target_key,
    'all' AS audience_type,
    src.site AS service_type,
    'all' AS device_type,
    NULL AS country_code,
    NULL AS start_at,
    NULL AS end_at,
    src.sort_order AS priority,
    src.active AS is_active
FROM (
    SELECT 'stay_hotel_promo_main' AS slot_key, 'stay' AS site, 10 AS sort_order, 1 AS active
    UNION ALL SELECT 'stay_hotel_promo_sub_1', 'stay', 20, 1
    UNION ALL SELECT 'stay_hotel_promo_sub_2', 'stay', 30, 1
    UNION ALL SELECT 'stay_private_promo_main', 'stay', 40, 1
    UNION ALL SELECT 'stay_private_promo_sub_1', 'stay', 50, 1
    UNION ALL SELECT 'stay_private_promo_sub_2', 'stay', 60, 1
    UNION ALL SELECT 'stay_life_synergy_banner', 'stay', 70, 1
    UNION ALL SELECT 'stay_life_promo_1', 'stay', 80, 1
    UNION ALL SELECT 'stay_life_promo_2', 'stay', 90, 1
    UNION ALL SELECT 'stay_life_promo_3', 'stay', 100, 1
    UNION ALL SELECT 'stay_activities_auth_banner', 'stay', 110, 1
    UNION ALL SELECT 'air_home_hero_1', 'air', 120, 1
    UNION ALL SELECT 'air_home_hero_2', 'air', 130, 1
    UNION ALL SELECT 'air_home_hero_3', 'air', 140, 1
) AS src
ON DUPLICATE KEY UPDATE
    target_type = VALUES(target_type),
    target_key = VALUES(target_key),
    audience_type = VALUES(audience_type),
    service_type = VALUES(service_type),
    device_type = VALUES(device_type),
    country_code = VALUES(country_code),
    start_at = VALUES(start_at),
    end_at = VALUES(end_at),
    priority = VALUES(priority),
    is_active = VALUES(is_active);
