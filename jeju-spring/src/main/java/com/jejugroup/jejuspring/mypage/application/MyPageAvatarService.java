package com.jejugroup.jejuspring.mypage.application;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Locale;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.UUID;

import org.springframework.core.io.PathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriUtils;

import com.jejugroup.jejuspring.config.AppProperties;

@Service
public class MyPageAvatarService {
    private static final long MAX_AVATAR_BYTES = 5L * 1024L * 1024L;
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png");
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of("image/jpeg", "image/jpg", "image/png");

    private final AppProperties appProperties;

    public MyPageAvatarService(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    public String updateAvatar(String userId, MultipartFile avatar) throws SQLException, IOException {
        String normalizedUserId = normalizeUserId(userId);
        validateAvatar(avatar);

        Path uploadRoot = resolveUploadRoot();
        Files.createDirectories(uploadRoot);

        String extension = resolveExtension(avatar);
        String fileName = UUID.randomUUID().toString().replace("-", "") + "." + extension;
        String relativeAvatarUrl = buildAvatarUrl(normalizedUserId, fileName);
        Path avatarPath = resolveStoredPath(uploadRoot, relativeAvatarUrl);
        Files.createDirectories(avatarPath.getParent());

        try (InputStream inputStream = avatar.getInputStream()) {
            Files.copy(inputStream, avatarPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException exception) {
            deleteQuietly(avatarPath);
            throw exception;
        }

        String previousAvatarUrl = "";
        try (Connection connection = openConnection()) {
            connection.setAutoCommit(false);

            try {
                String displayName = lockAndLoadDisplayName(connection, normalizedUserId);
                previousAvatarUrl = loadAvatarUrl(connection, normalizedUserId);
                upsertAvatarUrl(connection, normalizedUserId, displayName, relativeAvatarUrl);
                connection.commit();
            } catch (SQLException exception) {
                rollbackQuietly(connection);
                deleteQuietly(avatarPath);
                throw exception;
            } catch (RuntimeException exception) {
                rollbackQuietly(connection);
                deleteQuietly(avatarPath);
                throw exception;
            }
        }

        deleteQuietly(previousAvatarUrl);
        return relativeAvatarUrl;
    }

    public AvatarFile loadAvatar(String userId, String fileName) throws IOException {
        String normalizedUserId = normalizeUserId(userId);
        String normalizedFileName = normalizeFileName(fileName);
        Path uploadRoot = resolveUploadRoot();
        Path avatarPath = resolveStoredPath(uploadRoot, buildAvatarUrl(normalizedUserId, normalizedFileName));

        if (!Files.exists(avatarPath) || !Files.isRegularFile(avatarPath)) {
            throw new NoSuchElementException("avatar not found");
        }

        return new AvatarFile(new PathResource(avatarPath), resolveMediaType(avatarPath));
    }

    private void validateAvatar(MultipartFile avatar) {
        if (avatar == null || avatar.isEmpty()) {
            throw new IllegalArgumentException("아바타 파일을 업로드해주세요.");
        }

        if (avatar.getSize() > MAX_AVATAR_BYTES) {
            throw new IllegalArgumentException("아바타 파일은 5MB 이하만 허용됩니다.");
        }

        String originalFilename = StringUtils.getFilename(avatar.getOriginalFilename());
        if (!StringUtils.hasText(originalFilename)) {
            throw new IllegalArgumentException("아바타 파일 형식이 올바르지 않습니다.");
        }

        String extension = resolveExtension(originalFilename);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("아바타 파일 형식이 올바르지 않습니다.");
        }

        String contentType = normalizeContentType(avatar.getContentType());
        if (!ALLOWED_MIME_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("아바타 파일 형식이 올바르지 않습니다.");
        }
    }

    private String resolveExtension(MultipartFile avatar) {
        return resolveExtension(StringUtils.getFilename(avatar.getOriginalFilename()));
    }

    private String resolveExtension(String fileName) {
        if (!StringUtils.hasText(fileName)) {
            throw new IllegalArgumentException("아바타 파일 형식이 올바르지 않습니다.");
        }

        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex < 0 || lastDotIndex == fileName.length() - 1) {
            throw new IllegalArgumentException("아바타 파일 형식이 올바르지 않습니다.");
        }

        String extension = fileName.substring(lastDotIndex + 1).toLowerCase(Locale.ROOT);
        return "jpeg".equals(extension) ? "jpg" : extension;
    }

    private String normalizeContentType(String contentType) {
        if (!StringUtils.hasText(contentType)) {
            return "";
        }

        int semicolonIndex = contentType.indexOf(';');
        String normalized = semicolonIndex >= 0 ? contentType.substring(0, semicolonIndex) : contentType;
        return normalized.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeUserId(String userId) {
        if (!StringUtils.hasText(userId)) {
            throw new IllegalArgumentException("회원 정보가 올바르지 않습니다.");
        }

        String trimmed = userId.trim();
        if (trimmed.contains("/") || trimmed.contains("\\") || trimmed.contains("..")) {
            throw new IllegalArgumentException("회원 정보가 올바르지 않습니다.");
        }

        return trimmed;
    }

    private String normalizeFileName(String fileName) {
        if (!StringUtils.hasText(fileName)) {
            throw new IllegalArgumentException("아바타 파일을 찾을 수 없습니다.");
        }

        String trimmed = fileName.trim();
        if (trimmed.contains("/") || trimmed.contains("\\") || trimmed.contains("..")) {
            throw new IllegalArgumentException("아바타 파일을 찾을 수 없습니다.");
        }

        return trimmed;
    }

    private String buildAvatarUrl(String userId, String fileName) {
        String encodedUserId = UriUtils.encodePathSegment(userId, java.nio.charset.StandardCharsets.UTF_8);
        String encodedFileName = UriUtils.encodePathSegment(fileName, java.nio.charset.StandardCharsets.UTF_8);
        return "/api/mypage/avatar/%s/%s".formatted(encodedUserId, encodedFileName);
    }

    private Path resolveStoredPath(Path uploadRoot, String relativeAvatarUrl) {
        if (!StringUtils.hasText(relativeAvatarUrl)) {
            throw new IllegalArgumentException("아바타 경로가 올바르지 않습니다.");
        }

        String normalizedRelativePath = relativeAvatarUrl.startsWith("/")
            ? relativeAvatarUrl.substring(1)
            : relativeAvatarUrl;

        Path resolved = uploadRoot.resolve(normalizedRelativePath).normalize();
        if (!resolved.startsWith(uploadRoot.normalize())) {
            throw new IllegalArgumentException("아바타 경로가 올바르지 않습니다.");
        }

        return resolved;
    }

    private Path resolveUploadRoot() {
        String configuredRoot = normalize(appProperties.mypage().avatarUploadRoot());
        if (!StringUtils.hasText(configuredRoot)) {
            throw new IllegalStateException("아바타 업로드 경로가 설정되지 않았습니다.");
        }

        return Path.of(configuredRoot).toAbsolutePath().normalize();
    }

    private MediaType resolveMediaType(Path avatarPath) throws IOException {
        String contentType = Files.probeContentType(avatarPath);
        if (!StringUtils.hasText(contentType)) {
            contentType = inferContentType(avatarPath.getFileName().toString());
        }

        return MediaType.parseMediaType(contentType);
    }

    private String inferContentType(String fileName) {
        String extension = resolveExtension(fileName);
        return "png".equals(extension) ? "image/png" : "image/jpeg";
    }

    private Connection openConnection() throws SQLException {
        String url = normalize(appProperties.alwaysdata().dbUrl());
        String user = normalize(appProperties.alwaysdata().dbUser());
        String password = normalize(appProperties.alwaysdata().dbPassword());

        if (!StringUtils.hasText(url) || !StringUtils.hasText(user) || !StringUtils.hasText(password)) {
            throw new SQLException("Spring mypage DB configuration is missing");
        }

        return DriverManager.getConnection(url, user, password);
    }

    private String lockAndLoadDisplayName(Connection connection, String userId) throws SQLException {
        String query = """
            SELECT name
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

                return nullToEmpty(resultSet.getString("name"));
            }
        }
    }

    private String loadAvatarUrl(Connection connection, String userId) throws SQLException {
        String query = """
            SELECT avatar_url
            FROM user_profiles
            WHERE user_id = ?
            FOR UPDATE
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, userId);

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return "";
                }

                return nullToEmpty(resultSet.getString("avatar_url"));
            }
        }
    }

    private void upsertAvatarUrl(
        Connection connection,
        String userId,
        String displayName,
        String avatarUrl
    ) throws SQLException {
        String query = """
            INSERT INTO user_profiles (user_id, display_name, avatar_url)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
                avatar_url = VALUES(avatar_url)
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, userId);
            statement.setString(2, StringUtils.hasText(displayName) ? displayName : userId);
            statement.setString(3, avatarUrl);
            statement.executeUpdate();
        }
    }

    private void rollbackQuietly(Connection connection) {
        try {
            connection.rollback();
        } catch (SQLException ignored) {
            // 롤백 실패는 원래 예외를 덮지 않는다.
        }
    }

    private void deleteQuietly(Path path) {
        if (path == null) {
            return;
        }

        try {
            Files.deleteIfExists(path);
        } catch (IOException ignored) {
            // 파일 정리는 최선을 다하고, 실패해도 흐름을 막지 않는다.
        }
    }

    private void deleteQuietly(String relativeAvatarUrl) {
        if (!StringUtils.hasText(relativeAvatarUrl)) {
            return;
        }

        try {
            deleteQuietly(resolveStoredPath(resolveUploadRoot(), relativeAvatarUrl));
        } catch (RuntimeException ignored) {
            // 이미 삭제되었거나 비정상 경로면 조용히 건너뛴다.
        }
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value;
    }

    public record AvatarFile(Resource resource, MediaType mediaType) {
    }
}
