package com.jejugroup.jejuspring.mypage.application;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DecimalFormat;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.jejugroup.jejuspring.mypage.view.MyPageStatView;

@Service
public class MyPageStatsQueryService {
    private static final DecimalFormat MONEY_FORMAT = new DecimalFormat("#,###");

    public List<MyPageStatView> loadStats(Connection connection, String userId) throws SQLException {
        int pointBalance = loadCurrentPointBalance(connection, userId);
        int couponCount = loadAvailableCouponCount(connection, userId);
        int airTripCount = loadUpcomingTripCount(connection, userId, "air");
        int stayTripCount = loadUpcomingTripCount(connection, userId, "stay");

        return List.of(
            new MyPageStatView("보유 포인트", "point", formatPointBalance(pointBalance)),
            new MyPageStatView("사용 가능한 쿠폰", "coupon", couponCount + "장"),
            new MyPageStatView("예정된 항공 일정", "air", airTripCount + "건"),
            new MyPageStatView("예정된 숙소 일정", "stay", stayTripCount + "건")
        );
    }

    private int loadCurrentPointBalance(Connection connection, String userId) throws SQLException {
        String query = """
            SELECT balance_after
            FROM point_ledger
            WHERE user_id = ?
            ORDER BY occurred_at DESC, id DESC
            LIMIT 1
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, userId);

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return 0;
                }
                return resultSet.getInt("balance_after");
            }
        }
    }

    private int loadAvailableCouponCount(Connection connection, String userId) throws SQLException {
        String query = """
            SELECT COUNT(*) AS coupon_count
            FROM user_coupons uc
            INNER JOIN coupons c ON c.id = uc.coupon_id
            WHERE uc.user_id = ?
              AND uc.coupon_status = 'issued'
              AND c.is_active = 1
              AND (c.valid_from IS NULL OR c.valid_from <= CURDATE())
              AND (c.valid_to IS NULL OR c.valid_to >= CURDATE())
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, userId);

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return 0;
                }
                return resultSet.getInt("coupon_count");
            }
        }
    }

    private int loadUpcomingTripCount(Connection connection, String userId, String bookingType) throws SQLException {
        String query = """
            SELECT COUNT(DISTINCT booking_id) AS trip_count
            FROM travel_events
            WHERE user_id = ?
              AND booking_type = ?
              AND status = 'reserved'
              AND event_date >= CURDATE()
            """;

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, userId);
            statement.setString(2, bookingType);

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return 0;
                }
                return resultSet.getInt("trip_count");
            }
        }
    }

    private String formatPointBalance(int balance) {
        return MONEY_FORMAT.format(balance) + "P";
    }
}
