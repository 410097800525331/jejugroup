ALTER TABLE booking_items
    ADD UNIQUE KEY uk_booking_items_booking_id_id (booking_id, id);

ALTER TABLE booking_passengers
    ADD UNIQUE KEY uk_booking_passengers_booking_id_id (booking_id, id),
    ADD KEY idx_booking_passengers_booking_item_scope (booking_id, booking_item_id);

ALTER TABLE travel_events
    ADD KEY idx_travel_events_booking_item_scope (booking_id, booking_item_id),
    ADD KEY idx_travel_events_booking_passenger_scope (booking_id, booking_passenger_id);

ALTER TABLE booking_passengers
    DROP FOREIGN KEY fk_booking_passengers_booking_item;

ALTER TABLE travel_events
    DROP FOREIGN KEY fk_travel_events_booking_item,
    DROP FOREIGN KEY fk_travel_events_booking_passenger;

ALTER TABLE booking_passengers
    ADD CONSTRAINT fk_booking_passengers_booking_item_same_booking
        FOREIGN KEY (booking_id, booking_item_id) REFERENCES booking_items (booking_id, id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE;

ALTER TABLE travel_events
    ADD CONSTRAINT fk_travel_events_booking_item_same_booking
        FOREIGN KEY (booking_id, booking_item_id) REFERENCES booking_items (booking_id, id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    ADD CONSTRAINT fk_travel_events_booking_passenger_same_booking
        FOREIGN KEY (booking_id, booking_passenger_id) REFERENCES booking_passengers (booking_id, id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE;

ALTER TABLE payment_transactions
    ADD UNIQUE KEY uk_payment_transactions_external_transaction_id (external_transaction_id);

ALTER TABLE payment_refunds
    ADD UNIQUE KEY uk_payment_refunds_external_refund_id (external_refund_id);
