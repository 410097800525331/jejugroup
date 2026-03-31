ALTER TABLE support_attachments
    ADD COLUMN comment_ticket_id BIGINT UNSIGNED NULL AFTER ticket_id;

UPDATE support_attachments
SET comment_ticket_id = ticket_id
WHERE comment_id IS NOT NULL;

ALTER TABLE support_comments
    DROP INDEX idx_support_comments_ticket_id_id,
    ADD UNIQUE KEY uk_support_comments_ticket_id_id (ticket_id, id);

ALTER TABLE support_attachments
    DROP FOREIGN KEY fk_support_attachments_comment_ticket_pair,
    DROP INDEX idx_support_attachments_ticket_comment;

ALTER TABLE support_attachments
    ADD KEY idx_support_attachments_comment_ticket (comment_ticket_id, comment_id),
    ADD CONSTRAINT fk_support_attachments_comment_ticket_pair
        FOREIGN KEY (comment_ticket_id, comment_id) REFERENCES support_comments (ticket_id, id)
        ON DELETE SET NULL
        ON UPDATE CASCADE;
