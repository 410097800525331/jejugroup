package com.jejugroup.jejuspring.customercenter.support;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Set;

import org.springframework.util.StringUtils;

import com.jejugroup.jejuspring.config.AppProperties;

abstract class SupportDatabaseSupport {
    protected static final Set<String> ALLOWED_SERVICE_TYPES = Set.of("jeju-air", "jeju-stay", "jeju-rental", "common");

    protected final AppProperties appProperties;

    protected SupportDatabaseSupport(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    protected Connection openConnection() throws SQLException {
        String url = normalize(appProperties.alwaysdata().dbUrl());
        String user = normalize(appProperties.alwaysdata().dbUser());
        String password = normalize(appProperties.alwaysdata().dbPassword());

        if (!StringUtils.hasText(url) || !StringUtils.hasText(user) || !StringUtils.hasText(password)) {
            throw new SQLException("Spring customer-center support DB configuration is missing");
        }

        return DriverManager.getConnection(url, user, password);
    }

    protected String requireText(String value, String fieldName) {
        if (!StringUtils.hasText(value)) {
            throw new IllegalArgumentException(fieldName + "이 필요합니다.");
        }
        return value.trim();
    }

    protected String normalizeNullable(String value) {
        return value == null ? null : value.trim();
    }

    protected String normalize(String value) {
        return value == null ? "" : value.trim();
    }

    protected void setNullableString(java.sql.PreparedStatement statement, int index, String value) throws SQLException {
        if (value == null) {
            statement.setNull(index, java.sql.Types.VARCHAR);
            return;
        }
        statement.setString(index, value);
    }

    protected void setNullableTimestamp(java.sql.PreparedStatement statement, int index, LocalDateTime value) throws SQLException {
        if (value == null) {
            statement.setNull(index, java.sql.Types.TIMESTAMP);
            return;
        }
        statement.setTimestamp(index, Timestamp.valueOf(value));
    }

    protected LocalDateTime toLocalDateTime(Timestamp timestamp) {
        return timestamp == null ? null : timestamp.toLocalDateTime();
    }

    protected String normalizeWriteServiceType(String serviceType) {
        if (!StringUtils.hasText(serviceType)) {
            return "common";
        }

        String normalized = serviceType.trim().toLowerCase(Locale.ROOT);
        if (!ALLOWED_SERVICE_TYPES.contains(normalized)) {
            throw new IllegalArgumentException("serviceType must be one of jeju-air, jeju-stay, jeju-rental, common");
        }

        return normalized;
    }

    protected String normalizeWriteServiceTypeOrDefault(String serviceType, String fallbackServiceType) {
        if (!StringUtils.hasText(serviceType)) {
            return fallbackServiceType;
        }
        return normalizeWriteServiceType(serviceType);
    }

    protected String normalizeServiceTypeFilter(String serviceType) {
        if (!StringUtils.hasText(serviceType)) {
            return null;
        }

        String normalized = serviceType.trim().toLowerCase(Locale.ROOT);
        if (!ALLOWED_SERVICE_TYPES.contains(normalized)) {
            throw new IllegalArgumentException("serviceType must be one of jeju-air, jeju-stay, jeju-rental, common");
        }

        return normalized;
    }

    protected String normalizeOptionalServiceType(String serviceType) {
        return normalizeServiceTypeFilter(serviceType);
    }

    protected String normalizeRequiredServiceType(String serviceType) {
        return normalizeWriteServiceType(requireText(serviceType, "serviceType"));
    }

    protected String normalizeRole(String role) {
        String normalized = normalizeNullable(role);
        if (!StringUtils.hasText(normalized)) {
            return "USER";
        }
        return normalized.toUpperCase();
    }

    protected Long normalizeOptionalPositiveLong(Long value, String fieldName) {
        if (value == null) {
            return null;
        }
        if (value <= 0) {
            throw new IllegalArgumentException(fieldName + "은 1 이상의 값이어야 합니다.");
        }
        return value;
    }

    protected long normalizeNonNegativeLong(Long value, String fieldName) {
        if (value == null) {
            return 0L;
        }
        if (value < 0L) {
            throw new IllegalArgumentException(fieldName + "은 0 이상의 값이어야 합니다.");
        }
        return value;
    }
}
