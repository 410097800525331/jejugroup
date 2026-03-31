-- V16 property/catalog seed
-- repeat-safe and source-bound to front hotel data

DELETE FROM properties
WHERE property_code IN (
    'stay-jeju-shilla-standard-twin',
    'stay-jeju-parnas-poolvilla'
);

INSERT INTO properties (
    property_code,
    name,
    property_type,
    service_type,
    region_name,
    address,
    phone,
    star_rating,
    is_active
)
VALUES
    ('stay-hiroshima-premium', '히로시마 프리미엄 호텔', 'hotel', 'stay', '히로시마 시내 중심', NULL, NULL, 5.0, 1),
    ('stay-miyajima-grand', '미야지마 그랜드 리조트', 'resort', 'stay', '미야지마 해변가', NULL, NULL, 4.0, 1),
    ('stay-jeju-grand-hyatt', '그랜드 하얏트 제주', 'hotel', 'stay', '제주시 노형동', NULL, NULL, 5.0, 1),
    ('stay-jeju-shinhwa', '제주신화월드 메리어트', 'resort', 'stay', '서귀포 안덕면', NULL, NULL, 5.0, 1),
    ('stay-osaka-ritz', '리츠칼튼 오사카', 'hotel', 'stay', '우메다', NULL, NULL, 5.0, 1),
    ('stay-osaka-cross', '크로스 호텔 오사카', 'hotel', 'stay', '도톤보리', NULL, NULL, 4.0, 1)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    property_type = VALUES(property_type),
    service_type = VALUES(service_type),
    region_name = VALUES(region_name),
    address = VALUES(address),
    phone = VALUES(phone),
    star_rating = VALUES(star_rating),
    is_active = VALUES(is_active);

INSERT INTO property_room_types (
    property_id,
    room_type_code,
    name,
    base_price,
    max_occupancy,
    bed_type,
    smoking_allowed,
    is_active
)
SELECT
    p.id,
    src.room_type_code,
    src.name,
    src.base_price,
    src.max_occupancy,
    src.bed_type,
    src.smoking_allowed,
    src.is_active
FROM (
    SELECT 'stay-hiroshima-premium' AS property_code, 'stay-hiroshima-premium-room' AS room_type_code, '히로시마 프리미엄 호텔 객실' AS name, 189000.00 AS base_price, 2 AS max_occupancy, '킹베드' AS bed_type, 0 AS smoking_allowed, 1 AS is_active
    UNION ALL SELECT 'stay-miyajima-grand', 'stay-miyajima-grand-room', '미야지마 그랜드 리조트 객실', 265000.00, 4, '트윈베드', 0, 1
    UNION ALL SELECT 'stay-jeju-grand-hyatt', 'stay-jeju-grand-hyatt-room', '그랜드 하얏트 제주 객실', 349000.00, 2, '킹베드', 0, 1
    UNION ALL SELECT 'stay-jeju-shinhwa', 'stay-jeju-shinhwa-room', '제주신화월드 메리어트 객실', 289000.00, 4, '패밀리베드', 0, 1
    UNION ALL SELECT 'stay-osaka-ritz', 'stay-osaka-ritz-room', '리츠칼튼 오사카 객실', 438000.00, 2, '킹베드', 0, 1
    UNION ALL SELECT 'stay-osaka-cross', 'stay-osaka-cross-room', '크로스 호텔 오사카 객실', 214000.00, 2, '더블베드', 0, 1
) AS src
JOIN properties p ON p.property_code = src.property_code
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    base_price = VALUES(base_price),
    max_occupancy = VALUES(max_occupancy),
    bed_type = VALUES(bed_type),
    smoking_allowed = VALUES(smoking_allowed),
    is_active = VALUES(is_active);

INSERT INTO property_tags (
    property_id,
    tag_name,
    tag_type,
    sort_order,
    is_active
)
SELECT
    p.id,
    src.tag_name,
    src.tag_type,
    src.sort_order,
    src.is_active
FROM (
    SELECT 'stay-hiroshima-premium' AS property_code, '무료 Wi-Fi' AS tag_name, 'general' AS tag_type, 1 AS sort_order, 1 AS is_active
    UNION ALL SELECT 'stay-miyajima-grand', '조식 포함', 'general', 1, 1
    UNION ALL SELECT 'stay-jeju-grand-hyatt', '도심형 럭셔리', 'general', 1, 1
    UNION ALL SELECT 'stay-jeju-shinhwa', '워터파크', 'general', 1, 1
    UNION ALL SELECT 'stay-osaka-ritz', '클래식 인테리어', 'general', 1, 1
    UNION ALL SELECT 'stay-osaka-cross', '도톤보리 인접', 'general', 1, 1
) AS src
JOIN properties p ON p.property_code = src.property_code
ON DUPLICATE KEY UPDATE
    tag_type = VALUES(tag_type),
    sort_order = VALUES(sort_order),
    is_active = VALUES(is_active);

INSERT INTO property_benefits (
    property_id,
    benefit_code,
    benefit_name,
    benefit_icon,
    sort_order,
    is_active
)
SELECT
    p.id,
    src.benefit_code,
    src.benefit_name,
    src.benefit_icon,
    src.sort_order,
    src.is_active
FROM (
    SELECT 'stay-hiroshima-premium' AS property_code, 'spa-massage' AS benefit_code, '스파 & 마사지' AS benefit_name, NULL AS benefit_icon, 1 AS sort_order, 1 AS is_active
    UNION ALL SELECT 'stay-miyajima-grand', 'ocean-view', '오션뷰', NULL, 1, 1
    UNION ALL SELECT 'stay-jeju-grand-hyatt', 'indoor-pool', '실내 수영장', NULL, 1, 1
    UNION ALL SELECT 'stay-jeju-shinhwa', 'kids-friendly', '키즈 친화', NULL, 1, 1
    UNION ALL SELECT 'stay-osaka-ritz', 'michelin-dining', '미슐랭 다이닝', NULL, 1, 1
    UNION ALL SELECT 'stay-osaka-cross', 'couple-friendly', '커플 추천', NULL, 1, 1
) AS src
JOIN properties p ON p.property_code = src.property_code
ON DUPLICATE KEY UPDATE
    benefit_name = VALUES(benefit_name),
    benefit_icon = VALUES(benefit_icon),
    sort_order = VALUES(sort_order),
    is_active = VALUES(is_active);

INSERT INTO property_display_overrides (
    property_id,
    title_override,
    badge_text,
    original_price_override,
    current_price_override,
    hero_image_url,
    summary_text,
    is_visible
)
SELECT
    p.id,
    src.title_override,
    src.badge_text,
    src.original_price_override,
    src.current_price_override,
    src.hero_image_url,
    src.summary_text,
    src.is_visible
FROM (
    SELECT 'stay-hiroshima-premium' AS property_code, '히로시마 프리미엄 호텔' AS title_override, '특가 상품' AS badge_text, 250000.00 AS original_price_override, 189000.00 AS current_price_override, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80' AS hero_image_url, '히로시마 시내 중심 · 원폭 돔 인근' AS summary_text, 1 AS is_visible
    UNION ALL SELECT 'stay-miyajima-grand', '미야지마 그랜드 리조트', '인기 숙소', 320000.00, 265000.00, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80', '미야지마 해변가 · 선착장 도보 10분', 1
    UNION ALL SELECT 'stay-jeju-grand-hyatt', '그랜드 하얏트 제주', 'JEJU PICK', 420000.00, 349000.00, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80', '제주시 노형동 · 공항 15분', 1
    UNION ALL SELECT 'stay-jeju-shinhwa', '제주신화월드 메리어트', '패밀리 특가', 360000.00, 289000.00, 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80', '서귀포 안덕면 · 가족 여행 인기', 1
    UNION ALL SELECT 'stay-osaka-ritz', '리츠칼튼 오사카', '럭셔리 추천', 520000.00, 438000.00, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80', '우메다 · 오사카역 차량 5분', 1
    UNION ALL SELECT 'stay-osaka-cross', '크로스 호텔 오사카', '쇼핑 특화', 260000.00, 214000.00, 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80', '도톤보리 · 난바역 도보 3분', 1
) AS src
JOIN properties p ON p.property_code = src.property_code
ON DUPLICATE KEY UPDATE
    title_override = VALUES(title_override),
    badge_text = VALUES(badge_text),
    original_price_override = VALUES(original_price_override),
    current_price_override = VALUES(current_price_override),
    hero_image_url = VALUES(hero_image_url),
    summary_text = VALUES(summary_text),
    is_visible = VALUES(is_visible);

INSERT INTO price_policies (
    property_id,
    property_room_type_id,
    policy_code,
    policy_name,
    policy_type,
    discount_type,
    discount_value,
    min_nights,
    max_nights,
    start_date,
    end_date,
    priority,
    is_active
)
SELECT
    p.id,
    rt.id,
    src.policy_code,
    src.policy_name,
    src.policy_type,
    src.discount_type,
    src.discount_value,
    src.min_nights,
    src.max_nights,
    src.start_date,
    src.end_date,
    src.priority,
    src.is_active
FROM (
    SELECT 'stay-hiroshima-premium' AS property_code, 'stay-hiroshima-premium-room' AS room_type_code, 'stay-hiroshima-premium-promo' AS policy_code, '히로시마 프리미엄 호텔 프로모션' AS policy_name, 'seasonal' AS policy_type, 'amount' AS discount_type, 61000.00 AS discount_value, 1 AS min_nights, NULL AS max_nights, NULL AS start_date, NULL AS end_date, 1 AS priority, 1 AS is_active
    UNION ALL SELECT 'stay-miyajima-grand', 'stay-miyajima-grand-room', 'stay-miyajima-grand-promo', '미야지마 그랜드 리조트 프로모션', 'seasonal', 'amount', 55000.00, 1, NULL, NULL, NULL, 1, 1
    UNION ALL SELECT 'stay-jeju-grand-hyatt', 'stay-jeju-grand-hyatt-room', 'stay-jeju-grand-hyatt-promo', '그랜드 하얏트 제주 프로모션', 'seasonal', 'amount', 71000.00, 1, NULL, NULL, NULL, 1, 1
    UNION ALL SELECT 'stay-jeju-shinhwa', 'stay-jeju-shinhwa-room', 'stay-jeju-shinhwa-promo', '제주신화월드 메리어트 프로모션', 'seasonal', 'amount', 71000.00, 1, NULL, NULL, NULL, 1, 1
    UNION ALL SELECT 'stay-osaka-ritz', 'stay-osaka-ritz-room', 'stay-osaka-ritz-promo', '리츠칼튼 오사카 프로모션', 'seasonal', 'amount', 82000.00, 1, NULL, NULL, NULL, 1, 1
    UNION ALL SELECT 'stay-osaka-cross', 'stay-osaka-cross-room', 'stay-osaka-cross-promo', '크로스 호텔 오사카 프로모션', 'seasonal', 'amount', 46000.00, 1, NULL, NULL, NULL, 1, 1
) AS src
JOIN properties p ON p.property_code = src.property_code
JOIN property_room_types rt
  ON rt.property_id = p.id
 AND rt.room_type_code = src.room_type_code
ON DUPLICATE KEY UPDATE
    policy_name = VALUES(policy_name),
    policy_type = VALUES(policy_type),
    discount_type = VALUES(discount_type),
    discount_value = VALUES(discount_value),
    min_nights = VALUES(min_nights),
    max_nights = VALUES(max_nights),
    start_date = VALUES(start_date),
    end_date = VALUES(end_date),
    priority = VALUES(priority),
    is_active = VALUES(is_active);

-- lodging.js hotel inventory rows are display-only mocks and do not map cleanly
-- to the catalog-backed property master, so inventory_stocks seed is omitted here.
