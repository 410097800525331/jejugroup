-- V19 flight / rental inventory seed
-- repeat-safe and source-bound to front route and lodging inventory rows

DELETE FROM flight_routes
WHERE route_code IN (
    'gmp-cju-7c',
    'icn-bkk-7c',
    'icn-kix-7c'
);

DELETE FROM rental_rate_policies
WHERE policy_code IN (
    'jeju-ioniq5-long-range-standard',
    'jeju-carnival-9-standard'
);

DELETE FROM rental_vehicles
WHERE vehicle_code IN (
    'rent-ioniq5-long-range-001',
    'rent-carnival-9-001'
);

INSERT INTO flight_routes (
    route_code,
    airline_code,
    departure_airport_code,
    arrival_airport_code,
    route_name,
    route_type,
    distance_km,
    base_duration_minutes,
    is_active
)
VALUES
    ('gmp-cju', NULL, 'GMP', 'CJU', '서울/김포 GMP → 제주 CJU', 'domestic', NULL, NULL, 1),
    ('icn-bkk', NULL, 'ICN', 'BKK', '인천 ICN → 방콕 BKK', 'international', NULL, NULL, 1),
    ('icn-kix', NULL, 'ICN', 'KIX', '인천 ICN → 오사카 KIX', 'international', NULL, NULL, 1)
ON DUPLICATE KEY UPDATE
    airline_code = VALUES(airline_code),
    departure_airport_code = VALUES(departure_airport_code),
    arrival_airport_code = VALUES(arrival_airport_code),
    route_name = VALUES(route_name),
    route_type = VALUES(route_type),
    distance_km = VALUES(distance_km),
    base_duration_minutes = VALUES(base_duration_minutes),
    is_active = VALUES(is_active);

INSERT INTO rental_locations (
    location_code,
    location_name,
    location_type,
    airport_code,
    region_name,
    address,
    phone,
    operating_hours,
    is_active
)
VALUES
    ('cju-airport', '제주공항', 'airport', 'CJU', '제주', NULL, NULL, NULL, 1)
ON DUPLICATE KEY UPDATE
    location_name = VALUES(location_name),
    location_type = VALUES(location_type),
    airport_code = VALUES(airport_code),
    region_name = VALUES(region_name),
    address = VALUES(address),
    phone = VALUES(phone),
    operating_hours = VALUES(operating_hours),
    is_active = VALUES(is_active);

INSERT INTO rental_vehicle_classes (
    class_code,
    class_name,
    vehicle_category,
    seating_capacity,
    transmission_type,
    fuel_type,
    luggage_capacity,
    is_active
)
VALUES
    ('ioniq-5-long-range', '아이오닉 5 롱레인지', 'electric', 5, NULL, 'electric', NULL, 1),
    ('carnival-9', '카니발 9인승', 'van', 9, NULL, NULL, NULL, 1)
ON DUPLICATE KEY UPDATE
    class_name = VALUES(class_name),
    vehicle_category = VALUES(vehicle_category),
    seating_capacity = VALUES(seating_capacity),
    transmission_type = VALUES(transmission_type),
    fuel_type = VALUES(fuel_type),
    luggage_capacity = VALUES(luggage_capacity),
    is_active = VALUES(is_active);

INSERT INTO rental_vehicles (
    rental_location_id,
    rental_vehicle_class_id,
    vehicle_code,
    vehicle_name,
    manufacturer,
    model_name,
    model_year,
    license_plate,
    vin,
    color,
    odometer_km,
    status,
    is_active
)
SELECT
    l.id,
    c.id,
    src.vehicle_code,
    src.vehicle_name,
    src.manufacturer,
    src.model_name,
    src.model_year,
    src.license_plate,
    src.vin,
    src.color,
    src.odometer_km,
    src.status,
    src.is_active
FROM (
    SELECT 'cju-airport' AS location_code, 'ioniq-5-long-range' AS class_code, 'rent-ioniq5-long-range' AS vehicle_code, '스타렌터카 - 아이오닉 5 롱레인지' AS vehicle_name, NULL AS manufacturer, '아이오닉 5 롱레인지' AS model_name, NULL AS model_year, 'SEED-IONIQ5-001' AS license_plate, NULL AS vin, NULL AS color, 0 AS odometer_km, 'available' AS status, 1 AS is_active
    UNION ALL SELECT 'cju-airport', 'carnival-9', 'rent-carnival-9', '무지개렌터카 - 카니발 9인승', NULL, '카니발 9인승', NULL, 'SEED-CARNIVAL-001', NULL, NULL, 0, 'available', 1
) AS src
JOIN rental_locations l ON l.location_code = src.location_code
JOIN rental_vehicle_classes c ON c.class_code = src.class_code
ON DUPLICATE KEY UPDATE
    rental_location_id = VALUES(rental_location_id),
    rental_vehicle_class_id = VALUES(rental_vehicle_class_id),
    vehicle_name = VALUES(vehicle_name),
    manufacturer = VALUES(manufacturer),
    model_name = VALUES(model_name),
    model_year = VALUES(model_year),
    license_plate = VALUES(license_plate),
    vin = VALUES(vin),
    color = VALUES(color),
    odometer_km = VALUES(odometer_km),
    status = VALUES(status),
    is_active = VALUES(is_active);

INSERT INTO rental_rate_policies (
    rental_location_id,
    rental_vehicle_class_id,
    policy_code,
    policy_name,
    rate_type,
    currency,
    daily_rate,
    hourly_rate,
    deposit_amount,
    insurance_fee,
    mileage_limit_km,
    is_unlimited_mileage,
    effective_from,
    effective_to,
    priority,
    is_active
)
SELECT
    l.id,
    c.id,
    src.policy_code,
    src.policy_name,
    src.rate_type,
    src.currency,
    src.daily_rate,
    src.hourly_rate,
    src.deposit_amount,
    src.insurance_fee,
    src.mileage_limit_km,
    src.is_unlimited_mileage,
    src.effective_from,
    src.effective_to,
    src.priority,
    src.is_active
FROM (
    SELECT 'cju-airport' AS location_code, 'ioniq-5-long-range' AS class_code, 'rent-ioniq5-long-range-policy' AS policy_code, '아이오닉 5 롱레인지 표준 요금' AS policy_name, 'daily' AS rate_type, 'KRW' AS currency, 95000.00 AS daily_rate, NULL AS hourly_rate, 0.00 AS deposit_amount, 0.00 AS insurance_fee, NULL AS mileage_limit_km, 0 AS is_unlimited_mileage, NULL AS effective_from, NULL AS effective_to, 1 AS priority, 1 AS is_active
    UNION ALL SELECT 'cju-airport', 'carnival-9', 'rent-carnival-9-policy', '카니발 9인승 표준 요금', 'daily', 'KRW', 155000.00, NULL, 0.00, 0.00, NULL, 0, NULL, NULL, 1, 1
) AS src
JOIN rental_locations l ON l.location_code = src.location_code
JOIN rental_vehicle_classes c ON c.class_code = src.class_code
ON DUPLICATE KEY UPDATE
    policy_name = VALUES(policy_name),
    rate_type = VALUES(rate_type),
    currency = VALUES(currency),
    daily_rate = VALUES(daily_rate),
    hourly_rate = VALUES(hourly_rate),
    deposit_amount = VALUES(deposit_amount),
    insurance_fee = VALUES(insurance_fee),
    mileage_limit_km = VALUES(mileage_limit_km),
    is_unlimited_mileage = VALUES(is_unlimited_mileage),
    effective_from = VALUES(effective_from),
    effective_to = VALUES(effective_to),
    priority = VALUES(priority),
    is_active = VALUES(is_active);

INSERT INTO rental_vehicle_inventories (
    rental_vehicle_id,
    inventory_date,
    inventory_status,
    is_rentable,
    reserved_from,
    reserved_to,
    blocked_reason,
    mileage_snapshot_km
)
SELECT
    v.id,
    src.inventory_date,
    src.inventory_status,
    src.is_rentable,
    src.reserved_from,
    src.reserved_to,
    src.blocked_reason,
    src.mileage_snapshot_km
FROM (
    SELECT 'rent-ioniq5-long-range' AS vehicle_code, '2026-03-23' AS inventory_date, 'available' AS inventory_status, 1 AS is_rentable, NULL AS reserved_from, NULL AS reserved_to, NULL AS blocked_reason, NULL AS mileage_snapshot_km
    UNION ALL SELECT 'rent-carnival-9', '2026-03-23', 'available', 1, NULL, NULL, NULL, NULL
) AS src
JOIN rental_vehicles v ON v.vehicle_code = src.vehicle_code
ON DUPLICATE KEY UPDATE
    inventory_status = VALUES(inventory_status),
    is_rentable = VALUES(is_rentable),
    reserved_from = VALUES(reserved_from),
    reserved_to = VALUES(reserved_to),
    blocked_reason = VALUES(blocked_reason),
    mileage_snapshot_km = VALUES(mileage_snapshot_km);
