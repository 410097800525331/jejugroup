package com.jejugroup.jejuspring.customercenter.support;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.jejugroup.jejuspring.config.AppProperties;

@Service
class SupportCategoryService extends SupportDatabaseSupport {
    SupportCategoryService(AppProperties appProperties) {
        super(appProperties);
    }

    List<SupportCategoryView> listCategories(String serviceType) throws SQLException {
        String normalizedServiceType = normalizeOptionalServiceType(serviceType);
        StringBuilder query = new StringBuilder("""
            SELECT id, service_type, code, name, description, sort_order, is_active
            FROM support_categories
            WHERE is_active = 1
            """);
        if (normalizedServiceType != null) {
            query.append(" AND service_type = ?");
        }
        query.append(" ORDER BY sort_order ASC, id ASC");

        try (Connection connection = openConnection();
             PreparedStatement statement = connection.prepareStatement(query.toString())) {
            if (normalizedServiceType != null) {
                statement.setString(1, normalizedServiceType);
            }

            List<SupportCategoryView> categories = new ArrayList<>();
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    categories.add(toCategoryView(resultSet));
                }
            }
            return categories;
        }
    }

    private SupportCategoryView toCategoryView(ResultSet resultSet) throws SQLException {
        return new SupportCategoryView(
            resultSet.getLong("id"),
            normalizeNullable(resultSet.getString("service_type")),
            normalizeNullable(resultSet.getString("code")),
            normalizeNullable(resultSet.getString("name")),
            normalizeNullable(resultSet.getString("description")),
            resultSet.getInt("sort_order"),
            resultSet.getInt("is_active") == 1
        );
    }
}
