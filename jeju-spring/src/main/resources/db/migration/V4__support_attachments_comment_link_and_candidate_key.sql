-- TiDB compatible: one DDL operation per ALTER TABLE

ALTER TABLE support_attachments
    ADD COLUMN comment_ticket_id BIGINT UNSIGNED NULL AFTER ticket_id;

UPDATE support_attachments
SET comment_ticket_id = ticket_id
WHERE comment_id IS NOT NULL;

-- Must drop FK before dropping/replacing its supporting index
ALTER TABLE support_attachments
    DROP FOREIGN KEY fk_support_attachments_comment_ticket_pair;

-- Now safe to drop this index (FK removed)
ALTER TABLE support_attachments
    DROP INDEX idx_support_attachments_ticket_comment;

-- Replace the plain index with a unique key on support_comments
ALTER TABLE support_comments
    DROP INDEX idx_support_comments_ticket_id_id;

ALTER TABLE support_comments
    ADD UNIQUE KEY uk_support_comments_ticket_id_id (ticket_id, id);

-- New index for the new FK columns
ALTER TABLE support_attachments
    ADD KEY idx_support_attachments_comment_ticket (comment_ticket_id, comment_id);

-- New FK using the new columns
ALTER TABLE support_attachments
    ADD CONSTRAINT fk_support_attachments_comment_ticket_pair
        FOREIGN KEY (comment_ticket_id, comment_id) REFERENCES support_comments (ticket_id, id)
        ON DELETE SET NULL
        ON UPDATE CASCADE;
