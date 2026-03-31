package com.jejugroup.jejuspring.mypage.application;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.sql.Types;
import java.util.NoSuchElementException;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.jejugroup.jejuspring.config.AppProperties;
import com.jejugroup.jejuspring.mypage.model.MyPageProfileUpdateRequest;

@Service
public class MyPageProfileUpdateService {
    private static final Pattern NAME_PATTERN = Pattern.compile("^[^\\p{Cntrl}<>]{1,100}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^[0-9+()\\-]{7,30}$");
    private static final int NICKNAME_MIN_LENGTH = 2;
    private static final int BIO_MAX_LENGTH = 20;

    private final AppProperties appProperties;

    public MyPageProfileUpdateService(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    public void updateProfile(String userId, MyPageProfileUpdateRequest request) throws SQLException {
        String normalizedUserId = normalizeUserId(userId);
        NormalizedProfile profile = normalizeRequest(request);

        try (Connection connection = openConnection()) {
            connection.setAutoCommit(false);

            try {
                ensureUserExists(connection, normalizedUserId);
                ensureNoDuplicateContact(connection, normalizedUserId, profile.email(), profile.phone());
                updateUsersTable(connection, normalizedUserId, profile);
                upsertUserProfile(connection, normalizedUserId, profile.name(), profile.nickname(), profile.bio());
                connection.commit();
            } catch (SQLException exception) {
                rollbackQuietly(connection);
                if (isDuplicateConstraintViolation(exception)) {
                    throw new ProfileConflictException("이미 사용 중인 이메일 또는 전화번호입니다.");
                }
                throw exception;
            } catch (RuntimeException exception) {
                rollbackQuietly(connection);
                throw exception;
            }
        }
    }

    private void ensureUserExists(Connection connection, String userId) throws SQLException {
        String query = """
            SELECT 1
            FROM users
            WHERE id = ?
            FOR UPDATE
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, userId);

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    throw new NoSuchElementException("회원 정보를 찾을 수 없습니다.");
                }
            }
        }
    }

    private void ensureNoDuplicateContact(
        Connection connection,
        String userId,
        String email,
        String phone
    ) throws SQLException {
        String query = """
            SELECT id
            FROM users
            WHERE id <> ?
              AND (email = ? OR phone = ?)
            LIMIT 1
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, userId);
            statement.setString(2, email);
            statement.setString(3, phone);

            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    throw new ProfileConflictException("이미 사용 중인 이메일 또는 전화번호입니다.");
                }
            }
        }
    }

    private void updateUsersTable(Connection connection, String userId, NormalizedProfile profile) throws SQLException {
        String query = """
            UPDATE users
            SET name = ?,
                email = ?,
                phone = ?
            WHERE id = ?
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, profile.name());
            statement.setString(2, profile.email());
            statement.setString(3, profile.phone());
            statement.setString(4, userId);
            statement.executeUpdate();
        }
    }

    private void upsertUserProfile(
        Connection connection,
        String userId,
        String displayName,
        String nickname,
        String bio
    ) throws SQLException {
        String query = """
            INSERT INTO user_profiles (user_id, display_name, nickname, bio)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                display_name = VALUES(display_name),
                nickname = VALUES(nickname),
                bio = VALUES(bio)
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, userId);
            statement.setString(2, displayName);
            if (StringUtils.hasText(nickname)) {
                statement.setString(3, nickname);
            } else {
                statement.setNull(3, Types.VARCHAR);
            }
            statement.setString(4, bio);
            statement.executeUpdate();
        }
    }

    private NormalizedProfile normalizeRequest(MyPageProfileUpdateRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("프로필 정보가 필요합니다.");
        }

        String name = normalizeName(request.name());
        String nickname = normalizeNickname(request.nickname());
        String email = normalizeEmail(request.email());
        String phone = normalizePhone(request.phone());
        String bio = normalizeBio(request.bio());

        if (!StringUtils.hasText(name)) {
            throw new IllegalArgumentException("이름을 입력해주세요.");
        }
        if (!NAME_PATTERN.matcher(name).matches()) {
            throw new IllegalArgumentException("이름 형식이 올바르지 않습니다.");
        }

        if (StringUtils.hasText(nickname) && characterLength(nickname) < NICKNAME_MIN_LENGTH) {
            throw new IllegalArgumentException("닉네임은 2자 이상부터 가능합니다");
        }

        if (!StringUtils.hasText(email)) {
            throw new IllegalArgumentException("이메일을 입력해주세요.");
        }
        if (email.length() > 255 || !EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("이메일 형식이 올바르지 않습니다.");
        }

        if (!StringUtils.hasText(phone)) {
            throw new IllegalArgumentException("전화번호를 입력해주세요.");
        }
        if (phone.length() > 30 || !PHONE_PATTERN.matcher(phone).matches()) {
            throw new IllegalArgumentException("전화번호 형식이 올바르지 않습니다.");
        }

        if (characterLength(bio) > BIO_MAX_LENGTH) {
            throw new IllegalArgumentException("소개는 20자 이내로 입력해주세요.");
        }

        return new NormalizedProfile(name, nickname, email, phone, bio);
    }

    private String normalizeUserId(String userId) {
        if (!StringUtils.hasText(userId)) {
            throw new IllegalArgumentException("회원 정보가 올바르지 않습니다.");
        }
        return userId.trim();
    }

    private String normalizeName(String value) {
        if (value == null) {
            return "";
        }
        return value.trim().replaceAll("\\s+", " ");
    }

    private String normalizeEmail(String value) {
        if (value == null) {
            return "";
        }
        return value.trim();
    }

    private String normalizeNickname(String value) {
        if (value == null) {
            return "";
        }
        return value.trim();
    }

    private String normalizePhone(String value) {
        if (value == null) {
            return "";
        }
        return value.trim().replaceAll("\\s+", "");
    }

    private String normalizeBio(String value) {
        if (value == null) {
            return "";
        }
        return value.trim();
    }

    private int characterLength(String value) {
        if (value == null || value.isEmpty()) {
            return 0;
        }
        return value.codePointCount(0, value.length());
    }

    private boolean isDuplicateConstraintViolation(SQLException exception) {
        SQLException current = exception;
        while (current != null) {
            if (current instanceof SQLIntegrityConstraintViolationException) {
                return true;
            }
            if ("23000".equals(current.getSQLState())) {
                return true;
            }
            current = current.getNextException();
        }
        return false;
    }

    private void rollbackQuietly(Connection connection) {
        try {
            connection.rollback();
        } catch (SQLException ignored) {
            // 롤백 실패는 원래 예외를 덮지 않는다.
        }
    }

    private Connection openConnection() throws SQLException {
        String url = normalize(appProperties.database().dbUrl());
        String user = normalize(appProperties.database().dbUser());
        String password = normalize(appProperties.database().dbPassword());

        if (!StringUtils.hasText(url) || !StringUtils.hasText(user) || !StringUtils.hasText(password)) {
            throw new SQLException("Spring mypage DB configuration is missing");
        }

        return DriverManager.getConnection(url, user, password);
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }

    private record NormalizedProfile(
        String name,
        String nickname,
        String email,
        String phone,
        String bio
    ) {
    }

    public static class ProfileConflictException extends RuntimeException {
        public ProfileConflictException(String message) {
            super(message);
        }
    }
}
