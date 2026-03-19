package dao;

import dto.InquiryDTO;
import util.DBConn;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

public class InquiryDAO {
    private static final String DEFAULT_STATUS = "pending";
    private static final DateTimeFormatter LIST_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy.MM.dd");

    public long insertInquiry(InquiryDTO inquiry) throws SQLException, ClassNotFoundException {
        String query = "INSERT INTO inquiry (title, content, service, status) VALUES (?, ?, ?, ?)";

        try (Connection conn = DBConn.getConnection()) {
            ensureSchema(conn);

            try (PreparedStatement pstmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {
                pstmt.setString(1, inquiry.getTitle());
                pstmt.setString(2, inquiry.getContent());
                pstmt.setString(3, inquiry.getService());
                pstmt.setString(4, defaultIfBlank(inquiry.getStatus(), DEFAULT_STATUS));

                int affectedRows = pstmt.executeUpdate();
                if (affectedRows == 0) {
                    throw new SQLException("No inquiry row was inserted.");
                }

                try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        return generatedKeys.getLong(1);
                    }
                }
            }
        }

        return -1L;
    }

    public List<InquiryDTO> findAll() throws SQLException, ClassNotFoundException {
        String query = "SELECT id, title, content, service, status, created_at FROM inquiry ORDER BY id DESC";
        List<InquiryDTO> inquiries = new ArrayList<>();

        try (Connection conn = DBConn.getConnection()) {
            ensureSchema(conn);

            try (PreparedStatement pstmt = conn.prepareStatement(query);
                 ResultSet rs = pstmt.executeQuery()) {

                Set<String> columns = collectColumns(rs.getMetaData());
                while (rs.next()) {
                    inquiries.add(mapInquiry(rs, columns));
                }
            }
        }

        return inquiries;
    }

    public InquiryDTO findById(long inquiryId) throws SQLException, ClassNotFoundException {
        String query = "SELECT id, title, content, service, status, created_at FROM inquiry WHERE id = ?";

        try (Connection conn = DBConn.getConnection()) {
            ensureSchema(conn);

            try (PreparedStatement pstmt = conn.prepareStatement(query)) {
                pstmt.setLong(1, inquiryId);

                try (ResultSet rs = pstmt.executeQuery()) {
                    Set<String> columns = collectColumns(rs.getMetaData());
                    if (rs.next()) {
                        return mapInquiry(rs, columns);
                    }
                }
            }
        }

        return null;
    }

    public boolean updateInquiry(InquiryDTO inquiry) throws SQLException, ClassNotFoundException {
        String query = "UPDATE inquiry SET title = ?, content = ?, service = ? WHERE id = ?";

        try (Connection conn = DBConn.getConnection()) {
            ensureSchema(conn);

            try (PreparedStatement pstmt = conn.prepareStatement(query)) {
                pstmt.setString(1, inquiry.getTitle());
                pstmt.setString(2, inquiry.getContent());
                pstmt.setString(3, inquiry.getService());
                pstmt.setLong(4, inquiry.getId());
                return pstmt.executeUpdate() > 0;
            }
        }
    }

    public boolean deleteInquiry(long inquiryId) throws SQLException, ClassNotFoundException {
        String query = "DELETE FROM inquiry WHERE id = ?";

        try (Connection conn = DBConn.getConnection()) {
            ensureSchema(conn);

            try (PreparedStatement pstmt = conn.prepareStatement(query)) {
                pstmt.setLong(1, inquiryId);
                return pstmt.executeUpdate() > 0;
            }
        }
    }

    private InquiryDTO mapInquiry(ResultSet rs, Set<String> columns) throws SQLException {
        InquiryDTO inquiry = new InquiryDTO();

        inquiry.setId(readLong(rs, columns, "id"));
        inquiry.setTitle(readString(rs, columns, "title"));
        inquiry.setContent(readString(rs, columns, "content"));
        inquiry.setService(defaultIfBlank(readString(rs, columns, "service"), "jeju-air"));
        inquiry.setStatus(defaultIfBlank(readString(rs, columns, "status"), DEFAULT_STATUS));
        inquiry.setCreatedAt(resolveCreatedAt(rs, columns));

        return inquiry;
    }

    private void ensureSchema(Connection conn) throws SQLException {
        try (Statement stmt = conn.createStatement()) {
            stmt.execute(
                "CREATE TABLE IF NOT EXISTS inquiry ("
                    + "id INT AUTO_INCREMENT PRIMARY KEY,"
                    + "title VARCHAR(255),"
                    + "content TEXT,"
                    + "service VARCHAR(100),"
                    + "status VARCHAR(50),"
                    + "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
                    + ")"
            );
        }

        ensureColumn(conn, "status", "ALTER TABLE inquiry ADD COLUMN status VARCHAR(50) AFTER service");
        ensureColumn(
            conn,
            "created_at",
            "ALTER TABLE inquiry ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER status"
        );
    }

    private void ensureColumn(Connection conn, String columnName, String ddl) throws SQLException {
        DatabaseMetaData metaData = conn.getMetaData();
        try (ResultSet rs = metaData.getColumns(conn.getCatalog(), null, "inquiry", columnName)) {
            if (rs.next()) {
                return;
            }
        }

        try (Statement stmt = conn.createStatement()) {
            stmt.execute(ddl);
        }
    }

    private Set<String> collectColumns(ResultSetMetaData metaData) throws SQLException {
        Set<String> columns = new HashSet<>();
        for (int index = 1; index <= metaData.getColumnCount(); index++) {
            columns.add(metaData.getColumnLabel(index).toLowerCase(Locale.ROOT));
        }
        return columns;
    }

    private long readLong(ResultSet rs, Set<String> columns, String... candidates) throws SQLException {
        for (String candidate : candidates) {
            if (!columns.contains(candidate.toLowerCase(Locale.ROOT))) {
                continue;
            }

            long value = rs.getLong(candidate);
            if (!rs.wasNull()) {
                return value;
            }
        }
        return 0L;
    }

    private String readString(ResultSet rs, Set<String> columns, String... candidates) throws SQLException {
        for (String candidate : candidates) {
            if (!columns.contains(candidate.toLowerCase(Locale.ROOT))) {
                continue;
            }

            String value = rs.getString(candidate);
            if (value != null) {
                return value;
            }
        }
        return "";
    }

    private String resolveCreatedAt(ResultSet rs, Set<String> columns) throws SQLException {
        Timestamp timestamp = readTimestamp(rs, columns, "created_at", "createdat", "reg_date", "created_date");
        if (timestamp != null) {
            return timestamp.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate()
                .format(LIST_DATE_FORMAT);
        }

        Date date = readSqlDate(rs, columns, "created_at", "createdat", "reg_date", "created_date", "date");
        if (date != null) {
            return date.toLocalDate().format(LIST_DATE_FORMAT);
        }

        return java.time.LocalDate.now().format(LIST_DATE_FORMAT);
    }

    private Timestamp readTimestamp(ResultSet rs, Set<String> columns, String... candidates) throws SQLException {
        for (String candidate : candidates) {
            if (!columns.contains(candidate.toLowerCase(Locale.ROOT))) {
                continue;
            }

            Timestamp value = rs.getTimestamp(candidate);
            if (value != null) {
                return value;
            }
        }
        return null;
    }

    private Date readSqlDate(ResultSet rs, Set<String> columns, String... candidates) throws SQLException {
        for (String candidate : candidates) {
            if (!columns.contains(candidate.toLowerCase(Locale.ROOT))) {
                continue;
            }

            Date value = rs.getDate(candidate);
            if (value != null) {
                return value;
            }
        }
        return null;
    }

    private String defaultIfBlank(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}
