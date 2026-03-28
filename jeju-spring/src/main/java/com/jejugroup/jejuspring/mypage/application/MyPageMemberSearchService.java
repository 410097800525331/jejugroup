package com.jejugroup.jejuspring.mypage.application;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.jejugroup.jejuspring.config.AppProperties;

@Service
public class MyPageMemberSearchService {
    private static final int MAX_LIMIT = 50;
    private static final Pattern MEMBER_ID_PATTERN = Pattern.compile("^[a-z0-9._-]{1,30}$");

    private final AppProperties appProperties;

    public MyPageMemberSearchService(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    public List<MyPageMemberSearchItem> searchMembers(String query, Integer limit) throws SQLException {
        String normalizedQuery = normalizeQuery(query);
        Integer normalizedLimit = normalizeLimit(limit);

        try (Connection connection = openConnection()) {
            connection.setReadOnly(true);
            return searchMembers(connection, normalizedQuery, normalizedLimit);
        }
    }

    private List<MyPageMemberSearchItem> searchMembers(
        Connection connection,
        String query,
        Integer limit
    ) throws SQLException {
        String upperBound = query + '\uffff';
        // 관리자는 users.role 과 user_roles/roles.code 둘 다에서 검색 대상에서 제외한다.
        String sql = """
            SELECT
                u.id,
                COALESCE(NULLIF(TRIM(up.nickname), ''), NULLIF(TRIM(up.display_name), ''), u.name) AS display_name,
                COALESCE(NULLIF(TRIM(up.bio), ''), '') AS bio,
                COALESCE(NULLIF(TRIM(up.avatar_url), ''), '') AS avatar_url
            FROM users u
            LEFT JOIN user_profiles up ON up.user_id = u.id
            WHERE u.id >= ? AND u.id < ?
              AND COALESCE(UPPER(TRIM(u.role)), '') <> 'ADMIN'
              AND NOT EXISTS (
                  SELECT 1
                  FROM user_roles ur
                  INNER JOIN roles r ON r.id = ur.role_id
                  WHERE ur.user_id = u.id
                    AND UPPER(TRIM(r.code)) = 'ADMIN'
              )
            ORDER BY u.id ASC
            """;

        if (limit != null) {
            sql = sql + " LIMIT " + limit.intValue();
        }

        List<MyPageMemberSearchItem> members = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setString(1, query);
            statement.setString(2, upperBound);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    members.add(new MyPageMemberSearchItem(
                        nullToEmpty(resultSet.getString("id")),
                        nullToEmpty(resultSet.getString("display_name")),
                        nullToEmpty(resultSet.getString("bio")),
                        nullToEmpty(resultSet.getString("avatar_url"))
                    ));
                }
            }
        }

        return List.copyOf(members);
    }

    private String normalizeQuery(String query) {
        if (!StringUtils.hasText(query)) {
            throw new IllegalArgumentException("검색어를 입력해주세요.");
        }

        String normalizedQuery = query.trim();
        if (!MEMBER_ID_PATTERN.matcher(normalizedQuery).matches()) {
            throw new IllegalArgumentException("회원 아이디는 영문 소문자, 숫자, ., _, - 만 1~30자로 사용할 수 있습니다.");
        }

        return normalizedQuery;
    }

    private Integer normalizeLimit(Integer limit) {
        if (limit == null || limit.intValue() <= 0) {
            return null;
        }

        return Math.min(limit.intValue(), MAX_LIMIT);
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

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value;
    }

    public record MyPageMemberSearchItem(
        String id,
        String name,
        String bio,
        String avatarUrl
    ) {
    }
}
