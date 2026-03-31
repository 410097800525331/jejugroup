package com.jejugroup.jejuspring.auth.application;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.jejugroup.jejuspring.auth.model.SessionUser;
import com.jejugroup.jejuspring.config.AppProperties;

@Service
public class ActiveUserPresenceService {
    private static final Logger log = LoggerFactory.getLogger(ActiveUserPresenceService.class);
    private static final int ACTIVE_WINDOW_MINUTES = 5;

    private final AppProperties appProperties;

    public ActiveUserPresenceService(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    public void touch(String sessionId, SessionUser user) {
        if (!StringUtils.hasText(sessionId) || user == null || !StringUtils.hasText(user.id())) {
            return;
        }

        String query = """
            INSERT INTO active_user_sessions (
                session_id,
                user_id,
                last_seen_at,
                created_at,
                updated_at
            ) VALUES (?, ?, CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6))
            ON DUPLICATE KEY UPDATE
                user_id = VALUES(user_id),
                last_seen_at = VALUES(last_seen_at),
                updated_at = VALUES(updated_at)
            """;

        try (Connection connection = openConnection();
             PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, sessionId.trim());
            statement.setString(2, user.id().trim());
            statement.executeUpdate();
        } catch (SQLException exception) {
            log.warn("활성 세션 presence touch 실패", exception);
        }
    }

    public void clear(String sessionId) {
        if (!StringUtils.hasText(sessionId)) {
            return;
        }

        String query = "DELETE FROM active_user_sessions WHERE session_id = ?";
        try (Connection connection = openConnection();
             PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, sessionId.trim());
            statement.executeUpdate();
        } catch (SQLException exception) {
            log.warn("활성 세션 presence clear 실패", exception);
        }
    }

    public long countActiveUsers(Connection connection) throws SQLException {
        if (!tableExists(connection, "active_user_sessions")) {
            return 0L;
        }

        String query = """
            SELECT COUNT(DISTINCT session_id)
            FROM active_user_sessions
            WHERE last_seen_at >= DATE_SUB(CURRENT_TIMESTAMP(6), INTERVAL %d MINUTE)
            """.formatted(ACTIVE_WINDOW_MINUTES);

        try (Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(query)) {
            if (!resultSet.next()) {
                return 0L;
            }
            return resultSet.getLong(1);
        }
    }

    private boolean tableExists(Connection connection, String tableName) throws SQLException {
        String query = """
            SELECT COUNT(*)
            FROM information_schema.tables
            WHERE table_schema = DATABASE()
              AND table_name = ?
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, tableName);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return false;
                }
                return resultSet.getLong(1) > 0L;
            }
        }
    }

    private Connection openConnection() throws SQLException {
        String url = normalize(appProperties.database().dbUrl());
        String user = normalize(appProperties.database().dbUser());
        String password = normalize(appProperties.database().dbPassword());

        if (!StringUtils.hasText(url) || !StringUtils.hasText(user) || !StringUtils.hasText(password)) {
            throw new SQLException("Spring presence DB configuration is missing");
        }

        return DriverManager.getConnection(url, user, password);
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }
}
