package com.jejugroup.jejuspring.customercenter.cms.application;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import com.jejugroup.jejuspring.config.AppProperties;

@Service
public class CustomerCenterCmsReadService extends CustomerCenterCmsDatabaseSupport {
    public CustomerCenterCmsReadService(AppProperties appProperties) {
        super(appProperties);
    }

    public List<CustomerCenterCmsService.NoticeView> listNotices(String serviceType) throws SQLException {
        String normalizedServiceType = normalizeServiceTypeFilter(serviceType);
        StringBuilder query = new StringBuilder("""
            SELECT id, service_type, notice_type, title, excerpt, content, is_pinned, is_active, published_at, created_at, updated_at
            FROM notices
            WHERE is_active = 1
            """);
        if (normalizedServiceType != null) {
            query.append(" AND service_type = ?");
        }
        query.append("""
            ORDER BY is_pinned DESC, COALESCE(published_at, created_at) DESC, id DESC
            """);

        List<CustomerCenterCmsService.NoticeView> notices = new ArrayList<>();
        try (Connection connection = openConnection(true);
             PreparedStatement statement = connection.prepareStatement(query.toString())) {
            if (normalizedServiceType != null) {
                statement.setString(1, normalizedServiceType);
            }
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    notices.add(toNoticeView(readNoticeRow(resultSet)));
                }
            }
        }
        return List.copyOf(notices);
    }

    public CustomerCenterCmsService.NoticeView getNotice(long noticeId, String serviceType) throws SQLException {
        NoticeRow notice = loadVisibleNotice(noticeId, serviceType);
        if (notice == null) {
            throw new NoSuchElementException("Notice not found");
        }
        return toNoticeView(notice);
    }

    public List<CustomerCenterCmsService.FaqView> listFaqs(String serviceType) throws SQLException {
        String normalizedServiceType = normalizeServiceTypeFilter(serviceType);
        StringBuilder query = new StringBuilder("""
            SELECT id, service_type, category, question, answer, sort_order, is_active, created_at, updated_at
            FROM faqs
            WHERE is_active = 1
            """);
        if (normalizedServiceType != null) {
            query.append(" AND service_type = ?");
        }
        query.append("""
            ORDER BY sort_order ASC, id ASC
            """);

        List<CustomerCenterCmsService.FaqView> faqs = new ArrayList<>();
        try (Connection connection = openConnection(true);
             PreparedStatement statement = connection.prepareStatement(query.toString())) {
            if (normalizedServiceType != null) {
                statement.setString(1, normalizedServiceType);
            }
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    faqs.add(toFaqView(readFaqRow(resultSet)));
                }
            }
        }
        return List.copyOf(faqs);
    }

    public CustomerCenterCmsService.FaqView getFaq(long faqId, String serviceType) throws SQLException {
        FaqRow faq = loadVisibleFaq(faqId, serviceType);
        if (faq == null) {
            throw new NoSuchElementException("FAQ not found");
        }
        return toFaqView(faq);
    }

    private NoticeRow loadVisibleNotice(long noticeId, String serviceType) throws SQLException {
        String normalizedServiceType = normalizeServiceTypeFilter(serviceType);
        StringBuilder query = new StringBuilder("""
            SELECT id, service_type, notice_type, title, excerpt, content, is_pinned, is_active, published_at, created_at, updated_at
            FROM notices
            WHERE id = ?
              AND is_active = 1
            """);
        if (normalizedServiceType != null) {
            query.append(" AND service_type = ?");
        }
        try (Connection connection = openConnection(true);
             PreparedStatement statement = connection.prepareStatement(query.toString())) {
            statement.setLong(1, noticeId);
            if (normalizedServiceType != null) {
                statement.setString(2, normalizedServiceType);
            }
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return null;
                }
                return readNoticeRow(resultSet);
            }
        }
    }

    private FaqRow loadVisibleFaq(long faqId, String serviceType) throws SQLException {
        String normalizedServiceType = normalizeServiceTypeFilter(serviceType);
        StringBuilder query = new StringBuilder("""
            SELECT id, service_type, category, question, answer, sort_order, is_active, created_at, updated_at
            FROM faqs
            WHERE id = ?
              AND is_active = 1
            """);
        if (normalizedServiceType != null) {
            query.append(" AND service_type = ?");
        }
        try (Connection connection = openConnection(true);
             PreparedStatement statement = connection.prepareStatement(query.toString())) {
            statement.setLong(1, faqId);
            if (normalizedServiceType != null) {
                statement.setString(2, normalizedServiceType);
            }
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return null;
                }
                return readFaqRow(resultSet);
            }
        }
    }

    private NoticeRow readNoticeRow(ResultSet resultSet) throws SQLException {
        return new NoticeRow(
            resultSet.getLong("id"),
            normalizeNullable(resultSet.getString("service_type")),
            normalizeNullable(resultSet.getString("notice_type")),
            normalizeNullable(resultSet.getString("title")),
            normalizeNullable(resultSet.getString("excerpt")),
            normalizeNullable(resultSet.getString("content")),
            resultSet.getBoolean("is_pinned"),
            resultSet.getBoolean("is_active"),
            toLocalDateTime(resultSet.getTimestamp("published_at")),
            toLocalDateTime(resultSet.getTimestamp("created_at")),
            toLocalDateTime(resultSet.getTimestamp("updated_at"))
        );
    }

    private FaqRow readFaqRow(ResultSet resultSet) throws SQLException {
        return new FaqRow(
            resultSet.getLong("id"),
            normalizeNullable(resultSet.getString("service_type")),
            normalizeNullable(resultSet.getString("category")),
            normalizeNullable(resultSet.getString("question")),
            normalizeNullable(resultSet.getString("answer")),
            resultSet.getInt("sort_order"),
            resultSet.getBoolean("is_active"),
            toLocalDateTime(resultSet.getTimestamp("created_at")),
            toLocalDateTime(resultSet.getTimestamp("updated_at"))
        );
    }

    private CustomerCenterCmsService.NoticeView toNoticeView(NoticeRow row) {
        return new CustomerCenterCmsService.NoticeView(
            row.id(),
            row.serviceType(),
            row.noticeType(),
            row.title(),
            row.excerpt(),
            row.content(),
            row.pinned(),
            row.active(),
            row.publishedAt(),
            row.createdAt(),
            row.updatedAt()
        );
    }

    private CustomerCenterCmsService.FaqView toFaqView(FaqRow row) {
        return new CustomerCenterCmsService.FaqView(
            row.id(),
            row.serviceType(),
            row.category(),
            row.question(),
            row.answer(),
            row.sortOrder(),
            row.active(),
            row.createdAt(),
            row.updatedAt()
        );
    }

    private record NoticeRow(
        long id,
        String serviceType,
        String noticeType,
        String title,
        String excerpt,
        String content,
        boolean pinned,
        boolean active,
        java.time.LocalDateTime publishedAt,
        java.time.LocalDateTime createdAt,
        java.time.LocalDateTime updatedAt
    ) {
    }

    private record FaqRow(
        long id,
        String serviceType,
        String category,
        String question,
        String answer,
        int sortOrder,
        boolean active,
        java.time.LocalDateTime createdAt,
        java.time.LocalDateTime updatedAt
    ) {
    }
}
