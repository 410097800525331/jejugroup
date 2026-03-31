CREATE TABLE users (
    id VARCHAR(100) NOT NULL,
    pw VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    gender CHAR(1) NOT NULL,
    provider VARCHAR(30) NOT NULL DEFAULT 'PASS',
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_phone (phone),
    UNIQUE KEY uk_users_email (email),
    KEY idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_profiles (
    user_id VARCHAR(100) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    nickname VARCHAR(100) NULL,
    avatar_url VARCHAR(500) NULL,
    bio VARCHAR(500) NULL,
    preferred_language VARCHAR(20) NOT NULL DEFAULT 'ko-KR',
    marketing_opt_in TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (user_id),
    CONSTRAINT fk_user_profiles_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_auth_accounts (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id VARCHAR(100) NOT NULL,
    provider VARCHAR(30) NOT NULL,
    provider_account_id VARCHAR(191) NOT NULL,
    provider_email VARCHAR(255) NULL,
    is_primary TINYINT(1) NOT NULL DEFAULT 1,
    last_authenticated_at DATETIME(3) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_user_auth_accounts_provider_account (provider, provider_account_id),
    UNIQUE KEY uk_user_auth_accounts_user_provider (user_id, provider),
    CONSTRAINT fk_user_auth_accounts_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE roles (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_roles_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE permissions (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    code VARCHAR(80) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_permissions_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE role_permissions (
    role_id BIGINT UNSIGNED NOT NULL,
    permission_id BIGINT UNSIGNED NOT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_role_permissions_role
        FOREIGN KEY (role_id) REFERENCES roles (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_role_permissions_permission
        FOREIGN KEY (permission_id) REFERENCES permissions (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_roles (
    user_id VARCHAR(100) NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    is_primary TINYINT(1) NOT NULL DEFAULT 1,
    assigned_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_user_roles_role
        FOREIGN KEY (role_id) REFERENCES roles (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE companion_links (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    owner_user_id VARCHAR(100) NOT NULL,
    companion_user_id VARCHAR(100) NULL,
    companion_name VARCHAR(100) NOT NULL,
    companion_phone VARCHAR(30) NULL,
    companion_email VARCHAR(255) NULL,
    is_member TINYINT(1) NOT NULL DEFAULT 0,
    relationship_label VARCHAR(50) NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    KEY idx_companion_links_owner (owner_user_id),
    UNIQUE KEY uk_companion_links_owner_member (owner_user_id, companion_user_id),
    CONSTRAINT fk_companion_links_owner
        FOREIGN KEY (owner_user_id) REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_companion_links_companion_user
        FOREIGN KEY (companion_user_id) REFERENCES users (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notices (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    service_type VARCHAR(30) NOT NULL DEFAULT 'common',
    title VARCHAR(255) NOT NULL,
    excerpt VARCHAR(500) NULL,
    content LONGTEXT NOT NULL,
    is_pinned TINYINT(1) NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    published_at DATETIME(3) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    KEY idx_notices_service_type (service_type),
    KEY idx_notices_active_published (is_active, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE faqs (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    service_type VARCHAR(30) NOT NULL DEFAULT 'common',
    category VARCHAR(120) NOT NULL,
    question VARCHAR(500) NOT NULL,
    answer LONGTEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    KEY idx_faqs_service_type (service_type),
    KEY idx_faqs_category (category),
    KEY idx_faqs_active_sort (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE support_categories (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    service_type VARCHAR(30) NOT NULL DEFAULT 'common',
    code VARCHAR(60) NOT NULL,
    name VARCHAR(120) NOT NULL,
    description VARCHAR(255) NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uk_support_categories_service_code (service_type, code),
    KEY idx_support_categories_active_sort (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE support_tickets (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id VARCHAR(100) NULL,
    service_type VARCHAR(30) NOT NULL DEFAULT 'common',
    category_id BIGINT UNSIGNED NULL,
    inquiry_type_code VARCHAR(60) NOT NULL,
    requester_name VARCHAR(100) NOT NULL,
    requester_email VARCHAR(255) NOT NULL,
    requester_phone VARCHAR(30) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    priority VARCHAR(20) NOT NULL DEFAULT 'normal',
    answered_at DATETIME(3) NULL,
    closed_at DATETIME(3) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    KEY idx_support_tickets_user (user_id),
    KEY idx_support_tickets_service_status (service_type, status),
    KEY idx_support_tickets_category (category_id),
    CONSTRAINT fk_support_tickets_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_support_tickets_category
        FOREIGN KEY (category_id) REFERENCES support_categories (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE support_comments (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    ticket_id BIGINT UNSIGNED NOT NULL,
    author_user_id VARCHAR(100) NULL,
    author_role VARCHAR(50) NOT NULL DEFAULT 'USER',
    author_name VARCHAR(100) NOT NULL,
    content LONGTEXT NOT NULL,
    is_internal TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    KEY idx_support_comments_ticket (ticket_id),
    KEY idx_support_comments_author (author_user_id),
    CONSTRAINT fk_support_comments_ticket
        FOREIGN KEY (ticket_id) REFERENCES support_tickets (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_support_comments_author
        FOREIGN KEY (author_user_id) REFERENCES users (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE support_attachments (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    ticket_id BIGINT UNSIGNED NOT NULL,
    comment_id BIGINT UNSIGNED NULL,
    uploaded_by_user_id VARCHAR(100) NULL,
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    storage_key VARCHAR(500) NOT NULL,
    content_type VARCHAR(120) NULL,
    file_size_bytes BIGINT UNSIGNED NOT NULL DEFAULT 0,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    KEY idx_support_attachments_ticket (ticket_id),
    KEY idx_support_attachments_comment (comment_id),
    KEY idx_support_attachments_uploader (uploaded_by_user_id),
    CONSTRAINT fk_support_attachments_ticket
        FOREIGN KEY (ticket_id) REFERENCES support_tickets (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_support_attachments_comment
        FOREIGN KEY (comment_id) REFERENCES support_comments (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT fk_support_attachments_uploader
        FOREIGN KEY (uploaded_by_user_id) REFERENCES users (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
