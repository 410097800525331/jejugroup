package com.jejugroup.jejuspring.customercenter.support;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.jejugroup.jejuspring.auth.model.SessionUser;
import com.jejugroup.jejuspring.config.AppProperties;

@Service
public class SupportAccessPolicy extends SupportDatabaseSupport {
    public SupportAccessPolicy(AppProperties appProperties) {
        super(appProperties);
    }

    public void requireAuthenticated(SessionUser user) {
        if (user == null || !StringUtils.hasText(user.id())) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }
    }

    public boolean isAdmin(SessionUser user) {
        return user != null && StringUtils.hasText(user.role()) && "ADMIN".equalsIgnoreCase(user.role().trim());
    }

    public boolean canAccessTicket(SessionUser user, TicketRow ticket) {
        return isAdmin(user) || Objects.equals(requireText(user.id(), "userId"), ticket.userId());
    }

    public TicketRow requireTicketAccess(Connection connection, SessionUser user, long ticketId) throws SQLException {
        TicketRow ticket = loadTicket(connection, ticketId);
        if (!canAccessTicket(user, ticket)) {
            throw new ForbiddenOperationException("권한이 없습니다.");
        }
        return ticket;
    }

    public TicketRow loadTicket(Connection connection, long ticketId) throws SQLException {
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
                    throw new java.util.NoSuchElementException("지원 요청을 찾을 수 없습니다.");
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
}

record TicketRow(
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
