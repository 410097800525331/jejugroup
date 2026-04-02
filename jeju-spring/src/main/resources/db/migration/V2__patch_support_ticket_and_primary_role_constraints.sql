-- TiDB compatible: one DDL operation per ALTER TABLE

ALTER TABLE support_comments
    ADD KEY idx_support_comments_ticket_id_id (ticket_id, id);

ALTER TABLE support_attachments
    DROP FOREIGN KEY fk_support_attachments_comment;

ALTER TABLE support_attachments
    ADD KEY idx_support_attachments_ticket_comment (ticket_id, comment_id);

ALTER TABLE support_attachments
    ADD CONSTRAINT fk_support_attachments_comment_ticket_pair
        FOREIGN KEY (ticket_id, comment_id) REFERENCES support_comments (ticket_id, id)
        ON DELETE CASCADE
        ON UPDATE CASCADE;

ALTER TABLE user_roles
    MODIFY COLUMN is_primary TINYINT(1) NULL DEFAULT 1;

ALTER TABLE user_roles
    ADD UNIQUE KEY uk_user_roles_one_primary_per_user (user_id, is_primary);
