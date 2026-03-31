CREATE TABLE bookings (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    booking_no VARCHAR(50) NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    booking_type VARCHAR(20) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    payment_status VARCHAR(30) NOT NULL DEFAULT 'unpaid',
    currency CHAR(3) NOT NULL DEFAULT 'KRW',
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    paid_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    booked_at DATETIME(3) NULL,
    cancelled_at DATETIME(3) NULL,
    memo VARCHAR(500) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_bookings_booking_no (booking_no),
    KEY idx_bookings_user_status (user_id, status),
    KEY idx_bookings_booked_at (booked_at),
    CONSTRAINT fk_bookings_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='예약 정보를 저장하는 테이블';

CREATE TABLE booking_items (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    booking_id BIGINT UNSIGNED NOT NULL,
    item_no INT NOT NULL DEFAULT 1,
    booking_type VARCHAR(20) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    product_code VARCHAR(60) NULL,
    supplier_name VARCHAR(120) NULL,
    service_start_date DATE NULL,
    service_end_date DATE NULL,
    quantity INT UNSIGNED NOT NULL DEFAULT 1,
    unit_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    currency CHAR(3) NOT NULL DEFAULT 'KRW',
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_booking_items_booking_no (booking_id, item_no),
    KEY idx_booking_items_booking_id (booking_id),
    KEY idx_booking_items_booking_type (booking_id, booking_type),
    CONSTRAINT fk_booking_items_booking
        FOREIGN KEY (booking_id) REFERENCES bookings (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='예약 상품 항목을 저장하는 테이블';

CREATE TABLE booking_passengers (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    booking_id BIGINT UNSIGNED NOT NULL,
    booking_item_id BIGINT UNSIGNED NULL,
    user_id VARCHAR(100) NULL,
    passenger_no INT NOT NULL DEFAULT 1,
    passenger_name VARCHAR(100) NOT NULL,
    passenger_type VARCHAR(20) NULL,
    phone VARCHAR(30) NULL,
    email VARCHAR(255) NULL,
    birth_date DATE NULL,
    gender CHAR(1) NULL,
    is_primary TINYINT(1) NOT NULL DEFAULT 0,
    is_member TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_booking_passengers_booking_no (booking_id, passenger_no),
    KEY idx_booking_passengers_booking_id (booking_id),
    KEY idx_booking_passengers_booking_item_id (booking_item_id),
    KEY idx_booking_passengers_user_id (user_id),
    CONSTRAINT fk_booking_passengers_booking
        FOREIGN KEY (booking_id) REFERENCES bookings (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_booking_passengers_booking_item
        FOREIGN KEY (booking_item_id) REFERENCES booking_items (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_booking_passengers_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='예약 탑승자와 이용자 정보를 저장하는 테이블';

CREATE TABLE payment_attempts (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    booking_id BIGINT UNSIGNED NOT NULL,
    attempt_no INT NOT NULL DEFAULT 1,
    payment_provider VARCHAR(30) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    requested_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    approved_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    currency CHAR(3) NOT NULL DEFAULT 'KRW',
    requested_at DATETIME(3) NULL,
    completed_at DATETIME(3) NULL,
    failure_code VARCHAR(60) NULL,
    failure_message VARCHAR(255) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_payment_attempts_booking_no (booking_id, attempt_no),
    KEY idx_payment_attempts_booking_status (booking_id, status),
    CONSTRAINT fk_payment_attempts_booking
        FOREIGN KEY (booking_id) REFERENCES bookings (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='결제 시도 이력을 저장하는 테이블';

CREATE TABLE payment_transactions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    payment_attempt_id BIGINT UNSIGNED NOT NULL,
    transaction_no VARCHAR(60) NOT NULL,
    transaction_type VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    currency CHAR(3) NOT NULL DEFAULT 'KRW',
    external_transaction_id VARCHAR(100) NULL,
    processed_at DATETIME(3) NULL,
    approved_at DATETIME(3) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_payment_transactions_transaction_no (transaction_no),
    KEY idx_payment_transactions_attempt_status (payment_attempt_id, status),
    CONSTRAINT fk_payment_transactions_attempt
        FOREIGN KEY (payment_attempt_id) REFERENCES payment_attempts (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='결제 거래 내역을 저장하는 테이블';

CREATE TABLE payment_refunds (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    payment_transaction_id BIGINT UNSIGNED NOT NULL,
    refund_no VARCHAR(60) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'requested',
    refund_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    currency CHAR(3) NOT NULL DEFAULT 'KRW',
    reason VARCHAR(255) NULL,
    requested_at DATETIME(3) NULL,
    completed_at DATETIME(3) NULL,
    external_refund_id VARCHAR(100) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_payment_refunds_refund_no (refund_no),
    KEY idx_payment_refunds_transaction_status (payment_transaction_id, status),
    CONSTRAINT fk_payment_refunds_transaction
        FOREIGN KEY (payment_transaction_id) REFERENCES payment_transactions (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='결제 환불 내역을 저장하는 테이블';

CREATE TABLE travel_events (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    booking_id BIGINT UNSIGNED NOT NULL,
    booking_item_id BIGINT UNSIGNED NULL,
    booking_passenger_id BIGINT UNSIGNED NULL,
    user_id VARCHAR(100) NOT NULL,
    day_id VARCHAR(60) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NULL,
    title VARCHAR(255) NOT NULL,
    activity_label VARCHAR(255) NOT NULL,
    google_map_url VARCHAR(500) NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'reserved',
    booking_type VARCHAR(20) NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    KEY idx_travel_events_user_date (user_id, event_date),
    KEY idx_travel_events_booking_day (booking_id, day_id),
    KEY idx_travel_events_status (status),
    CONSTRAINT fk_travel_events_booking
        FOREIGN KEY (booking_id) REFERENCES bookings (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_travel_events_booking_item
        FOREIGN KEY (booking_item_id) REFERENCES booking_items (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_travel_events_booking_passenger
        FOREIGN KEY (booking_passenger_id) REFERENCES booking_passengers (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_travel_events_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='여행 일정과 이용 현황을 저장하는 테이블';

CREATE TABLE coupons (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    coupon_code VARCHAR(60) NOT NULL,
    coupon_name VARCHAR(100) NOT NULL,
    coupon_type VARCHAR(30) NOT NULL,
    discount_value DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    minimum_order_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    maximum_discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    valid_from DATE NULL,
    valid_to DATE NULL,
    issue_limit INT UNSIGNED NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    description VARCHAR(500) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_coupons_coupon_code (coupon_code),
    KEY idx_coupons_type_active (coupon_type, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='쿠폰 마스터 정보를 저장하는 테이블';

CREATE TABLE user_coupons (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id VARCHAR(100) NOT NULL,
    coupon_id BIGINT UNSIGNED NOT NULL,
    booking_id BIGINT UNSIGNED NULL,
    coupon_status VARCHAR(30) NOT NULL DEFAULT 'issued',
    issued_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    used_at DATETIME(3) NULL,
    expired_at DATETIME(3) NULL,
    memo VARCHAR(500) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_user_coupons_user_coupon (user_id, coupon_id),
    KEY idx_user_coupons_user_status (user_id, coupon_status),
    KEY idx_user_coupons_coupon_id (coupon_id),
    KEY idx_user_coupons_booking_id (booking_id),
    CONSTRAINT fk_user_coupons_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_user_coupons_coupon
        FOREIGN KEY (coupon_id) REFERENCES coupons (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_user_coupons_booking
        FOREIGN KEY (booking_id) REFERENCES bookings (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='사용자에게 발급된 쿠폰을 저장하는 테이블';

CREATE TABLE point_ledger (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id VARCHAR(100) NOT NULL,
    booking_id BIGINT UNSIGNED NULL,
    related_type VARCHAR(30) NOT NULL,
    related_id BIGINT UNSIGNED NULL,
    point_type VARCHAR(20) NOT NULL,
    point_amount INT NOT NULL,
    balance_after INT NOT NULL,
    reason VARCHAR(255) NOT NULL,
    occurred_at DATETIME(3) NOT NULL,
    expires_at DATETIME(3) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    KEY idx_point_ledger_user_occurred (user_id, occurred_at),
    KEY idx_point_ledger_related (related_type, related_id),
    KEY idx_point_ledger_booking_id (booking_id),
    CONSTRAINT fk_point_ledger_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_point_ledger_booking
        FOREIGN KEY (booking_id) REFERENCES bookings (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='포인트 적립과 사용 내역을 저장하는 테이블';

CREATE TABLE membership_plans (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    plan_code VARCHAR(60) NOT NULL,
    plan_name VARCHAR(100) NOT NULL,
    tier_level INT NOT NULL DEFAULT 0,
    monthly_fee DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    annual_fee DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    description VARCHAR(500) NULL,
    benefit_summary VARCHAR(500) NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_membership_plans_plan_code (plan_code),
    KEY idx_membership_plans_active_tier (is_active, tier_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='멤버십 요금제 정보를 저장하는 테이블';

CREATE TABLE membership_plan_benefits (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    membership_plan_id BIGINT UNSIGNED NOT NULL,
    benefit_code VARCHAR(60) NOT NULL,
    benefit_name VARCHAR(100) NOT NULL,
    benefit_type VARCHAR(30) NOT NULL,
    benefit_value VARCHAR(255) NULL,
    benefit_description VARCHAR(500) NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_membership_plan_benefits_plan_code (membership_plan_id, benefit_code),
    KEY idx_membership_plan_benefits_plan_active_sort (membership_plan_id, is_active, sort_order),
    CONSTRAINT fk_membership_plan_benefits_plan
        FOREIGN KEY (membership_plan_id) REFERENCES membership_plans (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='멤버십 혜택 상세를 저장하는 테이블';
