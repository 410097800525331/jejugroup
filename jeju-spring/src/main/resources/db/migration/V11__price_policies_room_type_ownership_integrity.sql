UPDATE price_policies pp
JOIN property_room_types rt
    ON rt.id = pp.property_room_type_id
SET pp.property_room_type_id = NULL
WHERE pp.property_room_type_id IS NOT NULL
  AND pp.property_id <> rt.property_id;

ALTER TABLE price_policies
    DROP FOREIGN KEY fk_price_policies_room_type;

ALTER TABLE property_room_types
    ADD UNIQUE KEY uk_property_room_types_property_id_id (property_id, id);

ALTER TABLE price_policies
    ADD CONSTRAINT fk_price_policies_room_type_same_property
        FOREIGN KEY (property_id, property_room_type_id) REFERENCES property_room_types (property_id, id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE;
