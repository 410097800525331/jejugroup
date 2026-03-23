CREATE TABLE IF NOT EXISTS flight_routes (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    route_code VARCHAR(60) NOT NULL,
    airline_code VARCHAR(20) NULL,
    departure_airport_code CHAR(3) NOT NULL,
    arrival_airport_code CHAR(3) NOT NULL,
    route_name VARCHAR(200) NOT NULL,
    route_type VARCHAR(30) NOT NULL DEFAULT 'domestic',
    distance_km INT UNSIGNED NULL,
    base_duration_minutes INT UNSIGNED NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_flight_routes_route_code (route_code),
    KEY idx_flight_routes_airport_pair (departure_airport_code, arrival_airport_code, is_active),
    KEY idx_flight_routes_route_type (route_type, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='항공 노선 마스터';

CREATE TABLE IF NOT EXISTS flight_schedules (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    flight_route_id BIGINT UNSIGNED NOT NULL,
    schedule_code VARCHAR(60) NOT NULL,
    flight_no VARCHAR(20) NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    operating_days VARCHAR(50) NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE NULL,
    aircraft_code VARCHAR(30) NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_flight_schedules_id_route (id, flight_route_id),
    UNIQUE KEY uk_flight_schedules_schedule_code (schedule_code),
    UNIQUE KEY uk_flight_schedules_route_no_period (flight_route_id, flight_no, effective_from),
    KEY idx_flight_schedules_route_active (flight_route_id, is_active, status),
    KEY idx_flight_schedules_effective_period (effective_from, effective_to),
    CONSTRAINT fk_flight_schedules_route
        FOREIGN KEY (flight_route_id) REFERENCES flight_routes (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='항공 운항 일정';

CREATE TABLE IF NOT EXISTS flight_fare_policies (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    flight_route_id BIGINT UNSIGNED NOT NULL,
    flight_schedule_id BIGINT UNSIGNED NULL,
    policy_code VARCHAR(60) NOT NULL,
    policy_name VARCHAR(200) NOT NULL,
    fare_class VARCHAR(30) NOT NULL DEFAULT 'economy',
    fare_type VARCHAR(30) NOT NULL DEFAULT 'standard',
    currency CHAR(3) NOT NULL DEFAULT 'KRW',
    base_fare DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    change_fee DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    refund_fee DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    min_advance_hours INT UNSIGNED NULL,
    max_advance_hours INT UNSIGNED NULL,
    effective_from DATETIME(3) NULL,
    effective_to DATETIME(3) NULL,
    priority INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_flight_fare_policies_policy_code (policy_code),
    KEY idx_flight_fare_policies_route_schedule (flight_route_id, flight_schedule_id),
    KEY idx_flight_fare_policies_schedule_route (flight_schedule_id, flight_route_id),
    KEY idx_flight_fare_policies_active_period (is_active, effective_from, effective_to, priority),
    KEY idx_flight_fare_policies_fare_class (fare_class, fare_type),
    CONSTRAINT fk_flight_fare_policies_route
        FOREIGN KEY (flight_route_id) REFERENCES flight_routes (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_flight_fare_policies_schedule_route
        FOREIGN KEY (flight_schedule_id, flight_route_id) REFERENCES flight_schedules (id, flight_route_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='항공 운임 정책';

CREATE TABLE IF NOT EXISTS flight_seat_inventories (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    flight_schedule_id BIGINT UNSIGNED NOT NULL,
    inventory_date DATE NOT NULL,
    cabin_class VARCHAR(30) NOT NULL DEFAULT 'economy',
    total_seats INT UNSIGNED NOT NULL DEFAULT 0,
    reserved_seats INT UNSIGNED NOT NULL DEFAULT 0,
    sold_seats INT UNSIGNED NOT NULL DEFAULT 0,
    available_seats INT UNSIGNED NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    source_updated_at DATETIME(3) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_flight_seat_inventories_schedule_date_class (flight_schedule_id, inventory_date, cabin_class),
    KEY idx_flight_seat_inventories_date_status (inventory_date, status),
    KEY idx_flight_seat_inventories_schedule_status (flight_schedule_id, status),
    CONSTRAINT fk_flight_seat_inventories_schedule
        FOREIGN KEY (flight_schedule_id) REFERENCES flight_schedules (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='항공 좌석 재고';

CREATE TABLE IF NOT EXISTS rental_locations (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    location_code VARCHAR(60) NOT NULL,
    location_name VARCHAR(200) NOT NULL,
    location_type VARCHAR(30) NOT NULL DEFAULT 'airport',
    airport_code CHAR(3) NULL,
    region_name VARCHAR(100) NULL,
    address VARCHAR(255) NULL,
    phone VARCHAR(30) NULL,
    operating_hours VARCHAR(100) NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_rental_locations_location_code (location_code),
    KEY idx_rental_locations_type_active (location_type, is_active),
    KEY idx_rental_locations_airport_code (airport_code, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='렌터카 지점';

CREATE TABLE IF NOT EXISTS rental_vehicle_classes (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    class_code VARCHAR(60) NOT NULL,
    class_name VARCHAR(200) NOT NULL,
    vehicle_category VARCHAR(30) NOT NULL DEFAULT 'compact',
    seating_capacity INT UNSIGNED NOT NULL DEFAULT 4,
    transmission_type VARCHAR(20) NULL,
    fuel_type VARCHAR(20) NULL,
    luggage_capacity INT UNSIGNED NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_rental_vehicle_classes_class_code (class_code),
    KEY idx_rental_vehicle_classes_category_active (vehicle_category, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='렌터카 차량 등급';

CREATE TABLE IF NOT EXISTS rental_vehicles (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    rental_location_id BIGINT UNSIGNED NOT NULL,
    rental_vehicle_class_id BIGINT UNSIGNED NOT NULL,
    vehicle_code VARCHAR(60) NOT NULL,
    vehicle_name VARCHAR(120) NOT NULL,
    manufacturer VARCHAR(100) NULL,
    model_name VARCHAR(100) NULL,
    model_year SMALLINT UNSIGNED NULL,
    license_plate VARCHAR(30) NOT NULL,
    vin VARCHAR(50) NULL,
    color VARCHAR(30) NULL,
    odometer_km INT UNSIGNED NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'available',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_rental_vehicles_vehicle_code (vehicle_code),
    UNIQUE KEY uk_rental_vehicles_license_plate (license_plate),
    KEY idx_rental_vehicles_location_status (rental_location_id, status),
    KEY idx_rental_vehicles_class_status (rental_vehicle_class_id, status),
    CONSTRAINT fk_rental_vehicles_location
        FOREIGN KEY (rental_location_id) REFERENCES rental_locations (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_rental_vehicles_class
        FOREIGN KEY (rental_vehicle_class_id) REFERENCES rental_vehicle_classes (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='렌터카 차량 마스터';

CREATE TABLE IF NOT EXISTS rental_rate_policies (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    rental_location_id BIGINT UNSIGNED NOT NULL,
    rental_vehicle_class_id BIGINT UNSIGNED NOT NULL,
    policy_code VARCHAR(60) NOT NULL,
    policy_name VARCHAR(200) NOT NULL,
    rate_type VARCHAR(30) NOT NULL DEFAULT 'daily',
    currency CHAR(3) NOT NULL DEFAULT 'KRW',
    daily_rate DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    hourly_rate DECIMAL(12, 2) NULL,
    deposit_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    insurance_fee DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    mileage_limit_km INT UNSIGNED NULL,
    is_unlimited_mileage TINYINT(1) NOT NULL DEFAULT 0,
    effective_from DATE NULL,
    effective_to DATE NULL,
    priority INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_rental_rate_policies_policy_code (policy_code),
    KEY idx_rental_rate_policies_location_class (rental_location_id, rental_vehicle_class_id),
    KEY idx_rental_rate_policies_active_period (is_active, effective_from, effective_to, priority),
    KEY idx_rental_rate_policies_rate_type (rate_type, currency),
    CONSTRAINT fk_rental_rate_policies_location
        FOREIGN KEY (rental_location_id) REFERENCES rental_locations (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_rental_rate_policies_class
        FOREIGN KEY (rental_vehicle_class_id) REFERENCES rental_vehicle_classes (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='렌터카 요금 정책';

CREATE TABLE IF NOT EXISTS rental_vehicle_inventories (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    rental_vehicle_id BIGINT UNSIGNED NOT NULL,
    inventory_date DATE NOT NULL,
    inventory_status VARCHAR(30) NOT NULL DEFAULT 'available',
    is_rentable TINYINT(1) NOT NULL DEFAULT 1,
    reserved_from DATETIME(3) NULL,
    reserved_to DATETIME(3) NULL,
    blocked_reason VARCHAR(255) NULL,
    mileage_snapshot_km INT UNSIGNED NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_rental_vehicle_inventories_vehicle_date (rental_vehicle_id, inventory_date),
    KEY idx_rental_vehicle_inventories_date_status (inventory_date, inventory_status),
    KEY idx_rental_vehicle_inventories_vehicle_status (rental_vehicle_id, inventory_status),
    CONSTRAINT fk_rental_vehicle_inventories_vehicle
        FOREIGN KEY (rental_vehicle_id) REFERENCES rental_vehicles (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='렌터카 차량 재고';
