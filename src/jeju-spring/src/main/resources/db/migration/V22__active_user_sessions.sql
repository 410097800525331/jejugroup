-- active user presence tracked from authenticated Spring sessions

CREATE TABLE active_user_sessions (
    session_id VARCHAR(128) NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    last_seen_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (session_id),
    KEY idx_active_user_sessions_last_seen_at (last_seen_at),
    KEY idx_active_user_sessions_user_last_seen_at (user_id, last_seen_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='authenticated active session presence';
