package com.jejugroup.jejuspring.mypage.application;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.jejugroup.jejuspring.mypage.view.MyPageSupportView;

@Service
public class MyPageSupportQueryService {
    public List<MyPageSupportView> loadSupportItems(Connection connection, String userId) throws SQLException {
        int totalCount = countSupportTickets(connection, userId, null);
        int activeCount = countSupportTickets(connection, userId, List.of("pending", "in_progress", "waiting", "open"));
        int closedCount = countSupportTickets(connection, userId, List.of("answered", "resolved", "closed"));

        return List.of(
            new MyPageSupportView("qna", "1:1 문의 내역", totalCount, "#"),
            new MyPageSupportView("notice", "처리 중 문의", activeCount, "#"),
            new MyPageSupportView("faq", "완료된 문의", closedCount, "#")
        );
    }

    private int countSupportTickets(Connection connection, String userId, List<String> statuses) throws SQLException {
        StringBuilder query = new StringBuilder("""
            SELECT COUNT(*) AS ticket_count
            FROM support_tickets
            WHERE user_id = ?
            """);

        if (statuses != null && !statuses.isEmpty()) {
            String placeholders = statuses.stream().map(status -> "?").collect(Collectors.joining(", "));
            query.append(" AND status IN (").append(placeholders).append(")");
        }

        try (PreparedStatement statement = connection.prepareStatement(query.toString())) {
            statement.setString(1, userId);

            if (statuses != null && !statuses.isEmpty()) {
                int index = 2;
                for (String status : statuses) {
                    statement.setString(index++, status);
                }
            }

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return 0;
                }
                return resultSet.getInt("ticket_count");
            }
        }
    }
}
