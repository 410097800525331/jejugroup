package com.jejugroup.jejuspring.customercenter.support;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import com.jejugroup.jejuspring.auth.model.SessionUser;
import com.jejugroup.jejuspring.config.AppProperties;

@Service
class SupportCommentService extends SupportDatabaseSupport {
    private final SupportAccessPolicy accessPolicy;

    SupportCommentService(AppProperties appProperties, SupportAccessPolicy accessPolicy) {
        super(appProperties);
        this.accessPolicy = accessPolicy;
    }

    List<SupportCommentView> listComments(SessionUser user, long ticketId) throws SQLException {
        accessPolicy.requireAuthenticated(user);
        try (Connection connection = openConnection()) {
            accessPolicy.requireTicketAccess(connection, user, ticketId);
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
        accessPolicy.requireAuthenticated(user);
        String content = requireText(request.content(), "content");
        boolean internal = Boolean.TRUE.equals(request.isInternal());

        try (Connection connection = openConnection()) {
            accessPolicy.requireTicketAccess(connection, user, ticketId);
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
        accessPolicy.requireAuthenticated(user);
        String content = requireText(request.content(), "content");
        boolean internal = Boolean.TRUE.equals(request.isInternal());

        try (Connection connection = openConnection()) {
            accessPolicy.requireTicketAccess(connection, user, ticketId);
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
        accessPolicy.requireAuthenticated(user);
        try (Connection connection = openConnection()) {
            accessPolicy.requireTicketAccess(connection, user, ticketId);
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
}
