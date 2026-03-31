-- V30 monthly deal code shortening for already-migrated DBs
-- repeat-safe and forward-only remap for the four seeded stay hotels

UPDATE hotel_properties hp
JOIN (
    SELECT 'stay-jeju-grand-hyatt' AS old_property_code, 'st-7q2m9x' AS new_property_code
    UNION ALL SELECT 'stay-osaka-ritz', 'st-4k8d1p'
    UNION ALL SELECT 'stay-danang-intercontinental', 'st-6z1n7c'
    UNION ALL SELECT 'stay-bangkok-mandarin', 'st-9h3v5r'
) AS src
    ON hp.property_code IN (src.old_property_code, src.new_property_code)
SET hp.property_code = src.new_property_code;

UPDATE hotel_room_types hrt
JOIN hotel_properties hp ON hp.id = hrt.hotel_property_id
JOIN (
    SELECT 'stay-jeju-grand-hyatt' AS old_property_code, 'st-7q2m9x' AS new_property_code, 'stay-jeju-grand-hyatt-monthly-room' AS old_room_type_code, 'rm-7q2m9x' AS new_room_type_code
    UNION ALL SELECT 'stay-osaka-ritz', 'st-4k8d1p', 'stay-osaka-ritz-monthly-room', 'rm-4k8d1p'
    UNION ALL SELECT 'stay-danang-intercontinental', 'st-6z1n7c', 'stay-danang-intercontinental-monthly-room', 'rm-6z1n7c'
    UNION ALL SELECT 'stay-bangkok-mandarin', 'st-9h3v5r', 'stay-bangkok-mandarin-monthly-room', 'rm-9h3v5r'
) AS src
    ON hp.property_code IN (src.old_property_code, src.new_property_code)
   AND hrt.room_type_code IN (src.old_room_type_code, src.new_room_type_code)
SET hrt.room_type_code = src.new_room_type_code;

UPDATE hotel_price_policies hpp
JOIN hotel_properties hp ON hp.id = hpp.hotel_property_id
JOIN hotel_room_types hrt ON hrt.id = hpp.hotel_room_type_id
JOIN (
    SELECT 'stay-jeju-grand-hyatt' AS old_property_code, 'st-7q2m9x' AS new_property_code, 'stay-jeju-grand-hyatt-monthly-room' AS old_room_type_code, 'rm-7q2m9x' AS new_room_type_code, 'stay-jeju-grand-hyatt-monthly-deal' AS old_policy_code, 'md-7q2m9x-monthly-deal' AS new_policy_code
    UNION ALL SELECT 'stay-osaka-ritz', 'st-4k8d1p', 'stay-osaka-ritz-monthly-room', 'rm-4k8d1p', 'stay-osaka-ritz-monthly-deal', 'md-4k8d1p-monthly-deal'
    UNION ALL SELECT 'stay-danang-intercontinental', 'st-6z1n7c', 'stay-danang-intercontinental-monthly-room', 'rm-6z1n7c', 'stay-danang-intercontinental-monthly-deal', 'md-6z1n7c-monthly-deal'
    UNION ALL SELECT 'stay-bangkok-mandarin', 'st-9h3v5r', 'stay-bangkok-mandarin-monthly-room', 'rm-9h3v5r', 'stay-bangkok-mandarin-monthly-deal', 'md-9h3v5r-monthly-deal'
) AS src
    ON hp.property_code IN (src.old_property_code, src.new_property_code)
   AND hrt.room_type_code IN (src.old_room_type_code, src.new_room_type_code)
   AND hpp.policy_code IN (src.old_policy_code, src.new_policy_code)
SET hpp.policy_code = src.new_policy_code;