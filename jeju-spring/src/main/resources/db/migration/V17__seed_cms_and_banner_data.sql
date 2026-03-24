-- V17 cms/banner seed
-- repeat-safe and source-bound to front/admin/js/cms.js

INSERT INTO cms_pages (
    page_code,
    page_name,
    page_path,
    service_type,
    page_type,
    is_active,
    published_at
)
VALUES
    ('cms-hotel-banner', '호텔 배너 관리', '/admin/cms/hotel/banner', 'stay', 'banner', 1, '2026-02-19 00:00:00.000'),
    ('cms-flight-notice', '항공 공지 관리', '/admin/cms/flight/notice', 'air', 'notice', 1, '2026-02-15 00:00:00.000'),
    ('cms-rentcar-event', '렌터카 이벤트 관리', '/admin/cms/rentcar/event', 'rentcar', 'event', 1, '2026-02-10 00:00:00.000'),
    ('cms-global-popup', '전체 팝업 관리', '/admin/cms/global/popup', 'common', 'popup', 1, '2026-03-01 00:00:00.000'),
    ('cms-hotel-notice', '호텔 공지 관리', '/admin/cms/hotel/notice', 'stay', 'notice', 1, '2026-01-20 00:00:00.000')
ON DUPLICATE KEY UPDATE
    page_name = VALUES(page_name),
    service_type = VALUES(service_type),
    page_type = VALUES(page_type),
    is_active = VALUES(is_active),
    published_at = VALUES(published_at);

INSERT INTO cms_blocks (
    cms_page_id,
    block_code,
    block_name,
    block_type,
    sort_order,
    is_active
)
SELECT
    p.id,
    src.block_code,
    src.block_name,
    src.block_type,
    src.sort_order,
    src.is_active
FROM (
    SELECT 'cms-hotel-banner' AS page_code, 'hero' AS block_code, '호텔 배너 영역' AS block_name, 'banner' AS block_type, 1 AS sort_order, 1 AS is_active
    UNION ALL SELECT 'cms-flight-notice', 'notice', '항공 공지 영역', 'notice', 1, 1
    UNION ALL SELECT 'cms-rentcar-event', 'event', '렌터카 이벤트 영역', 'event', 1, 1
    UNION ALL SELECT 'cms-global-popup', 'popup', '전체 팝업 영역', 'popup', 1, 1
    UNION ALL SELECT 'cms-hotel-notice', 'notice', '호텔 공지 영역', 'notice', 1, 1
) AS src
JOIN cms_pages p ON p.page_code = src.page_code
ON DUPLICATE KEY UPDATE
    block_name = VALUES(block_name),
    block_type = VALUES(block_type),
    sort_order = VALUES(sort_order),
    is_active = VALUES(is_active);

INSERT INTO content_items (
    cms_block_id,
    content_code,
    content_type,
    title,
    summary,
    body,
    image_url,
    link_url,
    sort_order,
    is_active
)
SELECT
    b.id,
    src.content_code,
    src.content_type,
    src.title,
    src.summary,
    src.body,
    src.image_url,
    src.link_url,
    src.sort_order,
    src.is_active
FROM (
    SELECT 'cms-hotel-banner' AS page_code, 'hero' AS block_code, 'CON-001' AS content_code, 'banner' AS content_type, '여름 시즌 풀빌라 얼리버드 특가 한정판' AS title, '호텔 배너 항목' AS summary, '여름 시즌 풀빌라 얼리버드 특가 한정판' AS body, NULL AS image_url, '/admin/cms/hotel/banner' AS link_url, 1 AS sort_order, 1 AS is_active
    UNION ALL SELECT 'cms-flight-notice', 'notice', 'CON-002', 'notice', '[공지] 악기류 기내 반입 규정 변동 안내', '항공 공지 항목', '[공지] 악기류 기내 반입 규정 변동 안내', NULL, '/admin/cms/flight/notice', 1, 1
    UNION ALL SELECT 'cms-rentcar-event', 'event', 'CON-003', 'event', '렌터카 전기차 대여 시 충전 무료 이벤트', '렌터카 이벤트 항목', '렌터카 전기차 대여 시 충전 무료 이벤트', NULL, '/admin/cms/rentcar/event', 1, 1
    UNION ALL SELECT 'cms-global-popup', 'popup', 'CON-004', 'popup', '시스템 정기 임시 점검 안내', '전체 팝업 항목', '시스템 정기 임시 점검 안내', NULL, '/admin/cms/global/popup', 1, 1
    UNION ALL SELECT 'cms-hotel-notice', 'notice', 'CON-005', 'notice', '어메니티 규제 법안에 따른 칫솔 미제공 안내', '호텔 공지 항목', '어메니티 규제 법안에 따른 칫솔 미제공 안내', NULL, '/admin/cms/hotel/notice', 1, 1
) AS src
JOIN cms_pages p ON p.page_code = src.page_code
JOIN cms_blocks b
  ON b.cms_page_id = p.id
 AND b.block_code = src.block_code
ON DUPLICATE KEY UPDATE
    content_type = VALUES(content_type),
    title = VALUES(title),
    summary = VALUES(summary),
    body = VALUES(body),
    image_url = VALUES(image_url),
    link_url = VALUES(link_url),
    sort_order = VALUES(sort_order),
    is_active = VALUES(is_active);

INSERT INTO banner_slots (
    slot_code,
    slot_name,
    placement,
    screen_type,
    is_active
)
VALUES
    ('home-main-hero', '메인 홈 히어로', 'home', 'desktop', 1)
ON DUPLICATE KEY UPDATE
    slot_name = VALUES(slot_name),
    placement = VALUES(placement),
    screen_type = VALUES(screen_type),
    is_active = VALUES(is_active);

INSERT INTO banners (
    banner_slot_id,
    banner_code,
    title,
    subtitle,
    image_url,
    mobile_image_url,
    link_url,
    start_at,
    end_at,
    sort_order,
    is_active
)
SELECT
    s.id,
    src.banner_code,
    src.title,
    src.subtitle,
    src.image_url,
    src.mobile_image_url,
    src.link_url,
    src.start_at,
    src.end_at,
    src.sort_order,
    src.is_active
FROM (
    SELECT 'home-main-hero' AS slot_code, 'hotel-summer-poolvilla' AS banner_code, '여름 시즌 풀빌라 얼리버드 특가 한정판' AS title, '호텔 배너 항목' AS subtitle, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80' AS image_url, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900&q=80' AS mobile_image_url, '/admin/cms/hotel/banner' AS link_url, '2026-02-19 00:00:00.000' AS start_at, NULL AS end_at, 1 AS sort_order, 1 AS is_active
) AS src
JOIN banner_slots s ON s.slot_code = src.slot_code
ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    subtitle = VALUES(subtitle),
    image_url = VALUES(image_url),
    mobile_image_url = VALUES(mobile_image_url),
    link_url = VALUES(link_url),
    start_at = VALUES(start_at),
    end_at = VALUES(end_at),
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
VALUES
    ('banner-home-main-hero', 'banner', 'home-main-hero', 'all', 'stay', 'all', NULL, '2026-02-19 00:00:00.000', NULL, 1, 1),
    ('popup-global-maintenance', 'popup', 'cms-global-popup', 'all', 'common', 'all', NULL, '2026-03-01 00:00:00.000', NULL, 2, 1)
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
