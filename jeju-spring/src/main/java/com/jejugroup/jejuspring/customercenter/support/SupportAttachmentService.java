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
class SupportAttachmentService extends SupportDatabaseSupport {
    private final SupportAccessPolicy accessPolicy;

    SupportAttachmentService(AppProperties appProperties, SupportAccessPolicy accessPolicy) {
        super(appProperties);
        this.accessPolicy = accessPolicy;
    }

    List<SupportAttachmentView> listAttachments(SessionUser user, long ticketId) throws SQLException {
        accessPolicy.requireAuthenticated(user);
        try (Connection connection = openConnection()) {
            accessPolicy.requireTicketAccess(connection, user, ticketId);
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
        accessPolicy.requireAuthenticated(user);
        String originalFilename = requireText(request.originalFilename(), "originalFilename");
        String storedFilename = requireText(request.storedFilename(), "storedFilename");
        String storageKey = requireText(request.storageKey(), "storageKey");
        String contentType = normalizeNullable(request.contentType());
        long fileSizeBytes = normalizeNonNegativeLong(request.fileSizeBytes(), "fileSizeBytes");

        try (Connection connection = openConnection()) {
            accessPolicy.requireTicketAccess(connection, user, ticketId);
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
        accessPolicy.requireAuthenticated(user);
        String originalFilename = requireText(request.originalFilename(), "originalFilename");
        String storedFilename = requireText(request.storedFilename(), "storedFilename");
        String storageKey = requireText(request.storageKey(), "storageKey");
        String contentType = normalizeNullable(request.contentType());
        long fileSizeBytes = normalizeNonNegativeLong(request.fileSizeBytes(), "fileSizeBytes");

        try (Connection connection = openConnection()) {
            accessPolicy.requireTicketAccess(connection, user, ticketId);
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
        accessPolicy.requireAuthenticated(user);
        try (Connection connection = openConnection()) {
            accessPolicy.requireTicketAccess(connection, user, ticketId);
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
}
