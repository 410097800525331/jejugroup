package dao;

import dto.Inquiry;
import util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class InquiryDAO {
    public List<Inquiry> getAll() throws Exception {
        String sql = "SELECT id, title, content, service, status, created_at FROM inquiry ORDER BY id DESC";
        List<Inquiry> inquiries = new ArrayList<>();

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {

            while (rs.next()) {
                inquiries.add(mapRow(rs));
            }
        }

        return inquiries;
    }

    public Inquiry getById(int id) throws Exception {
        String sql = "SELECT id, title, content, service, status, created_at FROM inquiry WHERE id = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, id);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return mapRow(rs);
                }
            }
        }

        return null;
    }

    public void insert(Inquiry inquiry) throws Exception {
        String sql = "INSERT INTO inquiry (title, content, service, status) VALUES (?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, inquiry.getTitle());
            pstmt.setString(2, inquiry.getContent());
            pstmt.setString(3, inquiry.getService());
            pstmt.setString(4, isBlank(inquiry.getStatus()) ? "접수" : inquiry.getStatus());
            pstmt.executeUpdate();
        }
    }

    private Inquiry mapRow(ResultSet rs) throws Exception {
        Inquiry inquiry = new Inquiry();
        inquiry.setId(rs.getInt("id"));
        inquiry.setTitle(rs.getString("title"));
        inquiry.setContent(rs.getString("content"));
        inquiry.setService(rs.getString("service"));
        inquiry.setStatus(rs.getString("status"));
        inquiry.setCreatedAt(rs.getTimestamp("created_at"));
        return inquiry;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
