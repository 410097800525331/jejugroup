-- V26 add banner icon key persistence and backfill managed banner defaults

ALTER TABLE banners
    ADD COLUMN icon_key VARCHAR(80) NOT NULL DEFAULT '' AFTER family;

UPDATE banners
SET icon_key = CASE banner_code
    WHEN 'stay_hotel_promo_main' THEN 'plane'
    WHEN 'stay_hotel_promo_sub_1' THEN 'coins'
    WHEN 'stay_hotel_promo_sub_2' THEN 'car'
    WHEN 'stay_private_promo_main' THEN 'crown'
    WHEN 'stay_private_promo_sub_1' THEN 'camera'
    WHEN 'stay_private_promo_sub_2' THEN 'wine'
    WHEN 'stay_life_synergy_banner' THEN 'plane'
    WHEN 'stay_life_promo_1' THEN 'luggage'
    WHEN 'stay_life_promo_2' THEN 'map'
    WHEN 'stay_life_promo_3' THEN 'flower-2'
    WHEN 'stay_activities_auth_banner' THEN 'plane'
    ELSE icon_key
END
WHERE banner_code IN (
    'stay_hotel_promo_main',
    'stay_hotel_promo_sub_1',
    'stay_hotel_promo_sub_2',
    'stay_private_promo_main',
    'stay_private_promo_sub_1',
    'stay_private_promo_sub_2',
    'stay_life_synergy_banner',
    'stay_life_promo_1',
    'stay_life_promo_2',
    'stay_life_promo_3',
    'stay_activities_auth_banner'
);
