package com.jejugroup.jejuspring.customercenter.support;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.jejugroup.jejuspring.auth.model.SessionUser;
import com.jejugroup.jejuspring.config.AppProperties;

@Service
class SupportTicketService extends SupportDatabaseSupport {
    private static final java.util.Set<String> ALLOWED_STATUSES = java.util.Set.of(
        "pending",
        "in_progress",
        "waiting",
        "open",
        "answered",
        "resolved",
        "closed"
    );
    private static final java.util.Set<String> ALLOWED_PRIORITIES = java.util.Set.of("low", "normal", "high", "urgent");

    private final SupportAccessPolicy accessPolicy;

    SupportTicketService(AppProperties appProperties, SupportAccessPolicy accessPolicy) {
        super(appProperties);
        this.accessPolicy = accessPolicy;
    }

    List<SupportTicketView> listTickets(SessionUser user, String serviceType) throws SQLException {
        accessPolicy.requireAuthenticated(user);
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
        if (!accessPolicy.isAdmin(user)) {
            query.append(" AND t.user_id = ?");
        }
        query.append(" ORDER BY t.created_at DESC, t.id DESC");

        try (Connection connection = openConnection();
             PreparedStatement statement = connection.prepareStatement(query.toString())) {
            int index = 1;
            if (normalizedServiceType != null) {
                statement.setString(index++, normalizedServiceType);
            }
            if (!accessPolicy.isAdmin(user)) {
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
        accessPolicy.requireAuthenticated(user);
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
                    return toTicketView(accessPolicy.loadTicket(connection, generatedKeys.getLong(1)));
                }
            }
        }
    }

    SupportTicketView getTicket(SessionUser user, long ticketId) throws SQLException {
        accessPolicy.requireAuthenticated(user);
        try (Connection connection = openConnection()) {
            return toTicketView(accessPolicy.requireTicketAccess(connection, user, ticketId));
        }
    }

    SupportTicketView updateTicket(SessionUser user, long ticketId, SupportTicketUpsertRequest request) throws SQLException {
        accessPolicy.requireAuthenticated(user);
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
            TicketRow ticket = accessPolicy.requireTicketAccess(connection, user, ticketId);
            accessPolicy.requireOwnerPassword(connection, user, ticket, request.password());
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

            return toTicketView(accessPolicy.requireTicketAccess(connection, user, ticketId));
        }
    }

    void deleteTicket(SessionUser user, long ticketId, String password) throws SQLException {
        accessPolicy.requireAuthenticated(user);
        try (Connection connection = openConnection()) {
            TicketRow ticket = accessPolicy.requireTicketAccess(connection, user, ticketId);
            accessPolicy.requireOwnerPassword(connection, user, ticket, password);
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
}
