package com.jejugroup.jejuspring.stay.application;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.jejugroup.jejuspring.config.AppProperties;
import com.jejugroup.jejuspring.stay.view.StayMonthlyDealListView;

@Service
public class StayMonthlyDealDbStore {
    private static final Comparator<MonthlyDealRow> DEAL_ORDER = Comparator
        .comparingInt(MonthlyDealRow::priority)
        .thenComparing(MonthlyDealRow::propertyCode);

    private final AppProperties appProperties;

    public StayMonthlyDealDbStore(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    public StayMonthlyDealListView loadVisibleMonthlyDeals() {
        try (Connection connection = openConnection()) {
            connection.setReadOnly(true);

            List<MonthlyDealRow> dealRows = loadMonthlyDealRows(connection);
            if (dealRows.isEmpty()) {
                return new StayMonthlyDealListView(List.of(), 0);
            }

            List<Long> propertyIds = dealRows.stream()
                .map(MonthlyDealRow::propertyId)
                .toList();
            Map<Long, List<StayMonthlyDealListView.Tag>> tagsByPropertyId = loadTagsByPropertyId(connection, propertyIds);
            Map<Long, List<StayMonthlyDealListView.Benefit>> benefitsByPropertyId = loadBenefitsByPropertyId(connection, propertyIds);

            List<StayMonthlyDealListView.HotelDeal> items = dealRows.stream()
                .sorted(DEAL_ORDER)
                .map(row -> toView(row, tagsByPropertyId.getOrDefault(row.propertyId(), List.of()), benefitsByPropertyId.getOrDefault(row.propertyId(), List.of())))
                .toList();

            return new StayMonthlyDealListView(items, items.size());
        } catch (SQLException exception) {
            throw new IllegalStateException("stay monthly deals service unavailable", exception);
        }
    }

    private StayMonthlyDealListView.HotelDeal toView(
        MonthlyDealRow row,
        List<StayMonthlyDealListView.Tag> tags,
        List<StayMonthlyDealListView.Benefit> benefits
    ) {
        BigDecimal currentPrice = firstNonNull(row.currentPriceOverride(), BigDecimal.ZERO);
        BigDecimal safeDiscountAmount = firstNonNull(row.discountAmount(), BigDecimal.ZERO);
        BigDecimal originalPrice = firstNonNull(row.originalPriceOverride(), currentPrice.add(safeDiscountAmount));
        BigDecimal discountAmount = firstNonNull(row.discountAmount(), originalPrice.subtract(currentPrice));
        int discountRate = resolveDiscountRate(originalPrice, discountAmount);

        return new StayMonthlyDealListView.HotelDeal(
            row.propertyCode(),
            firstNonBlank(row.titleOverride(), row.propertyName()),
            firstNonBlank(row.badgeText(), ""),
            firstNonBlank(row.summaryText(), row.regionName()),
            row.regionName(),
            row.heroImagePath(),
            originalPrice,
            currentPrice,
            discountAmount,
            discountRate,
            row.starRating(),
            row.roomTypeCode(),
            firstNonBlank(row.roomTypeName(), row.propertyName()),
            row.maxOccupancy(),
            row.policyCode(),
            row.policyName(),
            tags,
            benefits
        );
    }

    private List<MonthlyDealRow> loadMonthlyDealRows(Connection connection) throws SQLException {
        String query = """
            SELECT
                hp.id AS property_id,
                hp.property_code,
                hp.name AS property_name,
                hp.region_name,
                hp.star_rating,
                hdo.title_override,
                hdo.badge_text,
                hdo.original_price_override,
                hdo.current_price_override,
                hdo.hero_image_url,
                hdo.summary_text,
                hrt.room_type_code,
                hrt.name AS room_type_name,
                hrt.max_occupancy,
                pp.policy_code,
                pp.policy_name,
                pp.discount_value,
                pp.priority
            FROM hotel_properties hp
            INNER JOIN hotel_display_overrides hdo
                ON hdo.hotel_property_id = hp.id
               AND hdo.is_visible = 1
            INNER JOIN hotel_price_policies pp
                ON pp.hotel_property_id = hp.id
               AND pp.is_active = 1
               AND pp.policy_code LIKE '%-monthly-deal'
            LEFT JOIN hotel_room_types hrt
                ON hrt.id = pp.hotel_room_type_id
            WHERE hp.service_type = 'stay'
              AND hp.is_active = 1
            ORDER BY pp.priority ASC, hp.property_code ASC
            """;

        List<MonthlyDealRow> rows = new ArrayList<>();
        try (PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                rows.add(new MonthlyDealRow(
                    resultSet.getLong("property_id"),
                    normalizeText(resultSet.getString("property_code")),
                    normalizeText(resultSet.getString("property_name")),
                    normalizeText(resultSet.getString("region_name")),
                    nullableDouble(resultSet, "star_rating"),
                    normalizeText(resultSet.getString("title_override")),
                    normalizeText(resultSet.getString("badge_text")),
                    resultSet.getBigDecimal("original_price_override"),
                    resultSet.getBigDecimal("current_price_override"),
                    normalizePath(resultSet.getString("hero_image_url")),
                    normalizeText(resultSet.getString("summary_text")),
                    normalizeText(resultSet.getString("room_type_code")),
                    normalizeText(resultSet.getString("room_type_name")),
                    nullableInteger(resultSet, "max_occupancy"),
                    normalizeText(resultSet.getString("policy_code")),
                    normalizeText(resultSet.getString("policy_name")),
                    resultSet.getBigDecimal("discount_value"),
                    resultSet.getInt("priority")
                ));
            }
        }

        return rows;
    }

    private Map<Long, List<StayMonthlyDealListView.Tag>> loadTagsByPropertyId(Connection connection, List<Long> propertyIds) throws SQLException {
        if (propertyIds.isEmpty()) {
            return Map.of();
        }

        String query = """
            SELECT
                hotel_property_id,
                tag_name,
                tag_type,
                sort_order
            FROM hotel_tags
            WHERE hotel_property_id IN (%s)
              AND is_active = 1
            ORDER BY hotel_property_id ASC, sort_order ASC, id ASC
            """.formatted(buildInClause(propertyIds.size()));

        Map<Long, List<StayMonthlyDealListView.Tag>> tagsByPropertyId = new LinkedHashMap<>();
        try (PreparedStatement statement = connection.prepareStatement(query)) {
            bindLongs(statement, propertyIds);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    long propertyId = resultSet.getLong("hotel_property_id");
                    tagsByPropertyId.computeIfAbsent(propertyId, ignored -> new ArrayList<>()).add(
                        new StayMonthlyDealListView.Tag(
                            normalizeText(resultSet.getString("tag_name")),
                            normalizeText(resultSet.getString("tag_type")),
                            resultSet.getInt("sort_order")
                        )
                    );
                }
            }
        }

        return freezeLists(tagsByPropertyId);
    }

    private Map<Long, List<StayMonthlyDealListView.Benefit>> loadBenefitsByPropertyId(Connection connection, List<Long> propertyIds) throws SQLException {
        if (propertyIds.isEmpty()) {
            return Map.of();
        }

        String query = """
            SELECT
                hotel_property_id,
                benefit_code,
                benefit_name,
                benefit_icon,
                sort_order
            FROM hotel_benefits
            WHERE hotel_property_id IN (%s)
              AND is_active = 1
            ORDER BY hotel_property_id ASC, sort_order ASC, id ASC
            """.formatted(buildInClause(propertyIds.size()));

        Map<Long, List<StayMonthlyDealListView.Benefit>> benefitsByPropertyId = new LinkedHashMap<>();
        try (PreparedStatement statement = connection.prepareStatement(query)) {
            bindLongs(statement, propertyIds);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    long propertyId = resultSet.getLong("hotel_property_id");
                    benefitsByPropertyId.computeIfAbsent(propertyId, ignored -> new ArrayList<>()).add(
                        new StayMonthlyDealListView.Benefit(
                            normalizeText(resultSet.getString("benefit_code")),
                            normalizeText(resultSet.getString("benefit_name")),
                            normalizeText(resultSet.getString("benefit_icon")),
                            resultSet.getInt("sort_order")
                        )
                    );
                }
            }
        }

        return freezeBenefitLists(benefitsByPropertyId);
    }

    private Map<Long, List<StayMonthlyDealListView.Tag>> freezeLists(Map<Long, List<StayMonthlyDealListView.Tag>> source) {
        Map<Long, List<StayMonthlyDealListView.Tag>> frozen = new LinkedHashMap<>();
        for (Map.Entry<Long, List<StayMonthlyDealListView.Tag>> entry : source.entrySet()) {
            frozen.put(entry.getKey(), List.copyOf(entry.getValue()));
        }
        return Map.copyOf(frozen);
    }

    private Map<Long, List<StayMonthlyDealListView.Benefit>> freezeBenefitLists(Map<Long, List<StayMonthlyDealListView.Benefit>> source) {
        Map<Long, List<StayMonthlyDealListView.Benefit>> frozen = new LinkedHashMap<>();
        for (Map.Entry<Long, List<StayMonthlyDealListView.Benefit>> entry : source.entrySet()) {
            frozen.put(entry.getKey(), List.copyOf(entry.getValue()));
        }
        return Map.copyOf(frozen);
    }

    private int resolveDiscountRate(BigDecimal originalPrice, BigDecimal discountAmount) {
        if (originalPrice == null || originalPrice.compareTo(BigDecimal.ZERO) <= 0 || discountAmount == null) {
            return 0;
        }

        return discountAmount
            .multiply(BigDecimal.valueOf(100))
            .divide(originalPrice, 0, RoundingMode.HALF_UP)
            .intValue();
    }

    private Connection openConnection() throws SQLException {
        String url = normalizeText(appProperties.database().dbUrl());
        String user = normalizeText(appProperties.database().dbUser());
        String password = normalizeText(appProperties.database().dbPassword());

        if (!StringUtils.hasText(url) || !StringUtils.hasText(user) || !StringUtils.hasText(password)) {
            throw new SQLException("stay DB configuration is missing");
        }

        return DriverManager.getConnection(url, user, password);
    }

    private void bindLongs(PreparedStatement statement, List<Long> values) throws SQLException {
        for (int index = 0; index < values.size(); index++) {
            statement.setLong(index + 1, values.get(index));
        }
    }

    private String buildInClause(int size) {
        StringBuilder builder = new StringBuilder();
        for (int index = 0; index < size; index++) {
            if (index > 0) {
                builder.append(", ");
            }
            builder.append("?");
        }
        return builder.toString();
    }

    private String normalizeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizePath(String value) {
        String normalized = normalizeText(value);
        if (!StringUtils.hasText(normalized)) {
            return "";
        }
        return normalized.startsWith("/") ? normalized : "/" + normalized;
    }

    private String firstNonBlank(String first, String second) {
        return StringUtils.hasText(first) ? first.trim() : normalizeText(second);
    }

    private BigDecimal firstNonNull(BigDecimal first, BigDecimal second) {
        return first != null ? first : second == null ? BigDecimal.ZERO : second;
    }

    private Double nullableDouble(ResultSet resultSet, String columnLabel) throws SQLException {
        double value = resultSet.getDouble(columnLabel);
        return resultSet.wasNull() ? null : value;
    }

    private Integer nullableInteger(ResultSet resultSet, String columnLabel) throws SQLException {
        int value = resultSet.getInt(columnLabel);
        return resultSet.wasNull() ? null : value;
    }

    private record MonthlyDealRow(
        long propertyId,
        String propertyCode,
        String propertyName,
        String regionName,
        Double starRating,
        String titleOverride,
        String badgeText,
        BigDecimal originalPriceOverride,
        BigDecimal currentPriceOverride,
        String heroImagePath,
        String summaryText,
        String roomTypeCode,
        String roomTypeName,
        Integer maxOccupancy,
        String policyCode,
        String policyName,
        BigDecimal discountAmount,
        int priority
    ) {
    }
}
