CREATE TABLE properties (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    property_code VARCHAR(60) NOT NULL,
    name VARCHAR(200) NOT NULL,
    property_type VARCHAR(30) NOT NULL DEFAULT 'hotel',
    service_type VARCHAR(30) NOT NULL DEFAULT 'stay',
    region_name VARCHAR(100) NULL,
    address VARCHAR(255) NULL,
    phone VARCHAR(30) NULL,
    star_rating DECIMAL(2,1) NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_properties_code (property_code),
    KEY idx_properties_type_active (property_type, is_active),
    KEY idx_properties_service_active (service_type, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='숙소 정보';

CREATE TABLE property_room_types (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    property_id BIGINT UNSIGNED NOT NULL,
    room_type_code VARCHAR(60) NOT NULL,
    name VARCHAR(200) NOT NULL,
    base_price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    max_occupancy INT NOT NULL DEFAULT 2,
    bed_type VARCHAR(80) NULL,
    smoking_allowed TINYINT(1) NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_property_room_types_property_code (property_id, room_type_code),
    KEY idx_property_room_types_property_active (property_id, is_active),
    CONSTRAINT fk_property_room_types_property
        FOREIGN KEY (property_id) REFERENCES properties (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='숙소 객실 유형';

CREATE TABLE property_benefits (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    property_id BIGINT UNSIGNED NOT NULL,
    benefit_code VARCHAR(60) NOT NULL,
    benefit_name VARCHAR(100) NOT NULL,
    benefit_icon VARCHAR(80) NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_property_benefits_property_code (property_id, benefit_code),
    KEY idx_property_benefits_property_sort (property_id, sort_order),
    CONSTRAINT fk_property_benefits_property
        FOREIGN KEY (property_id) REFERENCES properties (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='숙소 혜택';

CREATE TABLE property_display_overrides (
    property_id BIGINT UNSIGNED NOT NULL,
    title_override VARCHAR(200) NULL,
    badge_text VARCHAR(100) NULL,
    original_price_override DECIMAL(12,2) NULL,
    current_price_override DECIMAL(12,2) NULL,
    hero_image_url VARCHAR(500) NULL,
    summary_text VARCHAR(500) NULL,
    is_visible TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (property_id),
    CONSTRAINT fk_property_display_overrides_property
        FOREIGN KEY (property_id) REFERENCES properties (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='숙소 노출 덮어쓰기';

CREATE TABLE property_tags (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    property_id BIGINT UNSIGNED NOT NULL,
    tag_name VARCHAR(80) NOT NULL,
    tag_type VARCHAR(30) NOT NULL DEFAULT 'general',
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_property_tags_property_name (property_id, tag_name),
    KEY idx_property_tags_property_type (property_id, tag_type),
    CONSTRAINT fk_property_tags_property
        FOREIGN KEY (property_id) REFERENCES properties (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='숙소 태그';

CREATE TABLE voucher_products (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    voucher_code VARCHAR(60) NOT NULL,
    property_id BIGINT UNSIGNED NULL,
    product_name VARCHAR(200) NOT NULL,
    voucher_type VARCHAR(30) NOT NULL DEFAULT 'discount',
    face_value DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    sale_price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    valid_days INT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_voucher_products_code (voucher_code),
    KEY idx_voucher_products_property_type (property_id, voucher_type),
    CONSTRAINT fk_voucher_products_property
        FOREIGN KEY (property_id) REFERENCES properties (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='바우처 상품';

CREATE TABLE voucher_product_benefits (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    voucher_product_id BIGINT UNSIGNED NOT NULL,
    benefit_code VARCHAR(60) NOT NULL,
    benefit_name VARCHAR(100) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_voucher_product_benefits_product_code (voucher_product_id, benefit_code),
    KEY idx_voucher_product_benefits_product_sort (voucher_product_id, sort_order),
    CONSTRAINT fk_voucher_product_benefits_product
        FOREIGN KEY (voucher_product_id) REFERENCES voucher_products (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='바우처 혜택';

CREATE TABLE inventory_stocks (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    property_room_type_id BIGINT UNSIGNED NOT NULL,
    stock_date DATE NOT NULL,
    total_quantity INT NOT NULL DEFAULT 0,
    reserved_quantity INT NOT NULL DEFAULT 0,
    sold_quantity INT NOT NULL DEFAULT 0,
    available_quantity INT NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_inventory_stocks_room_date (property_room_type_id, stock_date),
    KEY idx_inventory_stocks_room_status (property_room_type_id, status),
    KEY idx_inventory_stocks_stock_date (stock_date),
    CONSTRAINT fk_inventory_stocks_room_type
        FOREIGN KEY (property_room_type_id) REFERENCES property_room_types (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='재고 현황';

CREATE TABLE inventory_adjustments (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    inventory_stock_id BIGINT UNSIGNED NOT NULL,
    adjusted_by_user_id VARCHAR(100) NULL,
    adjustment_type VARCHAR(30) NOT NULL,
    adjustment_quantity INT NOT NULL,
    before_quantity INT NOT NULL DEFAULT 0,
    after_quantity INT NOT NULL DEFAULT 0,
    reason VARCHAR(500) NULL,
    note VARCHAR(500) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    KEY idx_inventory_adjustments_stock (inventory_stock_id),
    KEY idx_inventory_adjustments_user (adjusted_by_user_id),
    KEY idx_inventory_adjustments_type (adjustment_type),
    CONSTRAINT fk_inventory_adjustments_stock
        FOREIGN KEY (inventory_stock_id) REFERENCES inventory_stocks (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_inventory_adjustments_user
        FOREIGN KEY (adjusted_by_user_id) REFERENCES users (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='재고 조정 이력';

CREATE TABLE price_policies (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    property_id BIGINT UNSIGNED NOT NULL,
    property_room_type_id BIGINT UNSIGNED NULL,
    policy_code VARCHAR(60) NOT NULL,
    policy_name VARCHAR(200) NOT NULL,
    policy_type VARCHAR(30) NOT NULL DEFAULT 'seasonal',
    discount_type VARCHAR(20) NOT NULL DEFAULT 'amount',
    discount_value DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    min_nights INT NOT NULL DEFAULT 1,
    max_nights INT NULL,
    start_date DATE NULL,
    end_date DATE NULL,
    priority INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_price_policies_code (policy_code),
    KEY idx_price_policies_property_room (property_id, property_room_type_id),
    KEY idx_price_policies_active_period (is_active, start_date, end_date, priority),
    CONSTRAINT fk_price_policies_property
        FOREIGN KEY (property_id) REFERENCES properties (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_price_policies_room_type
        FOREIGN KEY (property_room_type_id) REFERENCES property_room_types (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='가격 정책';

CREATE TABLE banner_slots (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    slot_code VARCHAR(60) NOT NULL,
    slot_name VARCHAR(120) NOT NULL,
    placement VARCHAR(50) NOT NULL,
    screen_type VARCHAR(30) NOT NULL DEFAULT 'desktop',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_banner_slots_code (slot_code),
    KEY idx_banner_slots_placement_screen (placement, screen_type, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='배너 슬롯';

CREATE TABLE banners (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    banner_slot_id BIGINT UNSIGNED NOT NULL,
    banner_code VARCHAR(60) NOT NULL,
    title VARCHAR(200) NOT NULL,
    subtitle VARCHAR(255) NULL,
    image_url VARCHAR(500) NOT NULL,
    mobile_image_url VARCHAR(500) NULL,
    link_url VARCHAR(500) NULL,
    start_at DATETIME(3) NULL,
    end_at DATETIME(3) NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_banners_code (banner_code),
    KEY idx_banners_slot_sort (banner_slot_id, sort_order),
    KEY idx_banners_active_period (is_active, start_at, end_at),
    CONSTRAINT fk_banners_slot
        FOREIGN KEY (banner_slot_id) REFERENCES banner_slots (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='배너';

CREATE TABLE cms_pages (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    page_code VARCHAR(60) NOT NULL,
    page_name VARCHAR(200) NOT NULL,
    page_path VARCHAR(255) NOT NULL,
    service_type VARCHAR(30) NOT NULL DEFAULT 'common',
    page_type VARCHAR(30) NOT NULL DEFAULT 'page',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    published_at DATETIME(3) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_cms_pages_code (page_code),
    UNIQUE KEY uk_cms_pages_path (page_path),
    KEY idx_cms_pages_service_type (service_type, page_type, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='CMS 페이지';

CREATE TABLE cms_blocks (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    cms_page_id BIGINT UNSIGNED NOT NULL,
    block_code VARCHAR(60) NOT NULL,
    block_name VARCHAR(200) NOT NULL,
    block_type VARCHAR(30) NOT NULL DEFAULT 'section',
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_cms_blocks_page_code (cms_page_id, block_code),
    KEY idx_cms_blocks_page_sort (cms_page_id, sort_order, is_active),
    CONSTRAINT fk_cms_blocks_page
        FOREIGN KEY (cms_page_id) REFERENCES cms_pages (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='CMS 블록';

CREATE TABLE content_items (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    cms_block_id BIGINT UNSIGNED NOT NULL,
    content_code VARCHAR(60) NOT NULL,
    content_type VARCHAR(30) NOT NULL DEFAULT 'text',
    title VARCHAR(200) NOT NULL,
    summary VARCHAR(500) NULL,
    body LONGTEXT NULL,
    image_url VARCHAR(500) NULL,
    link_url VARCHAR(500) NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_content_items_block_code (cms_block_id, content_code),
    KEY idx_content_items_block_sort (cms_block_id, sort_order, is_active),
    CONSTRAINT fk_content_items_block
        FOREIGN KEY (cms_block_id) REFERENCES cms_blocks (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='콘텐츠 항목';

CREATE TABLE exposure_rules (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    rule_code VARCHAR(60) NOT NULL,
    target_type VARCHAR(30) NOT NULL,
    target_key VARCHAR(100) NOT NULL,
    audience_type VARCHAR(30) NOT NULL DEFAULT 'all',
    service_type VARCHAR(30) NOT NULL DEFAULT 'common',
    device_type VARCHAR(30) NOT NULL DEFAULT 'all',
    country_code CHAR(2) NULL,
    start_at DATETIME(3) NULL,
    end_at DATETIME(3) NULL,
    priority INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_exposure_rules_code (rule_code),
    KEY idx_exposure_rules_target (target_type, target_key),
    KEY idx_exposure_rules_service_audience (service_type, audience_type, device_type, is_active),
    KEY idx_exposure_rules_active_period (is_active, start_at, end_at, priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='노출 규칙';

CREATE TABLE admin_action_logs (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    admin_user_id VARCHAR(100) NULL,
    action_code VARCHAR(80) NOT NULL,
    action_name VARCHAR(120) NOT NULL,
    target_type VARCHAR(30) NULL,
    target_key VARCHAR(100) NULL,
    action_summary VARCHAR(500) NULL,
    request_ip VARCHAR(45) NULL,
    user_agent VARCHAR(500) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    KEY idx_admin_action_logs_admin_time (admin_user_id, created_at),
    KEY idx_admin_action_logs_action_time (action_code, created_at),
    CONSTRAINT fk_admin_action_logs_admin_user
        FOREIGN KEY (admin_user_id) REFERENCES users (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='관리자 작업 로그';

CREATE TABLE user_blacklists (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id VARCHAR(100) NOT NULL,
    blacklisted_by_user_id VARCHAR(100) NULL,
    blacklist_type VARCHAR(30) NOT NULL DEFAULT 'manual',
    blacklist_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    reason VARCHAR(500) NOT NULL,
    starts_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ends_at DATETIME(3) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    KEY idx_user_blacklists_user_status (user_id, blacklist_status),
    KEY idx_user_blacklists_end_at (ends_at),
    KEY idx_user_blacklists_blacklisted_by (blacklisted_by_user_id),
    CONSTRAINT fk_user_blacklists_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_user_blacklists_blacklisted_by_user
        FOREIGN KEY (blacklisted_by_user_id) REFERENCES users (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='사용자 차단 목록';

CREATE TABLE admin_preferences (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    admin_user_id VARCHAR(100) NOT NULL,
    pref_key VARCHAR(100) NOT NULL,
    pref_value LONGTEXT NOT NULL,
    pref_type VARCHAR(30) NOT NULL DEFAULT 'string',
    is_shared TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_admin_preferences_admin_key (admin_user_id, pref_key),
    KEY idx_admin_preferences_key (pref_key),
    CONSTRAINT fk_admin_preferences_admin_user
        FOREIGN KEY (admin_user_id) REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='관리자 설정';
