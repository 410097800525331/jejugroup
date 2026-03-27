package com.jejugroup.jejuspring.mypage.application;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class MyPageMembershipQueryService {
    public record MyPageMembershipSnapshot(
        List<String> memberships,
        String tierLabel
    ) {
    }

    public MyPageMembershipSnapshot loadMemberships(Connection connection, String userId) throws SQLException {
        String query = """
            SELECT
                mp.plan_name,
                mp.tier_level
            FROM user_memberships um
            INNER JOIN membership_plans mp ON mp.id = um.membership_plan_id
            WHERE um.user_id = ?
              AND um.membership_status = 'active'
              AND mp.is_active = 1
            ORDER BY mp.tier_level DESC, um.started_at DESC, um.id DESC
            """;

        List<String> memberships = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, userId);

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    memberships.add(buildMembershipLabel(resultSet.getString("plan_name")));
                }
            }
        }

        String tierLabel = memberships.isEmpty() ? "" : memberships.getFirst();
        return new MyPageMembershipSnapshot(List.copyOf(memberships), tierLabel);
    }

    private String buildMembershipLabel(String planName) {
        if (StringUtils.hasText(planName)) {
            return planName.trim();
        }

        return "";
    }
}
