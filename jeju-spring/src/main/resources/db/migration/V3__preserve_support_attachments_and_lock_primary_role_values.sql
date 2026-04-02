-- TiDB compatible: one DDL operation per ALTER TABLE
-- TiDB CHECK constraints require tidb_enable_check_constraint=ON (warn only)

ALTER TABLE user_roles
    ADD CONSTRAINT chk_user_roles_is_primary
        CHECK (is_primary = 1 OR is_primary IS NULL);

ALTER TABLE support_attachments
    DROP FOREIGN KEY fk_support_attachments_comment_ticket_pair;

ALTER TABLE support_attachments
    ADD CONSTRAINT fk_support_attachments_comment_ticket_pair
        FOREIGN KEY (ticket_id, comment_id) REFERENCES support_comments (ticket_id, id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE;
