package com.jejugroup.jejuspring.mypage.application;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class MyPageTravelEventQueryService {
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy.MM.dd");
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm");

    public List<String> buildTravelEventScopeUserIds(
        String userId,
        List<MyPageDashboardRepository.MyPageItineraryCompanionSnapshot> linkedCompanions
    ) {
        List<String> userScopeIds = new ArrayList<>();
        userScopeIds.add(userId);
        for (MyPageDashboardRepository.MyPageItineraryCompanionSnapshot companion : linkedCompanions) {
            if (!StringUtils.hasText(companion.id())) {
                continue;
            }

            if (!userScopeIds.contains(companion.id())) {
                userScopeIds.add(companion.id());
            }
        }
        return userScopeIds;
    }

    public List<MyPageDashboardRepository.MyPageTravelEventSnapshot> loadTravelEvents(
        Connection connection,
        List<String> userScopeIds
    ) throws SQLException {
        String placeholders = String.join(", ", java.util.Collections.nCopies(userScopeIds.size(), "?"));
        String query = """
            SELECT
                te.id,
                te.day_id,
                te.event_date,
                te.event_time,
                te.title,
                te.activity_label,
                te.google_map_url,
                te.status,
                te.booking_type,
                te.owner_name,
                te.user_id,
                NULLIF(TRIM(up.avatar_url), '') AS owner_avatar_url
            FROM travel_events te
            LEFT JOIN user_profiles up ON up.user_id = te.user_id
            WHERE te.user_id IN (%s)
            ORDER BY event_date ASC, event_time ASC, sort_order ASC, id ASC
            """.formatted(placeholders);

        List<MyPageDashboardRepository.MyPageTravelEventSnapshot> travelEvents = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query)) {
            int index = 1;
            for (String scopeUserId : userScopeIds) {
                statement.setString(index++, scopeUserId);
            }

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    travelEvents.add(new MyPageDashboardRepository.MyPageTravelEventSnapshot(
                        String.valueOf(resultSet.getLong("id")),
                        nullToEmpty(resultSet.getString("day_id")),
                        formatDate(resultSet.getDate("event_date")),
                        formatTime(resultSet.getTime("event_time")),
                        nullToEmpty(resultSet.getString("title")),
                        nullToEmpty(resultSet.getString("activity_label")),
                        nullToEmpty(resultSet.getString("google_map_url")),
                        normalizeTravelEventStatus(resultSet.getString("status")),
                        normalizeBookingType(resultSet.getString("booking_type")),
                        nullToEmpty(resultSet.getString("user_id")),
                        nullToEmpty(resultSet.getString("owner_name")),
                        nullToEmpty(resultSet.getString("owner_avatar_url"))
                    ));
                }
            }
        }

        return travelEvents;
    }

    private String normalizeBookingType(String bookingType) {
        if (!StringUtils.hasText(bookingType)) {
            return "air";
        }
        return bookingType.trim().toLowerCase(Locale.KOREA);
    }

    private String normalizeTravelEventStatus(String status) {
        if (!StringUtils.hasText(status)) {
            return "reserved";
        }
        return status.trim().toLowerCase(Locale.KOREA);
    }

    private String formatDate(java.sql.Date date) {
        if (date == null) {
            return "";
        }
        LocalDate localDate = date.toLocalDate();
        return DATE_FORMAT.format(localDate);
    }

    private String formatTime(java.sql.Time time) {
        if (time == null) {
            return "";
        }
        LocalTime localTime = time.toLocalTime();
        return TIME_FORMAT.format(localTime);
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value;
    }
}
