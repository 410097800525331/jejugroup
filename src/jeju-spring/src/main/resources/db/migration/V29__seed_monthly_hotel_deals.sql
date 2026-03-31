-- V29 monthly hotel deals seed for JEJU STAY landing
-- repeat-safe and source-bound to front/jejustay/pages/hotel/jejuhotel.html

DELETE pp
FROM hotel_price_policies pp
INNER JOIN hotel_properties hp ON hp.id = pp.hotel_property_id
WHERE hp.property_code IN (
    'stay-jeju-grand-hyatt',
    'stay-osaka-ritz',
    'stay-danang-intercontinental',
    'stay-bangkok-mandarin'
);

DELETE hb
FROM hotel_benefits hb
INNER JOIN hotel_properties hp ON hp.id = hb.hotel_property_id
WHERE hp.property_code IN (
    'stay-jeju-grand-hyatt',
    'stay-osaka-ritz',
    'stay-danang-intercontinental',
    'stay-bangkok-mandarin'
);

DELETE ht
FROM hotel_tags ht
INNER JOIN hotel_properties hp ON hp.id = ht.hotel_property_id
WHERE hp.property_code IN (
    'stay-jeju-grand-hyatt',
    'stay-osaka-ritz',
    'stay-danang-intercontinental',
    'stay-bangkok-mandarin'
);

DELETE hdo
FROM hotel_display_overrides hdo
INNER JOIN hotel_properties hp ON hp.id = hdo.hotel_property_id
WHERE hp.property_code IN (
    'stay-jeju-grand-hyatt',
    'stay-osaka-ritz',
    'stay-danang-intercontinental',
    'stay-bangkok-mandarin'
);

DELETE hrt
FROM hotel_room_types hrt
INNER JOIN hotel_properties hp ON hp.id = hrt.hotel_property_id
WHERE hp.property_code IN (
    'stay-jeju-grand-hyatt',
    'stay-osaka-ritz',
    'stay-danang-intercontinental',
    'stay-bangkok-mandarin'
);

DELETE FROM hotel_properties
WHERE property_code IN (
    'stay-jeju-grand-hyatt',
    'stay-osaka-ritz',
    'stay-danang-intercontinental',
    'stay-bangkok-mandarin'
);

INSERT INTO hotel_properties (
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
    ('stay-jeju-grand-hyatt', '그랜드 하얏트 제주', 'hotel', 'stay', '제주', NULL, NULL, 5.0, 1),
    ('stay-osaka-ritz', '오사카 리츠칼튼', 'hotel', 'stay', '오사카', NULL, NULL, 5.0, 1),
    ('stay-danang-intercontinental', '다낭 인터컨티넨탈 선 페닌슐라', 'hotel', 'stay', '다낭', NULL, NULL, 4.0, 1),
    ('stay-bangkok-mandarin', '방콕 만다린 오리엔탈', 'hotel', 'stay', '방콕', NULL, NULL, 5.0, 1)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    property_type = VALUES(property_type),
    service_type = VALUES(service_type),
    region_name = VALUES(region_name),
    address = VALUES(address),
    phone = VALUES(phone),
    star_rating = VALUES(star_rating),
    is_active = VALUES(is_active);

INSERT INTO hotel_room_types (
    hotel_property_id,
    room_type_code,
    name,
    base_price,
    max_occupancy,
    bed_type,
    smoking_allowed,
    is_active
)
SELECT
    hp.id,
    src.room_type_code,
    src.name,
    src.base_price,
    src.max_occupancy,
    src.bed_type,
    src.smoking_allowed,
    src.is_active
FROM (
    SELECT 'stay-jeju-grand-hyatt' AS property_code, 'stay-jeju-grand-hyatt-monthly-room' AS room_type_code, '그랜드 하얏트 제주 디럭스' AS name, 245000.00 AS base_price, 2 AS max_occupancy, '킹베드' AS bed_type, 0 AS smoking_allowed, 1 AS is_active
    UNION ALL SELECT 'stay-osaka-ritz', 'stay-osaka-ritz-monthly-room', '오사카 리츠칼튼 디럭스', 360000.00, 2, '킹베드', 0, 1
    UNION ALL SELECT 'stay-danang-intercontinental', 'stay-danang-intercontinental-monthly-room', '다낭 인터컨티넨탈 선 페닌슐라 오션뷰', 182000.00, 2, '더블베드', 0, 1
    UNION ALL SELECT 'stay-bangkok-mandarin', 'stay-bangkok-mandarin-monthly-room', '방콕 만다린 오리엔탈 리버뷰', 336000.00, 2, '킹베드', 0, 1
) AS src
INNER JOIN hotel_properties hp ON hp.property_code = src.property_code
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    base_price = VALUES(base_price),
    max_occupancy = VALUES(max_occupancy),
    bed_type = VALUES(bed_type),
    smoking_allowed = VALUES(smoking_allowed),
    is_active = VALUES(is_active);

INSERT INTO hotel_display_overrides (
    hotel_property_id,
    title_override,
    badge_text,
    original_price_override,
    current_price_override,
    hero_image_url,
    summary_text,
    is_visible
)
SELECT
    hp.id,
    src.title_override,
    src.badge_text,
    src.original_price_override,
    src.current_price_override,
    src.hero_image_url,
    src.summary_text,
    src.is_visible
FROM (
    SELECT 'stay-jeju-grand-hyatt' AS property_code, '그랜드 하얏트 제주' AS title_override, 'JJ 추천' AS badge_text, 350000.00 AS original_price_override, 245000.00 AS current_price_override, '/uploads/stay/monthly-deals/stay-jeju-grand-hyatt/hero.jpg' AS hero_image_url, '제주시 노형동 · 해변까지 도보 5분' AS summary_text, 1 AS is_visible
    UNION ALL SELECT 'stay-osaka-ritz', '오사카 리츠칼튼', 'JJ 추천', 480000.00, 360000.00, '/uploads/stay/monthly-deals/stay-osaka-ritz/hero.jpg', '오사카 키타구 · 우메다역 도보 3분', 1
    UNION ALL SELECT 'stay-danang-intercontinental', '다낭 인터컨티넨탈 선 페닌슐라', '최저가 보장', 280000.00, 182000.00, '/uploads/stay/monthly-deals/stay-danang-intercontinental/hero.jpg', '다낭 손트라 · 프라이빗 비치', 1
    UNION ALL SELECT 'stay-bangkok-mandarin', '방콕 만다린 오리엔탈', 'JJ 추천', 420000.00, 336000.00, '/uploads/stay/monthly-deals/stay-bangkok-mandarin/hero.jpg', '방콕 차오프라야강 · 리버뷰', 1
) AS src
INNER JOIN hotel_properties hp ON hp.property_code = src.property_code
ON DUPLICATE KEY UPDATE
    title_override = VALUES(title_override),
    badge_text = VALUES(badge_text),
    original_price_override = VALUES(original_price_override),
    current_price_override = VALUES(current_price_override),
    hero_image_url = VALUES(hero_image_url),
    summary_text = VALUES(summary_text),
    is_visible = VALUES(is_visible);

INSERT INTO hotel_tags (
    hotel_property_id,
    tag_name,
    tag_type,
    sort_order,
    is_active
)
SELECT
    hp.id,
    src.tag_name,
    src.tag_type,
    src.sort_order,
    src.is_active
FROM (
    SELECT 'stay-jeju-grand-hyatt' AS property_code, 'monthly-deal' AS tag_name, 'campaign' AS tag_type, 10 AS sort_order, 1 AS is_active
    UNION ALL SELECT 'stay-jeju-grand-hyatt', 'ocean-view', 'theme', 20, 1
    UNION ALL SELECT 'stay-jeju-grand-hyatt', 'jeju-city', 'location', 30, 1
    UNION ALL SELECT 'stay-osaka-ritz', 'monthly-deal', 'campaign', 10, 1
    UNION ALL SELECT 'stay-osaka-ritz', 'city-center', 'location', 20, 1
    UNION ALL SELECT 'stay-osaka-ritz', 'business', 'theme', 30, 1
    UNION ALL SELECT 'stay-danang-intercontinental', 'monthly-deal', 'campaign', 10, 1
    UNION ALL SELECT 'stay-danang-intercontinental', 'private-beach', 'theme', 20, 1
    UNION ALL SELECT 'stay-danang-intercontinental', 'ocean-view', 'theme', 30, 1
    UNION ALL SELECT 'stay-bangkok-mandarin', 'monthly-deal', 'campaign', 10, 1
    UNION ALL SELECT 'stay-bangkok-mandarin', 'river-view', 'theme', 20, 1
    UNION ALL SELECT 'stay-bangkok-mandarin', 'spa', 'theme', 30, 1
) AS src
INNER JOIN hotel_properties hp ON hp.property_code = src.property_code
ON DUPLICATE KEY UPDATE
    tag_type = VALUES(tag_type),
    sort_order = VALUES(sort_order),
    is_active = VALUES(is_active);

INSERT INTO hotel_benefits (
    hotel_property_id,
    benefit_code,
    benefit_name,
    benefit_icon,
    sort_order,
    is_active
)
SELECT
    hp.id,
    src.benefit_code,
    src.benefit_name,
    src.benefit_icon,
    src.sort_order,
    src.is_active
FROM (
    SELECT 'stay-jeju-grand-hyatt' AS property_code, 'wifi' AS benefit_code, '무료 와이파이' AS benefit_name, 'wifi' AS benefit_icon, 10 AS sort_order, 1 AS is_active
    UNION ALL SELECT 'stay-jeju-grand-hyatt', 'pool', '수영장', 'waves', 20, 1
    UNION ALL SELECT 'stay-jeju-grand-hyatt', 'breakfast', '조식 포함', 'utensils', 30, 1
    UNION ALL SELECT 'stay-osaka-ritz', 'wifi', '무료 와이파이', 'wifi', 10, 1
    UNION ALL SELECT 'stay-osaka-ritz', 'fitness', '피트니스', 'dumbbell', 20, 1
    UNION ALL SELECT 'stay-osaka-ritz', 'spa', '스파', 'sparkles', 30, 1
    UNION ALL SELECT 'stay-danang-intercontinental', 'wifi', '무료 와이파이', 'wifi', 10, 1
    UNION ALL SELECT 'stay-danang-intercontinental', 'infinity-pool', '인피니티 풀', 'waves', 20, 1
    UNION ALL SELECT 'stay-danang-intercontinental', 'breakfast', '조식 포함', 'utensils', 30, 1
    UNION ALL SELECT 'stay-bangkok-mandarin', 'wifi', '무료 와이파이', 'wifi', 10, 1
    UNION ALL SELECT 'stay-bangkok-mandarin', 'spa', '스파', 'sparkles', 20, 1
    UNION ALL SELECT 'stay-bangkok-mandarin', 'shuttle-boat', '셔틀보트', 'ship', 30, 1
) AS src
INNER JOIN hotel_properties hp ON hp.property_code = src.property_code
ON DUPLICATE KEY UPDATE
    benefit_name = VALUES(benefit_name),
    benefit_icon = VALUES(benefit_icon),
    sort_order = VALUES(sort_order),
    is_active = VALUES(is_active);

INSERT INTO hotel_price_policies (
    hotel_property_id,
    hotel_room_type_id,
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
    hp.id,
    hrt.id,
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
    SELECT 'stay-jeju-grand-hyatt' AS property_code, 'stay-jeju-grand-hyatt-monthly-room' AS room_type_code, 'stay-jeju-grand-hyatt-monthly-deal' AS policy_code, '그랜드 하얏트 제주 월간 딜' AS policy_name, 'monthly' AS policy_type, 'amount' AS discount_type, 105000.00 AS discount_value, 1 AS min_nights, NULL AS max_nights, NULL AS start_date, NULL AS end_date, 10 AS priority, 1 AS is_active
    UNION ALL SELECT 'stay-osaka-ritz', 'stay-osaka-ritz-monthly-room', 'stay-osaka-ritz-monthly-deal', '오사카 리츠칼튼 월간 딜', 'monthly', 'amount', 120000.00, 1, NULL, NULL, NULL, 20, 1
    UNION ALL SELECT 'stay-danang-intercontinental', 'stay-danang-intercontinental-monthly-room', 'stay-danang-intercontinental-monthly-deal', '다낭 인터컨티넨탈 선 페닌슐라 월간 딜', 'monthly', 'amount', 98000.00, 1, NULL, NULL, NULL, 30, 1
    UNION ALL SELECT 'stay-bangkok-mandarin', 'stay-bangkok-mandarin-monthly-room', 'stay-bangkok-mandarin-monthly-deal', '방콕 만다린 오리엔탈 월간 딜', 'monthly', 'amount', 84000.00, 1, NULL, NULL, NULL, 40, 1
) AS src
INNER JOIN hotel_properties hp ON hp.property_code = src.property_code
INNER JOIN hotel_room_types hrt
    ON hrt.hotel_property_id = hp.id
   AND hrt.room_type_code = src.room_type_code
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
