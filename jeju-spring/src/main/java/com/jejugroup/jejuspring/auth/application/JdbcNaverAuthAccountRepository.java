package com.jejugroup.jejuspring.auth.application;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.jejugroup.jejuspring.auth.model.SessionUser;

@Service
public class JdbcNaverAuthAccountRepository implements NaverAuthAccountRepository {
    private static final String PROVIDER = "NAVER";

    private final AuthService authService;

    public JdbcNaverAuthAccountRepository(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public SessionUser resolveOrLinkExistingUser(String providerAccountId, String providerEmail) throws SQLException {
        if (!StringUtils.hasText(providerAccountId)) {
            throw new IllegalArgumentException("providerAccountId is required");
        }

        String normalizedAccountId = providerAccountId.trim();
        String normalizedEmail = normalize(providerEmail);

        try (Connection connection = authService.openConnection()) {
            boolean previousAutoCommit = connection.getAutoCommit();
            connection.setAutoCommit(false);

            try {
                NaverAccountLink accountLink = findAccountLink(connection, normalizedAccountId);
                String userId = accountLink != null ? accountLink.userId() : findUserIdByEmail(connection, normalizedEmail);

                if (!StringUtils.hasText(userId)) {
                    throw new NaverAuthUnauthorizedException();
                }

                if (accountLink == null) {
                    insertAccountLink(connection, userId, normalizedAccountId, normalizedEmail);
                } else {
                    updateAccountLink(connection, accountLink.id(), normalizedEmail);
                }

                SessionUser sessionUser = loadSessionUser(connection, userId);
                if (sessionUser == null) {
                    throw new NaverAuthUnauthorizedException();
                }

                connection.commit();
                return sessionUser;
            } catch (SQLException | RuntimeException exception) {
                rollbackQuietly(connection);
                throw exception;
            } finally {
                connection.setAutoCommit(previousAutoCommit);
            }
        }
    }

    private NaverAccountLink findAccountLink(Connection connection, String providerAccountId) throws SQLException {
        String query = """
            SELECT id, user_id
            FROM user_auth_accounts
            WHERE provider = ?
              AND provider_account_id = ?
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, PROVIDER);
            statement.setString(2, providerAccountId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return null;
                }

                return new NaverAccountLink(
                    resultSet.getLong("id"),
                    resultSet.getString("user_id")
                );
            }
        }
    }

    private String findUserIdByEmail(Connection connection, String email) throws SQLException {
        if (!StringUtils.hasText(email)) {
            return null;
        }

        String query = """
            SELECT id
            FROM users
            WHERE email = ?
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, email);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return null;
                }

                return resultSet.getString("id");
            }
        }
    }

    private void insertAccountLink(Connection connection, String userId, String providerAccountId, String providerEmail) throws SQLException {
        String query = """
            INSERT INTO user_auth_accounts (
                user_id,
                provider,
                provider_account_id,
                provider_email,
                is_primary,
                last_authenticated_at
            ) VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP(3))
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, userId);
            statement.setString(2, PROVIDER);
            statement.setString(3, providerAccountId);
            statement.setString(4, normalize(providerEmail));
            statement.executeUpdate();
        } catch (SQLException exception) {
            NaverAccountLink existingLink = findAccountLink(connection, providerAccountId);
            if (existingLink == null) {
                throw exception;
            }
            updateAccountLink(connection, existingLink.id(), providerEmail);
        }
    }

    private void updateAccountLink(Connection connection, long accountLinkId, String providerEmail) throws SQLException {
        String query = """
            UPDATE user_auth_accounts
            SET provider_email = ?,
                last_authenticated_at = CURRENT_TIMESTAMP(3)
            WHERE id = ?
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, normalize(providerEmail));
            statement.setLong(2, accountLinkId);
            statement.executeUpdate();
        }
    }

    private SessionUser loadSessionUser(Connection connection, String userId) throws SQLException {
        String query = """
            SELECT id, name, email, phone, role
            FROM users
            WHERE id = ?
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, userId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return null;
                }

                return new SessionUser(
                    resultSet.getString("id"),
                    resultSet.getString("name"),
                    resultSet.getString("email"),
                    resultSet.getString("phone"),
                    resultSet.getString("role")
                );
            }
        }
    }

    private void rollbackQuietly(Connection connection) {
        try {
            connection.rollback();
        } catch (SQLException ignored) {
            // rollback 실패는 원래 예외를 덮지 않는다.
        }
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }

    private record NaverAccountLink(long id, String userId) {
    }
}
