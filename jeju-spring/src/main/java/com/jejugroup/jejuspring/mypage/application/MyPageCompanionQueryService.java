package com.jejugroup.jejuspring.mypage.application;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class MyPageCompanionQueryService {
    public List<MyPageDashboardRepository.MyPageItineraryCompanionSnapshot> loadCompanionLinks(
        Connection connection,
        String userId
    ) throws SQLException {
        String query = """
            SELECT
                cl.companion_user_id,
                COALESCE(NULLIF(TRIM(up.display_name), ''), u.name) AS companion_name,
                NULLIF(TRIM(up.avatar_url), '') AS companion_avatar_url
            FROM companion_links cl
            INNER JOIN users u ON u.id = cl.companion_user_id
            LEFT JOIN user_profiles up ON up.user_id = u.id
            WHERE cl.owner_user_id = ?
              AND cl.is_member = 1
            ORDER BY COALESCE(NULLIF(TRIM(up.display_name), ''), u.name) ASC, cl.sort_order ASC, cl.id ASC
            """;

        List<MyPageDashboardRepository.MyPageItineraryCompanionSnapshot> companions = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, userId);

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    companions.add(new MyPageDashboardRepository.MyPageItineraryCompanionSnapshot(
                        nullToEmpty(resultSet.getString("companion_user_id")),
                        nullToEmpty(resultSet.getString("companion_name")),
                        nullToEmpty(resultSet.getString("companion_avatar_url")),
                        true
                    ));
                }
            }
        }

        return List.copyOf(companions);
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value;
    }
}
