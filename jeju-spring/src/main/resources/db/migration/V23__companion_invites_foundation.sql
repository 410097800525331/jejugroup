CREATE TABLE companion_invites (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    sender_user_id VARCHAR(100) NOT NULL,
    receiver_user_id VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    expires_at DATETIME(3) NOT NULL,
    responded_at DATETIME(3) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    KEY idx_companion_invites_sender_status_created (sender_user_id, status, created_at),
    KEY idx_companion_invites_receiver_status_created (receiver_user_id, status, created_at),
    KEY idx_companion_invites_status_expires (status, expires_at),
    CONSTRAINT fk_companion_invites_sender
        FOREIGN KEY (sender_user_id) REFERENCES users (id),
    CONSTRAINT fk_companion_invites_receiver
        FOREIGN KEY (receiver_user_id) REFERENCES users (id),
    CONSTRAINT ck_companion_invites_sender_receiver_diff
        CHECK (sender_user_id <> receiver_user_id),
    CONSTRAINT ck_companion_invites_status
        CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled', 'expired'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='회원 간 동행 초대를 저장하는 테이블';
