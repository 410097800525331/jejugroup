-- V20 schema refactor: hotel-prefixed stay tables and admin-facing support masters
-- Fresh replay target: keep bookings-common/payment-common intact, then normalize domain names.

RENAME TABLE
    properties TO hotel_properties,
    property_room_types TO hotel_room_types,
    property_benefits TO hotel_benefits,
    property_display_overrides TO hotel_display_overrides,
    property_tags TO hotel_tags,
    inventory_stocks TO hotel_inventory_stocks,
    inventory_adjustments TO hotel_inventory_adjustments,
    price_policies TO hotel_price_policies,
    rental_locations TO rentcar_branches,
    rental_vehicle_classes TO rentcar_vehicle_models,
    rental_vehicles TO rentcar_products,
    rental_rate_policies TO rentcar_rate_policies,
    rental_vehicle_inventories TO rentcar_inventory_stocks,
    flight_seat_inventories TO flight_inventory_stocks;

ALTER TABLE hotel_properties COMMENT='front/admin/pages/lodging.html stay tab - hotel/property master';
ALTER TABLE hotel_room_types COMMENT='front/admin/pages/lodging.html stay tab - room types';
ALTER TABLE hotel_benefits COMMENT='front/admin/pages/lodging.html stay tab - property benefits';
ALTER TABLE hotel_display_overrides COMMENT='front/admin/pages/lodging.html stay tab - display overrides';
ALTER TABLE hotel_tags COMMENT='front/admin/pages/lodging.html stay tab - property tags';
ALTER TABLE hotel_inventory_stocks COMMENT='front/admin/pages/lodging.html stay tab - room inventory';
ALTER TABLE hotel_inventory_adjustments COMMENT='front/admin/pages/lodging.html stay tab - room inventory adjustments';
ALTER TABLE hotel_price_policies COMMENT='front/admin/pages/lodging.html stay tab - price policies';

ALTER TABLE rentcar_branches COMMENT='front/admin/pages/reservations.html rentcar tab - branch master';
ALTER TABLE rentcar_vehicle_models COMMENT='front/admin/pages/reservations.html rentcar tab - vehicle models';
ALTER TABLE rentcar_products COMMENT='front/admin/pages/reservations.html rentcar tab - rentcar products';
ALTER TABLE rentcar_rate_policies COMMENT='front/admin/pages/reservations.html rentcar tab - rentcar rate policies';
ALTER TABLE rentcar_inventory_stocks COMMENT='front/admin/pages/reservations.html rentcar tab - rentcar inventory';

ALTER TABLE flight_routes COMMENT='front/admin/pages/reservations.html flight tab - flight route master';
ALTER TABLE flight_schedules COMMENT='front/admin/pages/reservations.html flight tab - flight schedules';
ALTER TABLE flight_fare_policies COMMENT='front/admin/pages/reservations.html flight tab - flight fare policies';
ALTER TABLE flight_inventory_stocks COMMENT='front/admin/pages/reservations.html flight tab - flight seat inventory';

ALTER TABLE hotel_room_types
    DROP FOREIGN KEY fk_property_room_types_property,
    CHANGE COLUMN property_id hotel_property_id BIGINT UNSIGNED NOT NULL;

ALTER TABLE hotel_room_types
    ADD CONSTRAINT fk_hotel_room_types_hotel_property
        FOREIGN KEY (hotel_property_id) REFERENCES hotel_properties (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE;

ALTER TABLE hotel_benefits
    DROP FOREIGN KEY fk_property_benefits_property,
    CHANGE COLUMN property_id hotel_property_id BIGINT UNSIGNED NOT NULL;

ALTER TABLE hotel_benefits
    ADD CONSTRAINT fk_hotel_benefits_hotel_property
        FOREIGN KEY (hotel_property_id) REFERENCES hotel_properties (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE;

ALTER TABLE hotel_display_overrides
    DROP FOREIGN KEY fk_property_display_overrides_property,
    CHANGE COLUMN property_id hotel_property_id BIGINT UNSIGNED NOT NULL;

ALTER TABLE hotel_display_overrides
    ADD CONSTRAINT fk_hotel_display_overrides_hotel_property
        FOREIGN KEY (hotel_property_id) REFERENCES hotel_properties (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE;

ALTER TABLE hotel_tags
    DROP FOREIGN KEY fk_property_tags_property,
    CHANGE COLUMN property_id hotel_property_id BIGINT UNSIGNED NOT NULL;

ALTER TABLE hotel_tags
    ADD CONSTRAINT fk_hotel_tags_hotel_property
        FOREIGN KEY (hotel_property_id) REFERENCES hotel_properties (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE;

ALTER TABLE hotel_inventory_stocks
    DROP FOREIGN KEY fk_inventory_stocks_room_type,
    CHANGE COLUMN property_room_type_id hotel_room_type_id BIGINT UNSIGNED NOT NULL;

ALTER TABLE hotel_inventory_stocks
    ADD CONSTRAINT fk_hotel_inventory_stocks_hotel_room_type
        FOREIGN KEY (hotel_room_type_id) REFERENCES hotel_room_types (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE;

ALTER TABLE hotel_inventory_adjustments
    DROP FOREIGN KEY fk_inventory_adjustments_stock,
    DROP FOREIGN KEY fk_inventory_adjustments_user,
    CHANGE COLUMN inventory_stock_id hotel_inventory_stock_id BIGINT UNSIGNED NOT NULL;

ALTER TABLE hotel_inventory_adjustments
    ADD CONSTRAINT fk_hotel_inventory_adjustments_hotel_inventory_stock
        FOREIGN KEY (hotel_inventory_stock_id) REFERENCES hotel_inventory_stocks (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    ADD CONSTRAINT fk_hotel_inventory_adjustments_user
        FOREIGN KEY (adjusted_by_user_id) REFERENCES users (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE;

ALTER TABLE hotel_price_policies
    DROP FOREIGN KEY fk_price_policies_property,
    DROP FOREIGN KEY fk_price_policies_room_type_same_property,
    CHANGE COLUMN property_id hotel_property_id BIGINT UNSIGNED NOT NULL,
    CHANGE COLUMN property_room_type_id hotel_room_type_id BIGINT UNSIGNED NULL;

ALTER TABLE hotel_price_policies
    ADD CONSTRAINT fk_hotel_price_policies_hotel_property
        FOREIGN KEY (hotel_property_id) REFERENCES hotel_properties (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    ADD CONSTRAINT fk_hotel_price_policies_hotel_room_type
        FOREIGN KEY (hotel_room_type_id) REFERENCES hotel_room_types (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    ADD CONSTRAINT fk_hotel_price_policies_room_type_same_property
        FOREIGN KEY (hotel_property_id, hotel_room_type_id) REFERENCES hotel_room_types (hotel_property_id, id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE;

ALTER TABLE rentcar_products
    DROP FOREIGN KEY fk_rental_vehicles_location,
    DROP FOREIGN KEY fk_rental_vehicles_class,
    CHANGE COLUMN rental_location_id rentcar_branch_id BIGINT UNSIGNED NOT NULL,
    CHANGE COLUMN rental_vehicle_class_id rentcar_vehicle_model_id BIGINT UNSIGNED NOT NULL;

ALTER TABLE rentcar_products
    ADD CONSTRAINT fk_rentcar_products_rentcar_branch
        FOREIGN KEY (rentcar_branch_id) REFERENCES rentcar_branches (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    ADD CONSTRAINT fk_rentcar_products_rentcar_vehicle_model
        FOREIGN KEY (rentcar_vehicle_model_id) REFERENCES rentcar_vehicle_models (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE;

ALTER TABLE rentcar_rate_policies
    DROP FOREIGN KEY fk_rental_rate_policies_location,
    DROP FOREIGN KEY fk_rental_rate_policies_class,
    CHANGE COLUMN rental_location_id rentcar_branch_id BIGINT UNSIGNED NOT NULL,
    CHANGE COLUMN rental_vehicle_class_id rentcar_vehicle_model_id BIGINT UNSIGNED NOT NULL;

ALTER TABLE rentcar_rate_policies
    ADD CONSTRAINT fk_rentcar_rate_policies_rentcar_branch
        FOREIGN KEY (rentcar_branch_id) REFERENCES rentcar_branches (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    ADD CONSTRAINT fk_rentcar_rate_policies_rentcar_vehicle_model
        FOREIGN KEY (rentcar_vehicle_model_id) REFERENCES rentcar_vehicle_models (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE;

ALTER TABLE rentcar_inventory_stocks
    DROP FOREIGN KEY fk_rental_vehicle_inventories_vehicle,
    CHANGE COLUMN rental_vehicle_id rentcar_product_id BIGINT UNSIGNED NOT NULL;

ALTER TABLE rentcar_inventory_stocks
    ADD CONSTRAINT fk_rentcar_inventory_stocks_rentcar_product
        FOREIGN KEY (rentcar_product_id) REFERENCES rentcar_products (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE;

ALTER TABLE flight_inventory_stocks
    DROP FOREIGN KEY fk_flight_seat_inventories_schedule;

ALTER TABLE flight_inventory_stocks
    ADD CONSTRAINT fk_flight_inventory_stocks_schedule
        FOREIGN KEY (flight_schedule_id) REFERENCES flight_schedules (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS flight_products (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    flight_route_id BIGINT UNSIGNED NOT NULL,
    product_code VARCHAR(60) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    flight_no VARCHAR(20) NULL,
    cabin_class VARCHAR(30) NOT NULL DEFAULT 'economy',
    fare_class VARCHAR(30) NOT NULL DEFAULT 'standard',
    departure_time TIME NULL,
    arrival_time TIME NULL,
    operating_days VARCHAR(50) NULL,
    effective_from DATE NULL,
    effective_to DATE NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_flight_products_product_code (product_code),
    KEY idx_flight_products_route_active (flight_route_id, is_active),
    KEY idx_flight_products_fare_class (fare_class, cabin_class),
    CONSTRAINT fk_flight_products_route
        FOREIGN KEY (flight_route_id) REFERENCES flight_routes (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='front/admin/pages/reservations.html flight tab - flight product master';

CREATE TABLE IF NOT EXISTS special_products (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    product_code VARCHAR(60) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    product_type VARCHAR(30) NOT NULL DEFAULT 'special',
    channel_code VARCHAR(30) NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_special_products_product_code (product_code),
    KEY idx_special_products_type_active (product_type, is_active),
    KEY idx_special_products_channel_active (channel_code, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='front/admin/pages/cms.html special tab - special product master';

CREATE TABLE IF NOT EXISTS special_inventory_stocks (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    special_product_id BIGINT UNSIGNED NOT NULL,
    inventory_date DATE NOT NULL,
    total_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    reserved_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    sold_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    available_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    source_updated_at DATETIME(3) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_special_inventory_stocks_product_date (special_product_id, inventory_date),
    KEY idx_special_inventory_stocks_date_status (inventory_date, status),
    CONSTRAINT fk_special_inventory_stocks_special_product
        FOREIGN KEY (special_product_id) REFERENCES special_products (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='front/admin/pages/cms.html special tab - special inventory';

CREATE TABLE IF NOT EXISTS usim_products (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    product_code VARCHAR(60) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    carrier_name VARCHAR(80) NULL,
    plan_type VARCHAR(30) NULL,
    data_amount_gb DECIMAL(10,2) NULL,
    valid_days INT UNSIGNED NULL,
    sale_price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_usim_products_product_code (product_code),
    KEY idx_usim_products_carrier_active (carrier_name, is_active),
    KEY idx_usim_products_plan_active (plan_type, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='front/admin/pages/cms.html usim tab - USIM product master';

CREATE TABLE IF NOT EXISTS usim_inventory_stocks (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    usim_product_id BIGINT UNSIGNED NOT NULL,
    inventory_date DATE NOT NULL,
    total_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    reserved_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    sold_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    available_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    source_updated_at DATETIME(3) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_usim_inventory_stocks_product_date (usim_product_id, inventory_date),
    KEY idx_usim_inventory_stocks_date_status (inventory_date, status),
    CONSTRAINT fk_usim_inventory_stocks_usim_product
        FOREIGN KEY (usim_product_id) REFERENCES usim_products (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='front/admin/pages/cms.html usim tab - USIM inventory';

CREATE TABLE IF NOT EXISTS admin_role_scopes (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    role_code VARCHAR(50) NOT NULL,
    scope_code VARCHAR(80) NOT NULL,
    scope_name VARCHAR(120) NOT NULL,
    domain_code VARCHAR(30) NOT NULL DEFAULT 'admin',
    permission_level VARCHAR(30) NOT NULL DEFAULT 'read',
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_admin_role_scopes_role_scope (role_code, scope_code),
    KEY idx_admin_role_scopes_domain_active (domain_code, is_active),
    KEY idx_admin_role_scopes_scope_active (scope_code, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='front/admin/pages/members.html permissions tab - admin role scope mapping';

CREATE TABLE IF NOT EXISTS dashboard_metric_snapshots (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    snapshot_date DATE NOT NULL,
    metric_code VARCHAR(80) NOT NULL,
    metric_name VARCHAR(120) NOT NULL,
    metric_domain VARCHAR(30) NOT NULL DEFAULT 'all',
    metric_value DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    metric_unit VARCHAR(20) NULL,
    source_page VARCHAR(120) NOT NULL DEFAULT 'front/admin/pages/dashboard.html',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_dashboard_metric_snapshots_snapshot_metric_domain (snapshot_date, metric_code, metric_domain),
    KEY idx_dashboard_metric_snapshots_domain_date (metric_domain, snapshot_date),
    KEY idx_dashboard_metric_snapshots_metric_active (metric_code, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='front/admin/pages/dashboard.html KPI snapshot';
