package com.jejugroup.jejuspring.mypage.application;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

@Service
public class MyPageProfileQueryService {
    public MyPageDashboardRepository.MyPageProfileSnapshot loadProfile(
        Connection connection,
        String userId,
        String tierLabel
    ) throws SQLException {
        String query = """
            SELECT
                u.id,
                COALESCE(NULLIF(TRIM(up.display_name), ''), u.name) AS display_name,
                up.avatar_url,
                u.email,
                u.phone,
                u.role
            FROM users u
            LEFT JOIN user_profiles up ON up.user_id = u.id
            WHERE u.id = ?
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, userId);

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    throw new NoSuchElementException("MyPage user not found");
                }

                return new MyPageDashboardRepository.MyPageProfileSnapshot(
                    nullToEmpty(resultSet.getString("id")),
                    nullToEmpty(resultSet.getString("display_name")),
                    nullToEmpty(resultSet.getString("avatar_url")),
                    nullToEmpty(resultSet.getString("email")),
                    nullToEmpty(resultSet.getString("phone")),
                    nullToEmpty(resultSet.getString("role")),
                    nullToEmpty(tierLabel)
                );
            }
        }
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value;
    }
}
