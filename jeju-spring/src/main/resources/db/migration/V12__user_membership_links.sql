CREATE TABLE user_memberships (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id VARCHAR(100) NOT NULL,
    membership_plan_id BIGINT UNSIGNED NOT NULL,
    membership_status VARCHAR(30) NOT NULL DEFAULT 'active',
    started_at DATETIME(3) NULL,
    ended_at DATETIME(3) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_user_memberships_user_plan (user_id, membership_plan_id),
    KEY idx_user_memberships_user_status (user_id, membership_status),
    KEY idx_user_memberships_plan_id (membership_plan_id),
    CONSTRAINT fk_user_memberships_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_user_memberships_plan
        FOREIGN KEY (membership_plan_id) REFERENCES membership_plans (id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='사용자 멤버십 연결 정보를 저장하는 테이블';
