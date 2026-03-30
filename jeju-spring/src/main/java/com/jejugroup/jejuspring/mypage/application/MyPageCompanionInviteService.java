package com.jejugroup.jejuspring.mypage.application;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.jejugroup.jejuspring.config.AppProperties;

@Service
public class MyPageCompanionInviteService {
    private static final Pattern USER_ID_PATTERN = Pattern.compile("^[a-z0-9._-]{1,100}$");

    private final AppProperties appProperties;

    public MyPageCompanionInviteService(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    public List<MyPageCompanionInviteItem> listInvites(String userId) throws SQLException {
        String normalizedUserId = normalizeUserId(userId);
        try (Connection connection = openConnection()) {
            connection.setReadOnly(true);
            return listInvites(connection, normalizedUserId);
        }
    }

    public MyPageCompanionInviteItem createInvite(String senderUserId, String receiverUserId) throws SQLException {
        String normalizedSenderUserId = normalizeUserId(senderUserId);
        String normalizedReceiverUserId = normalizeUserId(receiverUserId);
        if (normalizedSenderUserId.equals(normalizedReceiverUserId)) {
            throw new IllegalArgumentException("자기 자신에게는 동행 초대를 보낼 수 없습니다.");
        }

        try (Connection connection = openConnection()) {
            connection.setAutoCommit(false);
            try {
                lockUserPair(connection, normalizedSenderUserId, normalizedReceiverUserId);
                ensureMemberExists(connection, normalizedSenderUserId);
                ensureMemberExists(connection, normalizedReceiverUserId);
                ensureNotAdmin(connection, normalizedSenderUserId);
                ensureNotAdmin(connection, normalizedReceiverUserId);
                ensureNoActiveLink(connection, normalizedSenderUserId, normalizedReceiverUserId);
                ensureNoActiveInvite(connection, normalizedSenderUserId, normalizedReceiverUserId);

                long inviteId = insertInvite(connection, normalizedSenderUserId, normalizedReceiverUserId);
                connection.commit();
                return loadInviteById(connection, inviteId, normalizedSenderUserId);
            } catch (SQLException | RuntimeException exception) {
                rollbackQuietly(connection);
                throw exception;
            }
        }
    }

    public MyPageCompanionInviteItem acceptInvite(long inviteId, String userId) throws SQLException {
        return respondToInvite(inviteId, userId, InviteAction.ACCEPT);
    }

    public MyPageCompanionInviteItem rejectInvite(long inviteId, String userId) throws SQLException {
        return respondToInvite(inviteId, userId, InviteAction.REJECT);
    }

    public MyPageCompanionInviteItem cancelInvite(long inviteId, String userId) throws SQLException {
        return respondToInvite(inviteId, userId, InviteAction.CANCEL);
    }

    public UnlinkResult unlinkCompanion(String userId, String companionUserId) throws SQLException {
        String normalizedUserId = normalizeUserId(userId);
        String normalizedCompanionUserId = normalizeUserId(companionUserId);
        if (normalizedUserId.equals(normalizedCompanionUserId)) {
            throw new IllegalArgumentException("자기 자신은 해제할 수 없습니다.");
        }

        try (Connection connection = openConnection()) {
            connection.setAutoCommit(false);
            try {
                lockUserPair(connection, normalizedUserId, normalizedCompanionUserId);
                ensureMemberExists(connection, normalizedUserId);
                ensureMemberExists(connection, normalizedCompanionUserId);
                int removedCount = deleteCompanionLinks(connection, normalizedUserId, normalizedCompanionUserId);
                if (removedCount == 0) {
                    throw new InviteConflictException("연동된 동행자가 아닙니다.");
                }

                connection.commit();
                return new UnlinkResult(normalizedUserId, normalizedCompanionUserId, removedCount);
            } catch (SQLException | RuntimeException exception) {
                rollbackQuietly(connection);
                throw exception;
            }
        }
    }

    public Map<String, RelationStateSnapshot> loadRelationStates(
        Connection connection,
        String currentUserId,
        List<String> candidateUserIds
    ) throws SQLException {
        String normalizedCurrentUserId = normalizeUserId(currentUserId);
        List<String> normalizedCandidateUserIds = candidateUserIds.stream()
            .map(this::normalizeUserId)
            .filter(candidateUserId -> !candidateUserId.equals(normalizedCurrentUserId))
            .distinct()
            .toList();

        Map<String, RelationStateSnapshot> relationStates = new LinkedHashMap<>();
        for (String candidateUserId : normalizedCandidateUserIds) {
            relationStates.put(candidateUserId, RelationStateSnapshot.available());
        }

        if (normalizedCandidateUserIds.isEmpty()) {
            return relationStates;
        }

        Set<String> linkedUserIds = new LinkedHashSet<>();
        linkedUserIds.addAll(loadCompanionLinkIds(connection, normalizedCurrentUserId, normalizedCandidateUserIds, true));
        linkedUserIds.addAll(loadCompanionLinkIds(connection, normalizedCurrentUserId, normalizedCandidateUserIds, false));

        Set<String> receivedInviteIds = new LinkedHashSet<>();
        receivedInviteIds.addAll(loadInviteIds(connection, normalizedCurrentUserId, normalizedCandidateUserIds, InviteDirection.RECEIVED));

        Set<String> sentInviteIds = new LinkedHashSet<>();
        sentInviteIds.addAll(loadInviteIds(connection, normalizedCurrentUserId, normalizedCandidateUserIds, InviteDirection.SENT));

        for (String candidateUserId : normalizedCandidateUserIds) {
            if (linkedUserIds.contains(candidateUserId)) {
                relationStates.put(candidateUserId, RelationStateSnapshot.linked());
                continue;
            }

            if (receivedInviteIds.contains(candidateUserId)) {
                relationStates.put(candidateUserId, RelationStateSnapshot.needsResponse());
                continue;
            }

            if (sentInviteIds.contains(candidateUserId)) {
                relationStates.put(candidateUserId, RelationStateSnapshot.invited());
            }
        }

        return relationStates;
    }

    private List<MyPageCompanionInviteItem> listInvites(Connection connection, String userId) throws SQLException {
        String query = """
            SELECT
                ci.id,
                ci.sender_user_id,
                COALESCE(NULLIF(TRIM(sender_profile.display_name), ''), sender.name) AS sender_name,
                NULLIF(TRIM(sender_profile.avatar_url), '') AS sender_avatar_url,
                ci.receiver_user_id,
                COALESCE(NULLIF(TRIM(receiver_profile.display_name), ''), receiver.name) AS receiver_name,
                NULLIF(TRIM(receiver_profile.avatar_url), '') AS receiver_avatar_url,
                CASE
                    WHEN ci.status = 'pending' AND ci.expires_at <= CURRENT_TIMESTAMP(3) THEN 'expired'
                    ELSE ci.status
                END AS effective_status,
                ci.expires_at,
                ci.responded_at,
                ci.created_at
            FROM companion_invites ci
            INNER JOIN users sender ON sender.id = ci.sender_user_id
            LEFT JOIN user_profiles sender_profile ON sender_profile.user_id = sender.id
            INNER JOIN users receiver ON receiver.id = ci.receiver_user_id
            LEFT JOIN user_profiles receiver_profile ON receiver_profile.user_id = receiver.id
            WHERE ci.sender_user_id = ? OR ci.receiver_user_id = ?
            ORDER BY
                CASE
                    WHEN ci.status = 'pending' AND ci.expires_at > CURRENT_TIMESTAMP(3) THEN 0
                    ELSE 1
                END,
                ci.created_at DESC,
                ci.id DESC
            """;

        List<MyPageCompanionInviteItem> invites = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, userId);
            statement.setString(2, userId);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    invites.add(buildInviteItem(resultSet, userId));
                }
            }
        }

        return List.copyOf(invites);
    }

    private MyPageCompanionInviteItem respondToInvite(long inviteId, String userId, InviteAction action) throws SQLException {
        String normalizedUserId = normalizeUserId(userId);

        try (Connection connection = openConnection()) {
            connection.setAutoCommit(false);
            try {
                InviteEnvelope invite = loadInviteEnvelopeForUpdate(connection, inviteId);
                if (!invite.isPending()) {
                    throw new InviteConflictException("이미 처리된 초대입니다.");
                }

                if (invite.isExpired()) {
                    updateInviteStatus(connection, inviteId, "expired", true);
                    connection.commit();
                    throw new InviteConflictException("만료된 초대입니다.");
                }

                if (action.requiresReceiver() && !normalizedUserId.equals(invite.receiverUserId())) {
                    throw new InviteAccessDeniedException("이 초대에 대한 권한이 없습니다.");
                }

                if (action.requiresSender() && !normalizedUserId.equals(invite.senderUserId())) {
                    throw new InviteAccessDeniedException("이 초대에 대한 권한이 없습니다.");
                }

                if (action == InviteAction.ACCEPT) {
                    lockUserPair(connection, invite.senderUserId(), invite.receiverUserId());
                    ensureMemberExists(connection, invite.senderUserId());
                    ensureMemberExists(connection, invite.receiverUserId());
                    ensureNotAdmin(connection, invite.senderUserId());
                    ensureNotAdmin(connection, invite.receiverUserId());
                    ensureCompanionLinks(connection, invite.senderUserId(), invite.receiverUserId());
                    updateInviteStatus(connection, inviteId, "accepted", true);
                    resolveReciprocalPendingInvites(connection, inviteId, invite.senderUserId(), invite.receiverUserId());
                } else if (action == InviteAction.REJECT) {
                    updateInviteStatus(connection, inviteId, "rejected", true);
                } else if (action == InviteAction.CANCEL) {
                    updateInviteStatus(connection, inviteId, "cancelled", true);
                } else {
                    throw new IllegalStateException("지원하지 않는 초대 액션입니다.");
                }

                connection.commit();
                return loadInviteById(connection, inviteId, normalizedUserId);
            } catch (SQLException | RuntimeException exception) {
                rollbackQuietly(connection);
                throw exception;
            }
        }
    }

    private void ensureCompanionLinks(Connection connection, String senderUserId, String receiverUserId) throws SQLException {
        String senderName = loadDisplayName(connection, senderUserId);
        String receiverName = loadDisplayName(connection, receiverUserId);
        insertCompanionLink(connection, senderUserId, receiverUserId, receiverName);
        insertCompanionLink(connection, receiverUserId, senderUserId, senderName);
    }

    private void insertCompanionLink(Connection connection, String ownerUserId, String companionUserId, String companionName)
        throws SQLException {
        String query = """
            INSERT INTO companion_links (
                owner_user_id,
                companion_user_id,
                companion_name,
                companion_phone,
                companion_email,
                is_member,
                relationship_label,
                sort_order
            ) VALUES (?, ?, ?, NULL, NULL, 1, NULL, 0)
            ON DUPLICATE KEY UPDATE
                is_member = VALUES(is_member),
                updated_at = CURRENT_TIMESTAMP(3)
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, ownerUserId);
            statement.setString(2, companionUserId);
            statement.setString(3, companionName);
            statement.executeUpdate();
        }
    }

    private int deleteCompanionLinks(Connection connection, String userId, String companionUserId) throws SQLException {
        String query = """
            DELETE FROM companion_links
            WHERE is_member = 1
              AND (
                  (owner_user_id = ? AND companion_user_id = ?)
                  OR (owner_user_id = ? AND companion_user_id = ?)
              )
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, userId);
            statement.setString(2, companionUserId);
            statement.setString(3, companionUserId);
            statement.setString(4, userId);
            return statement.executeUpdate();
        }
    }

    private void updateInviteStatus(Connection connection, long inviteId, String status, boolean setRespondedAt) throws SQLException {
        String query = setRespondedAt
            ? """
                UPDATE companion_invites
                SET status = ?, responded_at = CURRENT_TIMESTAMP(3)
                WHERE id = ?
                """
            : """
                UPDATE companion_invites
                SET status = ?
                WHERE id = ?
                """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, status);
            statement.setLong(2, inviteId);
            statement.executeUpdate();
        }
    }

    private void resolveReciprocalPendingInvites(
        Connection connection,
        long acceptedInviteId,
        String senderUserId,
        String receiverUserId
    ) throws SQLException {
        String query = """
            UPDATE companion_invites
            SET status = 'accepted',
                responded_at = COALESCE(responded_at, CURRENT_TIMESTAMP(3))
            WHERE id <> ?
              AND status = 'pending'
              AND (
                  (sender_user_id = ? AND receiver_user_id = ?)
                  OR (sender_user_id = ? AND receiver_user_id = ?)
              )
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setLong(1, acceptedInviteId);
            statement.setString(2, senderUserId);
            statement.setString(3, receiverUserId);
            statement.setString(4, receiverUserId);
            statement.setString(5, senderUserId);
            statement.executeUpdate();
        }
    }

    private long insertInvite(Connection connection, String senderUserId, String receiverUserId) throws SQLException {
        String query = """
            INSERT INTO companion_invites (
                sender_user_id,
                receiver_user_id,
                status,
                expires_at
            ) VALUES (?, ?, 'pending', CURRENT_TIMESTAMP(3) + INTERVAL 30 MINUTE)
            """;

        try (PreparedStatement statement = connection.prepareStatement(query, PreparedStatement.RETURN_GENERATED_KEYS)) {
            statement.setString(1, senderUserId);
            statement.setString(2, receiverUserId);
            statement.executeUpdate();

            try (ResultSet generatedKeys = statement.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    return generatedKeys.getLong(1);
                }
            }
        }

        throw new SQLException("동행 초대 저장에 실패했습니다.");
    }

    private MyPageCompanionInviteItem loadInviteById(Connection connection, long inviteId, String viewerUserId) throws SQLException {
        String query = """
            SELECT
                ci.id,
                ci.sender_user_id,
                COALESCE(NULLIF(TRIM(sender_profile.display_name), ''), sender.name) AS sender_name,
                NULLIF(TRIM(sender_profile.avatar_url), '') AS sender_avatar_url,
                ci.receiver_user_id,
                COALESCE(NULLIF(TRIM(receiver_profile.display_name), ''), receiver.name) AS receiver_name,
                NULLIF(TRIM(receiver_profile.avatar_url), '') AS receiver_avatar_url,
                CASE
                    WHEN ci.status = 'pending' AND ci.expires_at <= CURRENT_TIMESTAMP(3) THEN 'expired'
                    ELSE ci.status
                END AS effective_status,
                ci.expires_at,
                ci.responded_at,
                ci.created_at
            FROM companion_invites ci
            INNER JOIN users sender ON sender.id = ci.sender_user_id
            LEFT JOIN user_profiles sender_profile ON sender_profile.user_id = sender.id
            INNER JOIN users receiver ON receiver.id = ci.receiver_user_id
            LEFT JOIN user_profiles receiver_profile ON receiver_profile.user_id = receiver.id
            WHERE ci.id = ?
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setLong(1, inviteId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    throw new NoSuchElementException("동행 초대를 찾을 수 없습니다.");
                }
                return buildInviteItem(resultSet, viewerUserId);
            }
        }
    }

    private InviteEnvelope loadInviteEnvelopeForUpdate(Connection connection, long inviteId) throws SQLException {
        String query = """
            SELECT
                id,
                sender_user_id,
                receiver_user_id,
                status,
                expires_at
            FROM companion_invites
            WHERE id = ?
            FOR UPDATE
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setLong(1, inviteId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    throw new NoSuchElementException("동행 초대를 찾을 수 없습니다.");
                }

                return new InviteEnvelope(
                    resultSet.getLong("id"),
                    normalizeUserId(resultSet.getString("sender_user_id")),
                    normalizeUserId(resultSet.getString("receiver_user_id")),
                    normalizeStatus(resultSet.getString("status")),
                    resultSet.getTimestamp("expires_at")
                );
            }
        }
    }

    private void ensureNoActiveLink(Connection connection, String leftUserId, String rightUserId) throws SQLException {
        String query = """
            SELECT 1
            FROM companion_links
            WHERE is_member = 1
              AND (
                  (owner_user_id = ? AND companion_user_id = ?)
                  OR (owner_user_id = ? AND companion_user_id = ?)
              )
            LIMIT 1
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, leftUserId);
            statement.setString(2, rightUserId);
            statement.setString(3, rightUserId);
            statement.setString(4, leftUserId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    throw new InviteConflictException("이미 연동된 동행입니다.");
                }
            }
        }
    }

    private void ensureNoActiveInvite(Connection connection, String senderUserId, String receiverUserId) throws SQLException {
        String query = """
            SELECT id, sender_user_id, receiver_user_id
            FROM companion_invites
            WHERE status = 'pending'
              AND expires_at > CURRENT_TIMESTAMP(3)
              AND (
                  (sender_user_id = ? AND receiver_user_id = ?)
                  OR (sender_user_id = ? AND receiver_user_id = ?)
              )
            LIMIT 1
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, senderUserId);
            statement.setString(2, receiverUserId);
            statement.setString(3, receiverUserId);
            statement.setString(4, senderUserId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return;
                }

                String existingSenderUserId = normalizeUserId(resultSet.getString("sender_user_id"));
                String existingReceiverUserId = normalizeUserId(resultSet.getString("receiver_user_id"));
                if (senderUserId.equals(existingSenderUserId) && receiverUserId.equals(existingReceiverUserId)) {
                    throw new InviteConflictException("이미 보낸 초대가 있습니다.");
                }

                if (senderUserId.equals(existingReceiverUserId) && receiverUserId.equals(existingSenderUserId)) {
                    throw new InviteConflictException("상대방의 응답이 필요한 초대가 있습니다.");
                }

                throw new InviteConflictException("이미 대기 중인 초대가 있습니다.");
            }
        }
    }

    private void ensureMemberExists(Connection connection, String userId) throws SQLException {
        String query = "SELECT 1 FROM users WHERE id = ? LIMIT 1";
        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, userId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    throw new NoSuchElementException("회원 정보를 찾을 수 없습니다.");
                }
            }
        }
    }

    private void ensureNotAdmin(Connection connection, String userId) throws SQLException {
        String query = """
            SELECT 1
            FROM users u
            LEFT JOIN user_roles ur ON ur.user_id = u.id
            LEFT JOIN roles r ON r.id = ur.role_id
            WHERE u.id = ?
              AND (
                  COALESCE(UPPER(TRIM(u.role)), '') = 'ADMIN'
                  OR UPPER(TRIM(COALESCE(r.code, ''))) = 'ADMIN'
              )
            LIMIT 1
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, userId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    throw new IllegalArgumentException("관리자는 동행 초대 대상이 될 수 없습니다.");
                }
            }
        }
    }

    private List<String> loadCompanionLinkIds(
        Connection connection,
        String currentUserId,
        List<String> candidateUserIds,
        boolean ownerPerspective
    ) throws SQLException {
        String placeholders = candidateUserIds.stream().map(ignored -> "?").collect(Collectors.joining(", "));
        String query = ownerPerspective
            ? """
                SELECT companion_user_id AS user_id
                FROM companion_links
                WHERE owner_user_id = ?
                  AND is_member = 1
                  AND companion_user_id IN (%s)
                """.formatted(placeholders)
            : """
                SELECT owner_user_id AS user_id
                FROM companion_links
                WHERE companion_user_id = ?
                  AND is_member = 1
                  AND owner_user_id IN (%s)
                """.formatted(placeholders);

        List<String> linkedUserIds = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, currentUserId);
            int index = 2;
            for (String candidateUserId : candidateUserIds) {
                statement.setString(index++, candidateUserId);
            }

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    linkedUserIds.add(normalizeUserId(resultSet.getString("user_id")));
                }
            }
        }

        return linkedUserIds;
    }

    private List<String> loadInviteIds(
        Connection connection,
        String currentUserId,
        List<String> candidateUserIds,
        InviteDirection direction
    ) throws SQLException {
        String placeholders = candidateUserIds.stream().map(ignored -> "?").collect(Collectors.joining(", "));
        String query = direction == InviteDirection.SENT
            ? """
                SELECT receiver_user_id AS user_id
                FROM companion_invites
                WHERE sender_user_id = ?
                  AND status = 'pending'
                  AND expires_at > CURRENT_TIMESTAMP(3)
                  AND receiver_user_id IN (%s)
                """.formatted(placeholders)
            : """
                SELECT sender_user_id AS user_id
                FROM companion_invites
                WHERE receiver_user_id = ?
                  AND status = 'pending'
                  AND expires_at > CURRENT_TIMESTAMP(3)
                  AND sender_user_id IN (%s)
                """.formatted(placeholders);

        List<String> inviteUserIds = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, currentUserId);
            int index = 2;
            for (String candidateUserId : candidateUserIds) {
                statement.setString(index++, candidateUserId);
            }

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    inviteUserIds.add(normalizeUserId(resultSet.getString("user_id")));
                }
            }
        }

        return inviteUserIds;
    }

    private MyPageCompanionInviteItem buildInviteItem(ResultSet resultSet, String viewerUserId) throws SQLException {
        return new MyPageCompanionInviteItem(
            resultSet.getLong("id"),
            normalizeUserId(resultSet.getString("sender_user_id")),
            normalizeText(resultSet.getString("sender_name")),
            normalizeText(resultSet.getString("sender_avatar_url")),
            normalizeUserId(resultSet.getString("receiver_user_id")),
            normalizeText(resultSet.getString("receiver_name")),
            normalizeText(resultSet.getString("receiver_avatar_url")),
            normalizeStatus(resultSet.getString("effective_status")),
            buildDirection(viewerUserId, resultSet.getString("sender_user_id")),
            formatTimestamp(resultSet.getTimestamp("expires_at")),
            formatTimestamp(resultSet.getTimestamp("responded_at")),
            formatTimestamp(resultSet.getTimestamp("created_at"))
        );
    }

    private String loadDisplayName(Connection connection, String userId) throws SQLException {
        String query = """
            SELECT COALESCE(NULLIF(TRIM(up.display_name), ''), u.name) AS display_name
            FROM users u
            LEFT JOIN user_profiles up ON up.user_id = u.id
            WHERE u.id = ?
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, userId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return userId;
                }
                return normalizeText(resultSet.getString("display_name"));
            }
        }
    }

    private String buildDirection(String viewerUserId, String senderUserId) {
        if (normalizeUserId(viewerUserId).equals(normalizeUserId(senderUserId))) {
            return "sent";
        }

        return "received";
    }

    private String normalizeStatus(String value) {
        if (!StringUtils.hasText(value)) {
            return "pending";
        }

        return value.trim().toLowerCase(Locale.KOREA);
    }

    private String normalizeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String formatTimestamp(Timestamp timestamp) {
        if (timestamp == null) {
            return null;
        }

        return timestamp.toLocalDateTime().toString();
    }

    private String normalizeUserId(String value) {
        if (!StringUtils.hasText(value)) {
            throw new IllegalArgumentException("userId is required");
        }

        String normalizedUserId = value.trim();
        if (normalizedUserId.length() > 100) {
            throw new IllegalArgumentException("회원 아이디가 너무 깁니다.");
        }
        if (!USER_ID_PATTERN.matcher(normalizedUserId).matches()) {
            throw new IllegalArgumentException("회원 아이디 형식이 올바르지 않습니다.");
        }

        return normalizedUserId;
    }

    private void lockUserPair(Connection connection, String leftUserId, String rightUserId) throws SQLException {
        List<String> userIds = List.of(leftUserId, rightUserId).stream()
            .distinct()
            .sorted()
            .toList();

        String placeholders = userIds.stream().map(ignored -> "?").collect(Collectors.joining(", "));
        String query = """
            SELECT id
            FROM users
            WHERE id IN (%s)
            ORDER BY id
            FOR UPDATE
            """.formatted(placeholders);

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            int index = 1;
            for (String userId : userIds) {
                statement.setString(index++, userId);
            }
            try (ResultSet resultSet = statement.executeQuery()) {
                Set<String> lockedUserIds = new LinkedHashSet<>();
                while (resultSet.next()) {
                    lockedUserIds.add(normalizeUserId(resultSet.getString("id")));
                }

                if (lockedUserIds.size() != userIds.size()) {
                    throw new NoSuchElementException("회원 정보를 찾을 수 없습니다.");
                }
            }
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

    private void rollbackQuietly(Connection connection) {
        try {
            connection.rollback();
        } catch (SQLException ignored) {
            // 롤백 실패는 원래 예외를 가리지 않게 둔다.
        }
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }

    private enum InviteAction {
        ACCEPT(true, false),
        REJECT(true, false),
        CANCEL(false, true);

        private final boolean requiresReceiver;
        private final boolean requiresSender;

        InviteAction(boolean requiresReceiver, boolean requiresSender) {
            this.requiresReceiver = requiresReceiver;
            this.requiresSender = requiresSender;
        }

        private boolean requiresReceiver() {
            return requiresReceiver;
        }

        private boolean requiresSender() {
            return requiresSender;
        }
    }

    private enum InviteDirection {
        SENT,
        RECEIVED
    }

    public record MyPageCompanionInviteItem(
        long id,
        String senderUserId,
        String senderName,
        String senderAvatarUrl,
        String receiverUserId,
        String receiverName,
        String receiverAvatarUrl,
        String status,
        String direction,
        String expiresAt,
        String respondedAt,
        String createdAt
    ) {
    }

    public record UnlinkResult(
        String ownerUserId,
        String companionUserId,
        int removedCount
    ) {
    }

    public record RelationStateSnapshot(
        String state,
        String label
    ) {
        public static RelationStateSnapshot available() {
            return new RelationStateSnapshot("AVAILABLE", "초대");
        }

        public static RelationStateSnapshot invited() {
            return new RelationStateSnapshot("INVITED", "초대중");
        }

        public static RelationStateSnapshot needsResponse() {
            return new RelationStateSnapshot("NEEDS_RESPONSE", "응답 필요");
        }

        public static RelationStateSnapshot linked() {
            return new RelationStateSnapshot("LINKED", "연동됨");
        }
    }

    private record InviteEnvelope(
        long id,
        String senderUserId,
        String receiverUserId,
        String status,
        Timestamp expiresAt
    ) {
        private boolean isPending() {
            return "pending".equals(status);
        }

        private boolean isExpired() {
            return expiresAt != null && expiresAt.toLocalDateTime().isBefore(LocalDateTime.now());
        }
    }

    public static class InviteConflictException extends RuntimeException {
        public InviteConflictException(String message) {
            super(message);
        }
    }

    public static class InviteAccessDeniedException extends RuntimeException {
        public InviteAccessDeniedException(String message) {
            super(message);
        }
    }
}
