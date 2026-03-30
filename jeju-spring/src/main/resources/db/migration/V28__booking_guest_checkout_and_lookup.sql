ALTER TABLE bookings
    MODIFY user_id VARCHAR(100) NULL,
    ADD COLUMN destination VARCHAR(120) NOT NULL DEFAULT '' AFTER booking_no;

ALTER TABLE booking_items
    ADD KEY idx_booking_items_booking_id_service_start_date (booking_id, service_start_date);

ALTER TABLE booking_passengers
    ADD COLUMN passenger_first_name VARCHAR(100) NOT NULL DEFAULT '' AFTER passenger_name,
    ADD COLUMN passenger_last_name VARCHAR(100) NOT NULL DEFAULT '' AFTER passenger_first_name,
    ADD KEY idx_booking_passengers_lookup (booking_id, is_primary, passenger_last_name, passenger_first_name);
