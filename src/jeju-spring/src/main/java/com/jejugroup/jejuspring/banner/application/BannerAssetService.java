package com.jejugroup.jejuspring.banner.application;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Map;
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
public class BannerAssetService {
    private static final long MAX_BANNER_BYTES = 10L * 1024L * 1024L;
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png");
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of("image/jpeg", "image/jpg", "image/png");
    private final AppProperties appProperties;

    public BannerAssetService(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    public String storeBannerImage(String bannerId, MultipartFile image) throws IOException {
        String normalizedBannerId = normalizeBannerId(bannerId);
        validateBannerImage(image);

        Path uploadRoot = resolveUploadRoot();
        Files.createDirectories(uploadRoot);

        String extension = resolveExtension(image);
        String fileName = UUID.randomUUID().toString().replace("-", "") + "." + extension;
        String servedPath = buildServedPath(normalizedBannerId, fileName);
        Path imagePath = resolveStoredPath(uploadRoot, servedPath);
        Files.createDirectories(imagePath.getParent());

        try (InputStream inputStream = image.getInputStream()) {
            Files.copy(inputStream, imagePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException exception) {
            deleteBannerAsset(servedPath);
            throw exception;
        }

        return servedPath;
    }

    public BannerAssetFile loadBannerImage(String bannerId, String fileName) throws IOException {
        String normalizedBannerId = normalizeBannerId(bannerId);
        String normalizedFileName = normalizeFileName(fileName);
        String servedPath = buildServedPath(normalizedBannerId, normalizedFileName);
        Path imagePath = resolveStoredPath(resolveUploadRoot(), servedPath);

        if (!Files.exists(imagePath) || !Files.isRegularFile(imagePath)) {
            ensureStoredAsset(normalizedBannerId, normalizedFileName);
        }

        if (!Files.exists(imagePath) || !Files.isRegularFile(imagePath)) {
            throw new NoSuchElementException("banner asset not found");
        }

        return new BannerAssetFile(new PathResource(imagePath), resolveMediaType(imagePath));
    }

    public boolean ensureStoredAsset(String bannerId, String fileName) throws IOException {
        String normalizedBannerId = normalizeBannerId(bannerId);
        String normalizedFileName = normalizeFileName(fileName);
        String servedPath = buildServedPath(normalizedBannerId, normalizedFileName);
        Path imagePath = resolveStoredPath(resolveUploadRoot(), servedPath);
        return Files.exists(imagePath) && Files.isRegularFile(imagePath);
    }

    public boolean ensureManagedHeroAsset(String bannerId, String fileName) throws IOException {
        String normalizedBannerId = normalizeBannerId(bannerId);
        String normalizedFileName = normalizeFileName(fileName);
        String servedPath = buildServedPath(normalizedBannerId, normalizedFileName);
        Path imagePath = resolveStoredPath(resolveUploadRoot(), servedPath);
        return Files.exists(imagePath) && Files.isRegularFile(imagePath);
    }

    public void ensureManagedHeroAssets() {
        for (Map.Entry<String, String> entry : Map.of(
            "air_home_hero_1", "slide1.png",
            "air_home_hero_2", "slide2.png",
            "air_home_hero_3", "slide3.png"
        ).entrySet()) {
            try {
                ensureManagedHeroAsset(entry.getKey(), entry.getValue());
            } catch (IOException ignored) {
                // 외부 저장소 상태는 읽기 경로에서만 확인하고, 실패해도 업로드/서빙 흐름은 막지 않는다.
            }
        }
    }

    public void deleteBannerAsset(String servedPath) {
        if (!StringUtils.hasText(servedPath)) {
            return;
        }

        try {
            Files.deleteIfExists(resolveStoredPath(resolveUploadRoot(), servedPath));
        } catch (RuntimeException | IOException ignored) {
            // 파일 정리는 최선을 다하고, 실패해도 업로드 흐름을 막지 않는다.
        }
    }

    public String buildServedPath(String bannerId, String fileName) {
        String normalizedBannerId = normalizeBannerId(bannerId);
        String normalizedFileName = normalizeFileName(fileName);
        String encodedBannerId = UriUtils.encodePathSegment(normalizedBannerId, java.nio.charset.StandardCharsets.UTF_8);
        String encodedFileName = UriUtils.encodePathSegment(normalizedFileName, java.nio.charset.StandardCharsets.UTF_8);
        return "/api/banners/assets/%s/%s".formatted(encodedBannerId, encodedFileName);
    }

    private void validateBannerImage(MultipartFile image) {
        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("배너 이미지를 업로드해주세요.");
        }

        if (image.getSize() > MAX_BANNER_BYTES) {
            throw new IllegalArgumentException("배너 이미지는 10MB 이하만 허용됩니다.");
        }

        String originalFilename = StringUtils.getFilename(image.getOriginalFilename());
        if (!StringUtils.hasText(originalFilename)) {
            throw new IllegalArgumentException("배너 이미지 형식이 올바르지 않습니다.");
        }

        String extension = resolveExtension(originalFilename);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("배너 이미지 형식이 올바르지 않습니다.");
        }

        String contentType = normalizeContentType(image.getContentType());
        if (!ALLOWED_MIME_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("배너 이미지 형식이 올바르지 않습니다.");
        }
    }

    private String resolveExtension(MultipartFile image) {
        return resolveExtension(StringUtils.getFilename(image.getOriginalFilename()));
    }

    private String resolveExtension(String fileName) {
        if (!StringUtils.hasText(fileName)) {
            throw new IllegalArgumentException("배너 이미지 형식이 올바르지 않습니다.");
        }

        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex < 0 || lastDotIndex == fileName.length() - 1) {
            throw new IllegalArgumentException("배너 이미지 형식이 올바르지 않습니다.");
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

    private String normalizeBannerId(String bannerId) {
        if (!StringUtils.hasText(bannerId)) {
            throw new IllegalArgumentException("bannerId is required");
        }

        String normalized = bannerId.trim();
        if (normalized.contains("/") || normalized.contains("\\") || normalized.contains("..")) {
            throw new IllegalArgumentException("bannerId is invalid");
        }

        return normalized;
    }

    private String normalizeFileName(String fileName) {
        if (!StringUtils.hasText(fileName)) {
            throw new IllegalArgumentException("fileName is required");
        }

        String normalized = fileName.trim();
        if (normalized.contains("/") || normalized.contains("\\") || normalized.contains("..")) {
            throw new IllegalArgumentException("fileName is invalid");
        }

        return normalized;
    }

    private Path resolveStoredPath(Path uploadRoot, String servedPath) {
        if (!StringUtils.hasText(servedPath)) {
            throw new IllegalArgumentException("asset path is required");
        }

        String normalizedRelativePath = servedPath.startsWith("/")
            ? servedPath.substring(1)
            : servedPath;

        Path resolved = uploadRoot.resolve(normalizedRelativePath).normalize();
        if (!resolved.startsWith(uploadRoot.normalize())) {
            throw new IllegalArgumentException("asset path is invalid");
        }

        return resolved;
    }

    private Path resolveUploadRoot() {
        String configuredRoot = normalize(appProperties.banner().uploadRoot());
        if (!StringUtils.hasText(configuredRoot)) {
            throw new IllegalStateException("배너 업로드 경로가 설정되지 않았습니다.");
        }

        return Path.of(configuredRoot).toAbsolutePath().normalize();
    }

    private MediaType resolveMediaType(Path imagePath) throws IOException {
        String contentType = Files.probeContentType(imagePath);
        if (!StringUtils.hasText(contentType)) {
            contentType = inferContentType(imagePath.getFileName().toString());
        }

        return MediaType.parseMediaType(contentType);
    }

    private String inferContentType(String fileName) {
        String extension = resolveExtension(fileName);
        return "png".equals(extension) ? "image/png" : "image/jpeg";
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }

    public record BannerAssetFile(Resource resource, MediaType mediaType) {
    }
}
