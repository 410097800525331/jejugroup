-- TiDB compatible: one DDL operation per ALTER TABLE

DELETE FROM companion_links
WHERE companion_user_id IS NULL;

UPDATE companion_links
SET is_member = 1
WHERE companion_user_id IS NOT NULL
  AND is_member <> 1;

ALTER TABLE companion_links
    DROP FOREIGN KEY fk_companion_links_companion_user;

ALTER TABLE companion_links
    MODIFY companion_user_id VARCHAR(100) NOT NULL;

ALTER TABLE companion_links
    MODIFY is_member TINYINT(1) NOT NULL DEFAULT 1;

ALTER TABLE companion_links
    ADD CONSTRAINT fk_companion_links_companion_user
        FOREIGN KEY (companion_user_id) REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE;

ALTER TABLE companion_links
    ADD CONSTRAINT ck_companion_links_member_only
        CHECK (is_member = 1);
