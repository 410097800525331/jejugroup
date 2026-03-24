package com.jejugroup.jejuspring.customercenter.support;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.Set;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jejugroup.jejuspring.auth.model.SessionUser;
import com.jejugroup.jejuspring.config.AppProperties;

@RestController
@RequestMapping("/api/customer-center/support")
public class SupportApiController {
    private final SupportService supportService;

    public SupportApiController(SupportService supportService) {
        this.supportService = supportService;
    }

    @GetMapping(value = "/categories", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> categories(@RequestParam(name = "serviceType", required = false) String serviceType) {
        return run(() -> supportService.listCategories(serviceType));
    }

    @GetMapping(value = "/tickets", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> tickets(
        @RequestParam(name = "serviceType", required = false) String serviceType,
        HttpSession session
    ) {
        return runWithUser(session, user -> supportService.listTickets(user, serviceType));
    }

    @PostMapping(value = "/tickets", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createTicket(@RequestBody SupportTicketUpsertRequest request, HttpSession session) {
        return runWithUser(session, user -> supportService.createTicket(user, request));
    }

    @GetMapping(value = "/tickets/{ticketId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> ticket(@PathVariable("ticketId") long ticketId, HttpSession session) {
        return runWithUser(session, user -> supportService.getTicket(user, ticketId));
    }

    @PutMapping(value = "/tickets/{ticketId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateTicket(
        @PathVariable("ticketId") long ticketId,
        @RequestBody SupportTicketUpsertRequest request,
        HttpSession session
    ) {
        return runWithUser(session, user -> supportService.updateTicket(user, ticketId, request));
    }

    @DeleteMapping(value = "/tickets/{ticketId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> deleteTicket(@PathVariable("ticketId") long ticketId, HttpSession session) {
        return runWithUser(session, user -> {
            supportService.deleteTicket(user, ticketId);
            return Map.of("deleted", true, "ticketId", ticketId);
        });
    }

    @GetMapping(value = "/tickets/{ticketId}/comments", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> comments(@PathVariable("ticketId") long ticketId, HttpSession session) {
        return runWithUser(session, user -> supportService.listComments(user, ticketId));
    }

    @PostMapping(value = "/tickets/{ticketId}/comments", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createComment(
        @PathVariable("ticketId") long ticketId,
        @RequestBody SupportCommentUpsertRequest request,
        HttpSession session
    ) {
        return runWithUser(session, user -> supportService.createComment(user, ticketId, request));
    }

    @PutMapping(value = "/tickets/{ticketId}/comments/{commentId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateComment(
        @PathVariable("ticketId") long ticketId,
        @PathVariable("commentId") long commentId,
        @RequestBody SupportCommentUpsertRequest request,
        HttpSession session
    ) {
        return runWithUser(session, user -> supportService.updateComment(user, ticketId, commentId, request));
    }

    @DeleteMapping(value = "/tickets/{ticketId}/comments/{commentId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> deleteComment(
        @PathVariable("ticketId") long ticketId,
        @PathVariable("commentId") long commentId,
        HttpSession session
    ) {
        return runWithUser(session, user -> {
            supportService.deleteComment(user, ticketId, commentId);
            return Map.of("deleted", true, "commentId", commentId);
        });
    }

    @GetMapping(value = "/tickets/{ticketId}/attachments", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> attachments(@PathVariable("ticketId") long ticketId, HttpSession session) {
        return runWithUser(session, user -> supportService.listAttachments(user, ticketId));
    }

    @PostMapping(value = "/tickets/{ticketId}/attachments", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createAttachment(
        @PathVariable("ticketId") long ticketId,
        @RequestBody SupportAttachmentUpsertRequest request,
        HttpSession session
    ) {
        return runWithUser(session, user -> supportService.createAttachment(user, ticketId, request));
    }

    @PutMapping(value = "/tickets/{ticketId}/attachments/{attachmentId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateAttachment(
        @PathVariable("ticketId") long ticketId,
        @PathVariable("attachmentId") long attachmentId,
        @RequestBody SupportAttachmentUpsertRequest request,
        HttpSession session
    ) {
        return runWithUser(session, user -> supportService.updateAttachment(user, ticketId, attachmentId, request));
    }

    @DeleteMapping(value = "/tickets/{ticketId}/attachments/{attachmentId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> deleteAttachment(
        @PathVariable("ticketId") long ticketId,
        @PathVariable("attachmentId") long attachmentId,
        HttpSession session
    ) {
        return runWithUser(session, user -> {
            supportService.deleteAttachment(user, ticketId, attachmentId);
            return Map.of("deleted", true, "attachmentId", attachmentId);
        });
    }

    private ResponseEntity<?> run(ThrowingSupplier<Object> supplier) {
        try {
            return ok(supplier.get());
        } catch (IllegalArgumentException exception) {
            return error(HttpStatus.BAD_REQUEST, exception.getMessage());
        } catch (NoSuchElementException exception) {
            return error(HttpStatus.NOT_FOUND, exception.getMessage());
        } catch (ForbiddenOperationException exception) {
            return error(HttpStatus.FORBIDDEN, exception.getMessage());
        } catch (SQLException exception) {
            return error(HttpStatus.SERVICE_UNAVAILABLE, "Spring customer-center support DB configuration is missing");
        }
    }

    private ResponseEntity<?> runWithUser(HttpSession session, UserFunction<Object> function) {
        Object sessionUser = session.getAttribute("user");
        if (!(sessionUser instanceof SessionUser user)) {
            return error(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        return run(() -> function.apply(user));
    }

    private ResponseEntity<Map<String, Object>> ok(Object data) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", true);
        body.put("data", data);
        return ResponseEntity.ok(body);
    }

    private ResponseEntity<Map<String, Object>> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(Map.of(
            "success", false,
            "message", message
        ));
    }

    @FunctionalInterface
    private interface ThrowingSupplier<T> {
        T get() throws SQLException;
    }

    @FunctionalInterface
    private interface UserFunction<T> {
        T apply(SessionUser user) throws SQLException;
    }
}

@Service
class SupportService {
    private static final Set<String> ALLOWED_SERVICE_TYPES = Set.of("jeju-air", "jeju-stay", "jeju-rental", "common");
    private static final Set<String> ALLOWED_STATUSES = Set.of(
        "pending",
        "in_progress",
        "waiting",
        "open",
        "answered",
        "resolved",
        "closed"
    );
    private static final Set<String> ALLOWED_PRIORITIES = Set.of("low", "normal", "high", "urgent");

    private final AppProperties appProperties;

    SupportService(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    List<SupportCategoryView> listCategories(String serviceType) throws SQLException {
        String normalizedServiceType = normalizeOptionalServiceType(serviceType);
        StringBuilder query = new StringBuilder("""
            SELECT id, service_type, code, name, description, sort_order, is_active
            FROM support_categories
            WHERE is_active = 1
            """);
        if (normalizedServiceType != null) {
            query.append(" AND service_type = ?");
        }
        query.append(" ORDER BY sort_order ASC, id ASC");

        try (Connection connection = openConnection();
             PreparedStatement statement = connection.prepareStatement(query.toString())) {
            if (normalizedServiceType != null) {
                statement.setString(1, normalizedServiceType);
            }

            List<SupportCategoryView> categories = new ArrayList<>();
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    categories.add(toCategoryView(resultSet));
                }
            }
            return categories;
        }
    }

    List<SupportTicketView> listTickets(SessionUser user, String serviceType) throws SQLException {
        requireAuthenticated(user);
        String normalizedServiceType = normalizeOptionalServiceType(serviceType);
        StringBuilder query = new StringBuilder("""
            SELECT
                t.id,
                t.user_id,
                t.service_type,
                t.category_id,
                t.inquiry_type_code,
                t.requester_name,
                t.requester_email,
                t.requester_phone,
                t.title,
                t.content,
                t.status,
                t.priority,
                c.code AS category_code,
                c.name AS category_name,
                c.description AS category_description
            FROM support_tickets t
            LEFT JOIN support_categories c ON c.id = t.category_id
            WHERE 1 = 1
            """);
        if (normalizedServiceType != null) {
            query.append(" AND t.service_type = ?");
        }
        if (!isAdmin(user)) {
            query.append(" AND t.user_id = ?");
        }
        query.append(" ORDER BY t.created_at DESC, t.id DESC");

        try (Connection connection = openConnection();
             PreparedStatement statement = connection.prepareStatement(query.toString())) {
            int index = 1;
            if (normalizedServiceType != null) {
                statement.setString(index++, normalizedServiceType);
            }
            if (!isAdmin(user)) {
                statement.setString(index, requireText(user.id(), "userId"));
            }

            List<SupportTicketView> tickets = new ArrayList<>();
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    tickets.add(toTicketView(resultSet));
                }
            }
            return tickets;
        }
    }

    SupportTicketView createTicket(SessionUser user, SupportTicketUpsertRequest request) throws SQLException {
        requireAuthenticated(user);
        String serviceType = normalizeRequiredServiceType(request.serviceType());
        Long categoryId = normalizeOptionalPositiveLong(request.categoryId(), "categoryId");
        String inquiryTypeCode = requireText(request.inquiryTypeCode(), "inquiryTypeCode");
        String requesterName = requireText(request.requesterName(), "requesterName");
        String requesterEmail = requireText(request.requesterEmail(), "requesterEmail");
        String requesterPhone = requireText(request.requesterPhone(), "requesterPhone");
        String title = requireText(request.title(), "title");
        String content = requireText(request.content(), "content");
        String status = normalizeStatus(request.status());
        String priority = normalizePriority(request.priority());

        try (Connection connection = openConnection()) {
            if (categoryId != null) {
                ensureCategoryMatchesTicketScope(connection, categoryId, serviceType);
            }

            try (PreparedStatement statement = connection.prepareStatement("""
                INSERT INTO support_tickets (
                    user_id, service_type, category_id, inquiry_type_code,
                    requester_name, requester_email, requester_phone,
                    title, content, status, priority
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, Statement.RETURN_GENERATED_KEYS)) {
                statement.setString(1, requireText(user.id(), "userId"));
                statement.setString(2, serviceType);
                if (categoryId == null) {
                    statement.setObject(3, null);
                } else {
                    statement.setLong(3, categoryId);
                }
                statement.setString(4, inquiryTypeCode);
                statement.setString(5, requesterName);
                statement.setString(6, requesterEmail);
                statement.setString(7, requesterPhone);
                statement.setString(8, title);
                statement.setString(9, content);
                statement.setString(10, status);
                statement.setString(11, priority);
                statement.executeUpdate();

                try (ResultSet generatedKeys = statement.getGeneratedKeys()) {
                    if (!generatedKeys.next()) {
                        throw new SQLException("support ticket id was not returned");
                    }
                    return toTicketView(loadTicket(connection, user, generatedKeys.getLong(1)));
                }
            }
        }
    }

    SupportTicketView getTicket(SessionUser user, long ticketId) throws SQLException {
        requireAuthenticated(user);
        try (Connection connection = openConnection()) {
            return toTicketView(loadTicket(connection, user, ticketId));
        }
    }

    SupportTicketView updateTicket(SessionUser user, long ticketId, SupportTicketUpsertRequest request) throws SQLException {
        requireAuthenticated(user);
        String serviceType = normalizeRequiredServiceType(request.serviceType());
        Long categoryId = normalizeOptionalPositiveLong(request.categoryId(), "categoryId");
        String inquiryTypeCode = requireText(request.inquiryTypeCode(), "inquiryTypeCode");
        String requesterName = requireText(request.requesterName(), "requesterName");
        String requesterEmail = requireText(request.requesterEmail(), "requesterEmail");
        String requesterPhone = requireText(request.requesterPhone(), "requesterPhone");
        String title = requireText(request.title(), "title");
        String content = requireText(request.content(), "content");
        String status = normalizeStatus(request.status());
        String priority = normalizePriority(request.priority());

        try (Connection connection = openConnection()) {
            requireTicketAccess(connection, user, ticketId);
            if (categoryId != null) {
                ensureCategoryMatchesTicketScope(connection, categoryId, serviceType);
            }

            try (PreparedStatement statement = connection.prepareStatement("""
                UPDATE support_tickets
                SET service_type = ?,
                    category_id = ?,
                    inquiry_type_code = ?,
                    requester_name = ?,
                    requester_email = ?,
                    requester_phone = ?,
                    title = ?,
                    content = ?,
                    status = ?,
                    priority = ?,
                    updated_at = CURRENT_TIMESTAMP(3)
                WHERE id = ?
                """)) {
                statement.setString(1, serviceType);
                if (categoryId == null) {
                    statement.setObject(2, null);
                } else {
                    statement.setLong(2, categoryId);
                }
                statement.setString(3, inquiryTypeCode);
                statement.setString(4, requesterName);
                statement.setString(5, requesterEmail);
                statement.setString(6, requesterPhone);
                statement.setString(7, title);
                statement.setString(8, content);
                statement.setString(9, status);
                statement.setString(10, priority);
                statement.setLong(11, ticketId);
                int updated = statement.executeUpdate();
                if (updated == 0) {
                    throw new NoSuchElementException("지원 요청을 찾을 수 없습니다.");
                }
            }

            return toTicketView(loadTicket(connection, user, ticketId));
        }
    }

    void deleteTicket(SessionUser user, long ticketId) throws SQLException {
        requireAuthenticated(user);
        try (Connection connection = openConnection()) {
            requireTicketAccess(connection, user, ticketId);
            try (PreparedStatement statement = connection.prepareStatement("""
                DELETE FROM support_tickets
                WHERE id = ?
                """)) {
                statement.setLong(1, ticketId);
                if (statement.executeUpdate() == 0) {
                    throw new NoSuchElementException("지원 요청을 찾을 수 없습니다.");
                }
            }
        }
    }

    List<SupportCommentView> listComments(SessionUser user, long ticketId) throws SQLException {
        requireAuthenticated(user);
        try (Connection connection = openConnection()) {
            requireTicketAccess(connection, user, ticketId);
            try (PreparedStatement statement = connection.prepareStatement("""
                SELECT id, ticket_id, author_user_id, author_role, author_name, content, is_internal
                FROM support_comments
                WHERE ticket_id = ?
                ORDER BY id ASC
                """)) {
                statement.setLong(1, ticketId);
                List<SupportCommentView> comments = new ArrayList<>();
                try (ResultSet resultSet = statement.executeQuery()) {
                    while (resultSet.next()) {
                        comments.add(toCommentView(resultSet));
                    }
                }
                return comments;
            }
        }
    }

    SupportCommentView createComment(SessionUser user, long ticketId, SupportCommentUpsertRequest request) throws SQLException {
        requireAuthenticated(user);
        String content = requireText(request.content(), "content");
        boolean internal = Boolean.TRUE.equals(request.isInternal());

        try (Connection connection = openConnection()) {
            requireTicketAccess(connection, user, ticketId);
            try (PreparedStatement statement = connection.prepareStatement("""
                INSERT INTO support_comments (
                    ticket_id, author_user_id, author_role, author_name, content, is_internal
                ) VALUES (?, ?, ?, ?, ?, ?)
                """, Statement.RETURN_GENERATED_KEYS)) {
                statement.setLong(1, ticketId);
                statement.setString(2, requireText(user.id(), "userId"));
                statement.setString(3, normalizeRole(user.role()));
                statement.setString(4, requireText(user.name(), "userName"));
                statement.setString(5, content);
                statement.setBoolean(6, internal);
                statement.executeUpdate();

                try (ResultSet generatedKeys = statement.getGeneratedKeys()) {
                    if (!generatedKeys.next()) {
                        throw new SQLException("support comment id was not returned");
                    }
                    return loadComment(connection, ticketId, generatedKeys.getLong(1));
                }
            }
        }
    }

    SupportCommentView updateComment(SessionUser user, long ticketId, long commentId, SupportCommentUpsertRequest request) throws SQLException {
        requireAuthenticated(user);
        String content = requireText(request.content(), "content");
        boolean internal = Boolean.TRUE.equals(request.isInternal());

        try (Connection connection = openConnection()) {
            requireTicketAccess(connection, user, ticketId);
            ensureCommentExists(connection, ticketId, commentId);
            try (PreparedStatement statement = connection.prepareStatement("""
                UPDATE support_comments
                SET content = ?,
                    is_internal = ?
                WHERE ticket_id = ? AND id = ?
                """)) {
                statement.setString(1, content);
                statement.setBoolean(2, internal);
                statement.setLong(3, ticketId);
                statement.setLong(4, commentId);
                if (statement.executeUpdate() == 0) {
                    throw new NoSuchElementException("댓글을 찾을 수 없습니다.");
                }
            }
            return loadComment(connection, ticketId, commentId);
        }
    }

    void deleteComment(SessionUser user, long ticketId, long commentId) throws SQLException {
        requireAuthenticated(user);
        try (Connection connection = openConnection()) {
            requireTicketAccess(connection, user, ticketId);
            ensureCommentExists(connection, ticketId, commentId);
            try (PreparedStatement statement = connection.prepareStatement("""
                DELETE FROM support_comments
                WHERE ticket_id = ? AND id = ?
                """)) {
                statement.setLong(1, ticketId);
                statement.setLong(2, commentId);
                if (statement.executeUpdate() == 0) {
                    throw new NoSuchElementException("댓글을 찾을 수 없습니다.");
                }
            }
        }
    }

    List<SupportAttachmentView> listAttachments(SessionUser user, long ticketId) throws SQLException {
        requireAuthenticated(user);
        try (Connection connection = openConnection()) {
            requireTicketAccess(connection, user, ticketId);
            try (PreparedStatement statement = connection.prepareStatement("""
                SELECT id, ticket_id, uploaded_by_user_id, original_filename, stored_filename,
                       storage_key, content_type, file_size_bytes
                FROM support_attachments
                WHERE ticket_id = ?
                ORDER BY id ASC
                """)) {
                statement.setLong(1, ticketId);
                List<SupportAttachmentView> attachments = new ArrayList<>();
                try (ResultSet resultSet = statement.executeQuery()) {
                    while (resultSet.next()) {
                        attachments.add(toAttachmentView(resultSet));
                    }
                }
                return attachments;
            }
        }
    }

    SupportAttachmentView createAttachment(SessionUser user, long ticketId, SupportAttachmentUpsertRequest request) throws SQLException {
        requireAuthenticated(user);
        String originalFilename = requireText(request.originalFilename(), "originalFilename");
        String storedFilename = requireText(request.storedFilename(), "storedFilename");
        String storageKey = requireText(request.storageKey(), "storageKey");
        String contentType = normalizeNullable(request.contentType());
        long fileSizeBytes = normalizeNonNegativeLong(request.fileSizeBytes(), "fileSizeBytes");

        try (Connection connection = openConnection()) {
            requireTicketAccess(connection, user, ticketId);
            try (PreparedStatement statement = connection.prepareStatement("""
                INSERT INTO support_attachments (
                    ticket_id, uploaded_by_user_id, original_filename, stored_filename,
                    storage_key, content_type, file_size_bytes
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                """, Statement.RETURN_GENERATED_KEYS)) {
                statement.setLong(1, ticketId);
                statement.setString(2, requireText(user.id(), "userId"));
                statement.setString(3, originalFilename);
                statement.setString(4, storedFilename);
                statement.setString(5, storageKey);
                statement.setString(6, contentType);
                statement.setLong(7, fileSizeBytes);
                statement.executeUpdate();

                try (ResultSet generatedKeys = statement.getGeneratedKeys()) {
                    if (!generatedKeys.next()) {
                        throw new SQLException("support attachment id was not returned");
                    }
                    return loadAttachment(connection, ticketId, generatedKeys.getLong(1));
                }
            }
        }
    }

    SupportAttachmentView updateAttachment(SessionUser user, long ticketId, long attachmentId, SupportAttachmentUpsertRequest request) throws SQLException {
        requireAuthenticated(user);
        String originalFilename = requireText(request.originalFilename(), "originalFilename");
        String storedFilename = requireText(request.storedFilename(), "storedFilename");
        String storageKey = requireText(request.storageKey(), "storageKey");
        String contentType = normalizeNullable(request.contentType());
        long fileSizeBytes = normalizeNonNegativeLong(request.fileSizeBytes(), "fileSizeBytes");

        try (Connection connection = openConnection()) {
            requireTicketAccess(connection, user, ticketId);
            ensureAttachmentExists(connection, ticketId, attachmentId);
            try (PreparedStatement statement = connection.prepareStatement("""
                UPDATE support_attachments
                SET original_filename = ?,
                    stored_filename = ?,
                    storage_key = ?,
                    content_type = ?,
                    file_size_bytes = ?
                WHERE ticket_id = ? AND id = ?
                """)) {
                statement.setString(1, originalFilename);
                statement.setString(2, storedFilename);
                statement.setString(3, storageKey);
                statement.setString(4, contentType);
                statement.setLong(5, fileSizeBytes);
                statement.setLong(6, ticketId);
                statement.setLong(7, attachmentId);
                if (statement.executeUpdate() == 0) {
                    throw new NoSuchElementException("첨부 메타데이터를 찾을 수 없습니다.");
                }
            }
            return loadAttachment(connection, ticketId, attachmentId);
        }
    }

    void deleteAttachment(SessionUser user, long ticketId, long attachmentId) throws SQLException {
        requireAuthenticated(user);
        try (Connection connection = openConnection()) {
            requireTicketAccess(connection, user, ticketId);
            ensureAttachmentExists(connection, ticketId, attachmentId);
            try (PreparedStatement statement = connection.prepareStatement("""
                DELETE FROM support_attachments
                WHERE ticket_id = ? AND id = ?
                """)) {
                statement.setLong(1, ticketId);
                statement.setLong(2, attachmentId);
                if (statement.executeUpdate() == 0) {
                    throw new NoSuchElementException("첨부 메타데이터를 찾을 수 없습니다.");
                }
            }
        }
    }

    private Connection openConnection() throws SQLException {
        String url = normalizeNullable(appProperties.alwaysdata().dbUrl());
        String user = normalizeNullable(appProperties.alwaysdata().dbUser());
        String password = normalizeNullable(appProperties.alwaysdata().dbPassword());

        if (!StringUtils.hasText(url) || !StringUtils.hasText(user) || !StringUtils.hasText(password)) {
            throw new SQLException("Spring customer-center support DB configuration is missing");
        }

        return DriverManager.getConnection(url, user, password);
    }

    private void requireAuthenticated(SessionUser user) {
        if (user == null || !StringUtils.hasText(user.id())) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }
    }

    private boolean isAdmin(SessionUser user) {
        return user != null && StringUtils.hasText(user.role()) && "ADMIN".equalsIgnoreCase(user.role().trim());
    }

    private String requireText(String value, String fieldName) {
        if (!StringUtils.hasText(value)) {
            throw new IllegalArgumentException(fieldName + "이 필요합니다.");
        }
        return value.trim();
    }

    private String normalizeNullable(String value) {
        return value == null ? null : value.trim();
    }

    private String normalizeRequiredServiceType(String value) {
        String normalized = requireText(value, "serviceType").toLowerCase();
        if (!ALLOWED_SERVICE_TYPES.contains(normalized)) {
            throw new IllegalArgumentException("service_type은 jeju-air, jeju-stay, jeju-rental, common만 허용됩니다.");
        }
        return normalized;
    }

    private String normalizeOptionalServiceType(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        return normalizeRequiredServiceType(value);
    }

    private String normalizeStatus(String value) {
        String normalized = normalizeNullable(value);
        if (!StringUtils.hasText(normalized)) {
            return "pending";
        }
        String candidate = normalized.toLowerCase(Locale.ROOT);
        if (!ALLOWED_STATUSES.contains(candidate)) {
            throw new IllegalArgumentException("status는 pending, in_progress, waiting, open, answered, resolved, closed만 허용됩니다.");
        }
        return candidate;
    }

    private String normalizePriority(String value) {
        String normalized = normalizeNullable(value);
        if (!StringUtils.hasText(normalized)) {
            return "normal";
        }
        String candidate = normalized.toLowerCase(Locale.ROOT);
        if (!ALLOWED_PRIORITIES.contains(candidate)) {
            throw new IllegalArgumentException("priority는 low, normal, high, urgent만 허용됩니다.");
        }
        return candidate;
    }

    private String normalizeRole(String role) {
        String normalized = normalizeNullable(role);
        if (!StringUtils.hasText(normalized)) {
            return "USER";
        }
        return normalized.toUpperCase();
    }

    private Long normalizeOptionalPositiveLong(Long value, String fieldName) {
        if (value == null) {
            return null;
        }
        if (value <= 0) {
            throw new IllegalArgumentException(fieldName + "은 1 이상의 값이어야 합니다.");
        }
        return value;
    }

    private long normalizeNonNegativeLong(Long value, String fieldName) {
        if (value == null) {
            return 0L;
        }
        if (value < 0L) {
            throw new IllegalArgumentException(fieldName + "은 0 이상의 값이어야 합니다.");
        }
        return value;
    }

    private boolean canAccessTicket(SessionUser user, TicketRow ticket) {
        return isAdmin(user) || Objects.equals(requireText(user.id(), "userId"), ticket.userId());
    }

    private TicketRow loadTicket(Connection connection, SessionUser user, long ticketId) throws SQLException {
        TicketRow ticket = loadTicket(connection, ticketId);
        if (!canAccessTicket(user, ticket)) {
            throw new ForbiddenOperationException("권한이 없습니다.");
        }
        return ticket;
    }

    private TicketRow requireTicketAccess(Connection connection, SessionUser user, long ticketId) throws SQLException {
        return loadTicket(connection, user, ticketId);
    }

    private TicketRow loadTicket(Connection connection, long ticketId) throws SQLException {
        try (PreparedStatement statement = connection.prepareStatement("""
            SELECT
                t.id,
                t.user_id,
                t.service_type,
                t.category_id,
                t.inquiry_type_code,
                t.requester_name,
                t.requester_email,
                t.requester_phone,
                t.title,
                t.content,
                t.status,
                t.priority,
                c.code AS category_code,
                c.name AS category_name,
                c.description AS category_description
            FROM support_tickets t
            LEFT JOIN support_categories c ON c.id = t.category_id
            WHERE t.id = ?
            """)) {
            statement.setLong(1, ticketId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    throw new NoSuchElementException("지원 요청을 찾을 수 없습니다.");
                }
                return new TicketRow(
                    resultSet.getLong("id"),
                    normalizeNullable(resultSet.getString("user_id")),
                    normalizeNullable(resultSet.getString("service_type")),
                    resultSet.getObject("category_id") == null ? null : resultSet.getLong("category_id"),
                    normalizeNullable(resultSet.getString("inquiry_type_code")),
                    normalizeNullable(resultSet.getString("requester_name")),
                    normalizeNullable(resultSet.getString("requester_email")),
                    normalizeNullable(resultSet.getString("requester_phone")),
                    normalizeNullable(resultSet.getString("title")),
                    normalizeNullable(resultSet.getString("content")),
                    normalizeNullable(resultSet.getString("status")),
                    normalizeNullable(resultSet.getString("priority")),
                    normalizeNullable(resultSet.getString("category_code")),
                    normalizeNullable(resultSet.getString("category_name")),
                    normalizeNullable(resultSet.getString("category_description"))
                );
            }
        }
    }

    private SupportCommentView loadComment(Connection connection, long ticketId, long commentId) throws SQLException {
        try (PreparedStatement statement = connection.prepareStatement("""
            SELECT id, ticket_id, author_user_id, author_role, author_name, content, is_internal
            FROM support_comments
            WHERE ticket_id = ? AND id = ?
            """)) {
            statement.setLong(1, ticketId);
            statement.setLong(2, commentId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    throw new NoSuchElementException("댓글을 찾을 수 없습니다.");
                }
                return toCommentView(resultSet);
            }
        }
    }

    private SupportAttachmentView loadAttachment(Connection connection, long ticketId, long attachmentId) throws SQLException {
        try (PreparedStatement statement = connection.prepareStatement("""
            SELECT id, ticket_id, uploaded_by_user_id, original_filename, stored_filename,
                   storage_key, content_type, file_size_bytes
            FROM support_attachments
            WHERE ticket_id = ? AND id = ?
            """)) {
            statement.setLong(1, ticketId);
            statement.setLong(2, attachmentId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    throw new NoSuchElementException("첨부 메타데이터를 찾을 수 없습니다.");
                }
                return toAttachmentView(resultSet);
            }
        }
    }

    private void ensureCommentExists(Connection connection, long ticketId, long commentId) throws SQLException {
        try (PreparedStatement statement = connection.prepareStatement("""
            SELECT 1
            FROM support_comments
            WHERE ticket_id = ? AND id = ?
            """)) {
            statement.setLong(1, ticketId);
            statement.setLong(2, commentId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    throw new NoSuchElementException("댓글을 찾을 수 없습니다.");
                }
            }
        }
    }

    private void ensureAttachmentExists(Connection connection, long ticketId, long attachmentId) throws SQLException {
        try (PreparedStatement statement = connection.prepareStatement("""
            SELECT 1
            FROM support_attachments
            WHERE ticket_id = ? AND id = ?
            """)) {
            statement.setLong(1, ticketId);
            statement.setLong(2, attachmentId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    throw new NoSuchElementException("첨부 메타데이터를 찾을 수 없습니다.");
                }
            }
        }
    }

    private void ensureCategoryMatchesTicketScope(Connection connection, long categoryId, String serviceType) throws SQLException {
        try (PreparedStatement statement = connection.prepareStatement("""
            SELECT service_type, is_active
            FROM support_categories
            WHERE id = ?
            """)) {
            statement.setLong(1, categoryId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    throw new NoSuchElementException("카테고리를 찾을 수 없습니다.");
                }
                if (resultSet.getInt("is_active") != 1) {
                    throw new IllegalArgumentException("비활성 카테고리는 사용할 수 없습니다.");
                }
                String categoryServiceType = normalizeNullable(resultSet.getString("service_type"));
                if (!"common".equals(categoryServiceType) && !serviceType.equals(categoryServiceType)) {
                    throw new IllegalArgumentException("카테고리 service_type이 ticket service_type과 일치하지 않습니다.");
                }
            }
        }
    }

    private SupportCategoryView toCategoryView(ResultSet resultSet) throws SQLException {
        return new SupportCategoryView(
            resultSet.getLong("id"),
            normalizeNullable(resultSet.getString("service_type")),
            normalizeNullable(resultSet.getString("code")),
            normalizeNullable(resultSet.getString("name")),
            normalizeNullable(resultSet.getString("description")),
            resultSet.getInt("sort_order"),
            resultSet.getInt("is_active") == 1
        );
    }

    private SupportTicketView toTicketView(ResultSet resultSet) throws SQLException {
        return new SupportTicketView(
            resultSet.getLong("id"),
            normalizeNullable(resultSet.getString("user_id")),
            normalizeNullable(resultSet.getString("service_type")),
            resultSet.getObject("category_id") == null ? null : resultSet.getLong("category_id"),
            normalizeNullable(resultSet.getString("category_code")),
            normalizeNullable(resultSet.getString("category_name")),
            normalizeNullable(resultSet.getString("category_description")),
            normalizeNullable(resultSet.getString("inquiry_type_code")),
            normalizeNullable(resultSet.getString("requester_name")),
            normalizeNullable(resultSet.getString("requester_email")),
            normalizeNullable(resultSet.getString("requester_phone")),
            normalizeNullable(resultSet.getString("title")),
            normalizeNullable(resultSet.getString("content")),
            normalizeNullable(resultSet.getString("status")),
            normalizeNullable(resultSet.getString("priority"))
        );
    }

    private SupportTicketView toTicketView(TicketRow row) {
        return new SupportTicketView(
            row.id(),
            row.userId(),
            row.serviceType(),
            row.categoryId(),
            row.categoryCode(),
            row.categoryName(),
            row.categoryDescription(),
            row.inquiryTypeCode(),
            row.requesterName(),
            row.requesterEmail(),
            row.requesterPhone(),
            row.title(),
            row.content(),
            row.status(),
            row.priority()
        );
    }

    private SupportCommentView toCommentView(ResultSet resultSet) throws SQLException {
        return new SupportCommentView(
            resultSet.getLong("id"),
            resultSet.getLong("ticket_id"),
            normalizeNullable(resultSet.getString("author_user_id")),
            normalizeNullable(resultSet.getString("author_role")),
            normalizeNullable(resultSet.getString("author_name")),
            normalizeNullable(resultSet.getString("content")),
            resultSet.getInt("is_internal") == 1
        );
    }

    private SupportAttachmentView toAttachmentView(ResultSet resultSet) throws SQLException {
        return new SupportAttachmentView(
            resultSet.getLong("id"),
            resultSet.getLong("ticket_id"),
            normalizeNullable(resultSet.getString("uploaded_by_user_id")),
            normalizeNullable(resultSet.getString("original_filename")),
            normalizeNullable(resultSet.getString("stored_filename")),
            normalizeNullable(resultSet.getString("storage_key")),
            normalizeNullable(resultSet.getString("content_type")),
            resultSet.getLong("file_size_bytes")
        );
    }

    private record TicketRow(
        long id,
        String userId,
        String serviceType,
        Long categoryId,
        String inquiryTypeCode,
        String requesterName,
        String requesterEmail,
        String requesterPhone,
        String title,
        String content,
        String status,
        String priority,
        String categoryCode,
        String categoryName,
        String categoryDescription
    ) {
    }
}

record SupportCategoryView(
    long id,
    String serviceType,
    String code,
    String name,
    String description,
    int sortOrder,
    boolean active
) {
}

record SupportTicketView(
    long id,
    String userId,
    String serviceType,
    Long categoryId,
    String categoryCode,
    String categoryName,
    String categoryDescription,
    String inquiryTypeCode,
    String requesterName,
    String requesterEmail,
    String requesterPhone,
    String title,
    String content,
    String status,
    String priority
) {
}

record SupportCommentView(
    long id,
    long ticketId,
    String authorUserId,
    String authorRole,
    String authorName,
    String content,
    boolean internal
) {
}

record SupportAttachmentView(
    long id,
    long ticketId,
    String uploadedByUserId,
    String originalFilename,
    String storedFilename,
    String storageKey,
    String contentType,
    long fileSizeBytes
) {
}

record SupportTicketUpsertRequest(
    String serviceType,
    Long categoryId,
    String inquiryTypeCode,
    String requesterName,
    String requesterEmail,
    String requesterPhone,
    String title,
    String content,
    String status,
    String priority
) {
}

record SupportCommentUpsertRequest(
    String content,
    Boolean isInternal
) {
}

record SupportAttachmentUpsertRequest(
    String originalFilename,
    String storedFilename,
    String storageKey,
    String contentType,
    Long fileSizeBytes
) {
}

class ForbiddenOperationException extends RuntimeException {
    ForbiddenOperationException(String message) {
        super(message);
    }
}
