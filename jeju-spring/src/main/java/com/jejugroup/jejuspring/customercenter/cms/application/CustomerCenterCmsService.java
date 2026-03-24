package com.jejugroup.jejuspring.customercenter.cms.application;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.jejugroup.jejuspring.config.AppProperties;

@Service
public class CustomerCenterCmsService {
    private static final Set<String> ALLOWED_SERVICE_TYPES = Set.of(
        "jeju-air",
        "jeju-stay",
        "jeju-rental",
        "common"
    );

    private final AppProperties appProperties;

    public CustomerCenterCmsService(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    public List<NoticeView> listNotices(String serviceType) throws SQLException {
        String normalizedServiceType = normalizeServiceTypeFilter(serviceType);
        StringBuilder query = new StringBuilder("""
            SELECT id, service_type, title, excerpt, content, is_pinned, is_active, published_at, created_at, updated_at
            FROM notices
            WHERE is_active = 1
            """);

        if (normalizedServiceType != null) {
            query.append(" AND service_type = ?");
        }

        query.append("""
            ORDER BY is_pinned DESC, COALESCE(published_at, created_at) DESC, id DESC
            """);

        List<NoticeView> notices = new ArrayList<>();
        try (Connection connection = openConnection(true);
             PreparedStatement statement = connection.prepareStatement(query.toString())) {
            if (normalizedServiceType != null) {
                statement.setString(1, normalizedServiceType);
            }

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    notices.add(toNoticeView(readNoticeRow(resultSet)));
                }
            }
        }

        return List.copyOf(notices);
    }

    public NoticeView getNotice(long noticeId, String serviceType) throws SQLException {
        NoticeRow notice = loadVisibleNotice(noticeId, serviceType);
        if (notice == null) {
            throw new NoSuchElementException("Notice not found");
        }
        return toNoticeView(notice);
    }

    public NoticeView createNotice(NoticeUpsertRequest request) throws SQLException {
        NoticeDraft draft = requireNoticeDraft(request, null);
        long id = insertNotice(draft);
        return requireNotice(id);
    }

    public NoticeView updateNotice(long noticeId, NoticeUpsertRequest request) throws SQLException {
        NoticeRow existing = loadNoticeById(noticeId);
        if (existing == null) {
            throw new NoSuchElementException("Notice not found");
        }

        NoticeDraft draft = requireNoticeDraft(request, existing);
        updateNoticeRecord(noticeId, draft);
        return requireNotice(noticeId);
    }

    public DeletedRecord deleteNotice(long noticeId) throws SQLException {
        NoticeRow existing = loadNoticeById(noticeId);
        if (existing == null) {
            throw new NoSuchElementException("Notice not found");
        }

        try (Connection connection = openConnection(false);
             PreparedStatement statement = connection.prepareStatement("""
                 UPDATE notices
                 SET is_active = 0,
                     updated_at = CURRENT_TIMESTAMP(3)
                 WHERE id = ?
                 """)) {
            statement.setLong(1, noticeId);
            statement.executeUpdate();
        }

        return new DeletedRecord(noticeId, "notice");
    }

    public List<FaqView> listFaqs(String serviceType) throws SQLException {
        String normalizedServiceType = normalizeServiceTypeFilter(serviceType);
        StringBuilder query = new StringBuilder("""
            SELECT id, service_type, category, question, answer, sort_order, is_active, created_at, updated_at
            FROM faqs
            WHERE is_active = 1
            """);

        if (normalizedServiceType != null) {
            query.append(" AND service_type = ?");
        }

        query.append("""
            ORDER BY sort_order ASC, id ASC
            """);

        List<FaqView> faqs = new ArrayList<>();
        try (Connection connection = openConnection(true);
             PreparedStatement statement = connection.prepareStatement(query.toString())) {
            if (normalizedServiceType != null) {
                statement.setString(1, normalizedServiceType);
            }

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    faqs.add(toFaqView(readFaqRow(resultSet)));
                }
            }
        }

        return List.copyOf(faqs);
    }

    public FaqView getFaq(long faqId, String serviceType) throws SQLException {
        FaqRow faq = loadVisibleFaq(faqId, serviceType);
        if (faq == null) {
            throw new NoSuchElementException("FAQ not found");
        }
        return toFaqView(faq);
    }

    public FaqView createFaq(FaqUpsertRequest request) throws SQLException {
        FaqDraft draft = requireFaqDraft(request, null);
        long id = insertFaq(draft);
        return requireFaq(id);
    }

    public FaqView updateFaq(long faqId, FaqUpsertRequest request) throws SQLException {
        FaqRow existing = loadFaqById(faqId);
        if (existing == null) {
            throw new NoSuchElementException("FAQ not found");
        }

        FaqDraft draft = requireFaqDraft(request, existing);
        updateFaqRecord(faqId, draft);
        return requireFaq(faqId);
    }

    public DeletedRecord deleteFaq(long faqId) throws SQLException {
        FaqRow existing = loadFaqById(faqId);
        if (existing == null) {
            throw new NoSuchElementException("FAQ not found");
        }

        try (Connection connection = openConnection(false);
             PreparedStatement statement = connection.prepareStatement("""
                 UPDATE faqs
                 SET is_active = 0,
                     updated_at = CURRENT_TIMESTAMP(3)
                 WHERE id = ?
                 """)) {
            statement.setLong(1, faqId);
            statement.executeUpdate();
        }

        return new DeletedRecord(faqId, "faq");
    }

    private NoticeView requireNotice(long noticeId) throws SQLException {
        NoticeRow notice = loadNoticeById(noticeId);
        if (notice == null) {
            throw new NoSuchElementException("Notice not found");
        }
        return toNoticeView(notice);
    }

    private FaqView requireFaq(long faqId) throws SQLException {
        FaqRow faq = loadFaqById(faqId);
        if (faq == null) {
            throw new NoSuchElementException("FAQ not found");
        }
        return toFaqView(faq);
    }

    private long insertNotice(NoticeDraft draft) throws SQLException {
        try (Connection connection = openConnection(false);
             PreparedStatement statement = connection.prepareStatement("""
                 INSERT INTO notices (
                     service_type,
                     title,
                     excerpt,
                     content,
                     is_pinned,
                     is_active,
                     published_at
                 ) VALUES (?, ?, ?, ?, ?, ?, ?)
                 """, Statement.RETURN_GENERATED_KEYS)) {
            bindNoticeDraft(statement, draft);
            statement.executeUpdate();

            try (ResultSet generatedKeys = statement.getGeneratedKeys()) {
                if (!generatedKeys.next()) {
                    throw new SQLException("Notice insert failed");
                }
                return generatedKeys.getLong(1);
            }
        }
    }

    private void updateNoticeRecord(long noticeId, NoticeDraft draft) throws SQLException {
        try (Connection connection = openConnection(false);
             PreparedStatement statement = connection.prepareStatement("""
                 UPDATE notices
                 SET service_type = ?,
                     title = ?,
                     excerpt = ?,
                     content = ?,
                     is_pinned = ?,
                     is_active = ?,
                     published_at = ?,
                     updated_at = CURRENT_TIMESTAMP(3)
                 WHERE id = ?
                 """)) {
            bindNoticeDraft(statement, draft);
            statement.setLong(8, noticeId);
            statement.executeUpdate();
        }
    }

    private void bindNoticeDraft(PreparedStatement statement, NoticeDraft draft) throws SQLException {
        statement.setString(1, draft.serviceType());
        statement.setString(2, draft.title());
        setNullableString(statement, 3, draft.excerpt());
        statement.setString(4, draft.content());
        statement.setBoolean(5, draft.pinned());
        statement.setBoolean(6, draft.active());
        setNullableTimestamp(statement, 7, draft.publishedAt());
    }

    private long insertFaq(FaqDraft draft) throws SQLException {
        try (Connection connection = openConnection(false);
             PreparedStatement statement = connection.prepareStatement("""
                 INSERT INTO faqs (
                     service_type,
                     category,
                     question,
                     answer,
                     sort_order,
                     is_active
                 ) VALUES (?, ?, ?, ?, ?, ?)
                 """, Statement.RETURN_GENERATED_KEYS)) {
            bindFaqDraft(statement, draft);
            statement.executeUpdate();

            try (ResultSet generatedKeys = statement.getGeneratedKeys()) {
                if (!generatedKeys.next()) {
                    throw new SQLException("FAQ insert failed");
                }
                return generatedKeys.getLong(1);
            }
        }
    }

    private void updateFaqRecord(long faqId, FaqDraft draft) throws SQLException {
        try (Connection connection = openConnection(false);
             PreparedStatement statement = connection.prepareStatement("""
                 UPDATE faqs
                 SET service_type = ?,
                     category = ?,
                     question = ?,
                     answer = ?,
                     sort_order = ?,
                     is_active = ?,
                     updated_at = CURRENT_TIMESTAMP(3)
                 WHERE id = ?
                 """)) {
            bindFaqDraft(statement, draft);
            statement.setLong(7, faqId);
            statement.executeUpdate();
        }
    }

    private void bindFaqDraft(PreparedStatement statement, FaqDraft draft) throws SQLException {
        statement.setString(1, draft.serviceType());
        statement.setString(2, draft.category());
        statement.setString(3, draft.question());
        statement.setString(4, draft.answer());
        statement.setInt(5, draft.sortOrder());
        statement.setBoolean(6, draft.active());
    }

    private NoticeDraft requireNoticeDraft(NoticeUpsertRequest request, NoticeRow existing) {
        if (request == null) {
            throw new IllegalArgumentException("Request body is required");
        }

        String serviceType = existing == null
            ? normalizeWriteServiceType(request.serviceType())
            : normalizeWriteServiceTypeOrDefault(request.serviceType(), existing.serviceType());
        String title = mergeRequiredText(existing == null ? null : existing.title(), request.title(), "title", 255);
        String content = mergeRequiredText(existing == null ? null : existing.content(), request.content(), "content", Integer.MAX_VALUE);
        String excerpt = mergeOptionalText(existing == null ? null : existing.excerpt(), request.excerpt(), 500);
        boolean pinned = request.pinned() != null ? request.pinned() : existing != null && existing.pinned();
        boolean active = request.active() != null ? request.active() : existing == null || existing.active();
        LocalDateTime publishedAt = mergePublishedAt(existing == null ? null : existing.publishedAt(), request.publishedAt());

        return new NoticeDraft(serviceType, title, excerpt, content, pinned, active, publishedAt);
    }

    private FaqDraft requireFaqDraft(FaqUpsertRequest request, FaqRow existing) {
        if (request == null) {
            throw new IllegalArgumentException("Request body is required");
        }

        String serviceType = existing == null
            ? normalizeWriteServiceType(request.serviceType())
            : normalizeWriteServiceTypeOrDefault(request.serviceType(), existing.serviceType());
        String category = mergeRequiredText(existing == null ? null : existing.category(), request.category(), "category", 120);
        String question = mergeRequiredText(existing == null ? null : existing.question(), request.question(), "question", 500);
        String answer = mergeRequiredText(existing == null ? null : existing.answer(), request.answer(), "answer", Integer.MAX_VALUE);
        int sortOrder = request.sortOrder() != null ? request.sortOrder() : existing == null ? 0 : existing.sortOrder();
        boolean active = request.active() != null ? request.active() : existing == null || existing.active();

        return new FaqDraft(serviceType, category, question, answer, sortOrder, active);
    }

    private String mergeRequiredText(String existingValue, String requestedValue, String fieldName, int maxLength) {
        String candidate = requestedValue != null ? requestedValue : existingValue;
        if (!StringUtils.hasText(candidate)) {
            throw new IllegalArgumentException(fieldName + " is required");
        }

        String normalized = candidate.trim();
        if (normalized.length() > maxLength) {
            throw new IllegalArgumentException(fieldName + " is too long");
        }

        return normalized;
    }

    private String mergeOptionalText(String existingValue, String requestedValue, int maxLength) {
        String candidate = requestedValue != null ? requestedValue : existingValue;
        if (!StringUtils.hasText(candidate)) {
            return null;
        }

        String normalized = candidate.trim();
        if (normalized.length() > maxLength) {
            throw new IllegalArgumentException("excerpt is too long");
        }

        return normalized;
    }

    private LocalDateTime mergePublishedAt(LocalDateTime existingValue, String requestedValue) {
        if (requestedValue == null) {
            return existingValue;
        }

        String normalized = requestedValue.trim();
        if (!StringUtils.hasText(normalized)) {
            return null;
        }

        try {
            return LocalDateTime.parse(normalized);
        } catch (DateTimeParseException exception) {
            throw new IllegalArgumentException("publishedAt must be an ISO-8601 date-time value");
        }
    }

    private String normalizeWriteServiceType(String serviceType) {
        if (!StringUtils.hasText(serviceType)) {
            return "common";
        }

        String normalized = serviceType.trim();
        if (!ALLOWED_SERVICE_TYPES.contains(normalized)) {
            throw new IllegalArgumentException("serviceType must be one of jeju-air, jeju-stay, jeju-rental, common");
        }

        return normalized;
    }

    private String normalizeWriteServiceTypeOrDefault(String serviceType, String fallbackServiceType) {
        if (!StringUtils.hasText(serviceType)) {
            return fallbackServiceType;
        }
        return normalizeWriteServiceType(serviceType);
    }

    private String normalizeServiceTypeFilter(String serviceType) {
        if (!StringUtils.hasText(serviceType)) {
            return null;
        }

        String normalized = serviceType.trim();
        if (!ALLOWED_SERVICE_TYPES.contains(normalized)) {
            throw new IllegalArgumentException("serviceType must be one of jeju-air, jeju-stay, jeju-rental, common");
        }

        return normalized;
    }

    private NoticeRow loadVisibleNotice(long noticeId, String serviceType) throws SQLException {
        String normalizedServiceType = normalizeServiceTypeFilter(serviceType);
        StringBuilder query = new StringBuilder("""
            SELECT id, service_type, title, excerpt, content, is_pinned, is_active, published_at, created_at, updated_at
            FROM notices
            WHERE id = ?
              AND is_active = 1
            """);

        if (normalizedServiceType != null) {
            query.append(" AND service_type = ?");
        }

        try (Connection connection = openConnection(true);
             PreparedStatement statement = connection.prepareStatement(query.toString())) {
            statement.setLong(1, noticeId);
            if (normalizedServiceType != null) {
                statement.setString(2, normalizedServiceType);
            }

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return null;
                }
                return readNoticeRow(resultSet);
            }
        }
    }

    private NoticeRow loadNoticeById(long noticeId) throws SQLException {
        try (Connection connection = openConnection(true);
             PreparedStatement statement = connection.prepareStatement("""
                 SELECT id, service_type, title, excerpt, content, is_pinned, is_active, published_at, created_at, updated_at
                 FROM notices
                 WHERE id = ?
                 """)) {
            statement.setLong(1, noticeId);

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return null;
                }
                return readNoticeRow(resultSet);
            }
        }
    }

    private FaqRow loadVisibleFaq(long faqId, String serviceType) throws SQLException {
        String normalizedServiceType = normalizeServiceTypeFilter(serviceType);
        StringBuilder query = new StringBuilder("""
            SELECT id, service_type, category, question, answer, sort_order, is_active, created_at, updated_at
            FROM faqs
            WHERE id = ?
              AND is_active = 1
            """);

        if (normalizedServiceType != null) {
            query.append(" AND service_type = ?");
        }

        try (Connection connection = openConnection(true);
             PreparedStatement statement = connection.prepareStatement(query.toString())) {
            statement.setLong(1, faqId);
            if (normalizedServiceType != null) {
                statement.setString(2, normalizedServiceType);
            }

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return null;
                }
                return readFaqRow(resultSet);
            }
        }
    }

    private FaqRow loadFaqById(long faqId) throws SQLException {
        try (Connection connection = openConnection(true);
             PreparedStatement statement = connection.prepareStatement("""
                 SELECT id, service_type, category, question, answer, sort_order, is_active, created_at, updated_at
                 FROM faqs
                 WHERE id = ?
                 """)) {
            statement.setLong(1, faqId);

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return null;
                }
                return readFaqRow(resultSet);
            }
        }
    }

    private NoticeRow readNoticeRow(ResultSet resultSet) throws SQLException {
        return new NoticeRow(
            resultSet.getLong("id"),
            resultSet.getString("service_type"),
            resultSet.getString("title"),
            resultSet.getString("excerpt"),
            resultSet.getString("content"),
            resultSet.getBoolean("is_pinned"),
            resultSet.getBoolean("is_active"),
            toLocalDateTime(resultSet.getTimestamp("published_at")),
            toLocalDateTime(resultSet.getTimestamp("created_at")),
            toLocalDateTime(resultSet.getTimestamp("updated_at"))
        );
    }

    private FaqRow readFaqRow(ResultSet resultSet) throws SQLException {
        return new FaqRow(
            resultSet.getLong("id"),
            resultSet.getString("service_type"),
            resultSet.getString("category"),
            resultSet.getString("question"),
            resultSet.getString("answer"),
            resultSet.getInt("sort_order"),
            resultSet.getBoolean("is_active"),
            toLocalDateTime(resultSet.getTimestamp("created_at")),
            toLocalDateTime(resultSet.getTimestamp("updated_at"))
        );
    }

    private NoticeView toNoticeView(NoticeRow row) {
        return new NoticeView(
            row.id(),
            row.serviceType(),
            row.title(),
            row.excerpt(),
            row.content(),
            row.pinned(),
            row.active(),
            row.publishedAt(),
            row.createdAt(),
            row.updatedAt()
        );
    }

    private FaqView toFaqView(FaqRow row) {
        return new FaqView(
            row.id(),
            row.serviceType(),
            row.category(),
            row.question(),
            row.answer(),
            row.sortOrder(),
            row.active(),
            row.createdAt(),
            row.updatedAt()
        );
    }

    private Connection openConnection(boolean readOnly) throws SQLException {
        String url = normalize(appProperties.alwaysdata().dbUrl());
        String user = normalize(appProperties.alwaysdata().dbUser());
        String password = normalize(appProperties.alwaysdata().dbPassword());

        if (!StringUtils.hasText(url) || !StringUtils.hasText(user) || !StringUtils.hasText(password)) {
            throw new SQLException("Customer-center CMS DB configuration is missing");
        }

        Connection connection = DriverManager.getConnection(url, user, password);
        connection.setReadOnly(readOnly);
        return connection;
    }

    private void setNullableString(PreparedStatement statement, int index, String value) throws SQLException {
        if (value == null) {
            statement.setNull(index, java.sql.Types.VARCHAR);
            return;
        }
        statement.setString(index, value);
    }

    private void setNullableTimestamp(PreparedStatement statement, int index, LocalDateTime value) throws SQLException {
        if (value == null) {
            statement.setNull(index, java.sql.Types.TIMESTAMP);
            return;
        }
        statement.setTimestamp(index, Timestamp.valueOf(value));
    }

    private LocalDateTime toLocalDateTime(Timestamp timestamp) {
        return timestamp == null ? null : timestamp.toLocalDateTime();
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }

    public record NoticeUpsertRequest(
        String serviceType,
        String title,
        String excerpt,
        String content,
        Boolean active,
        Boolean pinned,
        String publishedAt
    ) {
    }

    public record FaqUpsertRequest(
        String serviceType,
        String category,
        String question,
        String answer,
        Integer sortOrder,
        Boolean active
    ) {
    }

    public record NoticeView(
        long id,
        String serviceType,
        String title,
        String excerpt,
        String content,
        boolean pinned,
        boolean active,
        LocalDateTime publishedAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
    ) {
    }

    public record FaqView(
        long id,
        String serviceType,
        String category,
        String question,
        String answer,
        int sortOrder,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
    ) {
    }

    public record DeletedRecord(
        long id,
        String entity
    ) {
    }

    private record NoticeDraft(
        String serviceType,
        String title,
        String excerpt,
        String content,
        boolean pinned,
        boolean active,
        LocalDateTime publishedAt
    ) {
    }

    private record FaqDraft(
        String serviceType,
        String category,
        String question,
        String answer,
        int sortOrder,
        boolean active
    ) {
    }

    private record NoticeRow(
        long id,
        String serviceType,
        String title,
        String excerpt,
        String content,
        boolean pinned,
        boolean active,
        LocalDateTime publishedAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
    ) {
    }

    private record FaqRow(
        long id,
        String serviceType,
        String category,
        String question,
        String answer,
        int sortOrder,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
    ) {
    }
}
