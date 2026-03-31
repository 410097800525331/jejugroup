ALTER TABLE notices
    ADD COLUMN notice_type VARCHAR(20) NOT NULL DEFAULT 'notice' AFTER service_type;

ALTER TABLE notices
    ADD CONSTRAINT ck_notices_notice_type
        CHECK (notice_type IN ('notice', 'event'));
