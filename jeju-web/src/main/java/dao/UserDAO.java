package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import dto.UserDTO;
import util.DBConn;

public class UserDAO {
    // 보안 프로토콜: 무조건 PreparedStatement로 바인딩 처리 (SQL 인젝션 방어기제)
    // 아이디 중복 확인 (보안 프로토콜: PreparedStatement 사용)
    public boolean checkIdExists(String id) {
        String query = "SELECT id FROM users WHERE id = ?";
        try (Connection conn = DBConn.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            pstmt.setString(1, id);
            try (ResultSet rs = pstmt.executeQuery()) {
                return rs.next();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    // 핸드폰 번호 중복 확인 (PASS 연동용, 1인 1계정)
    public boolean checkPhoneExists(String phone) {
        String query = "SELECT phone FROM users WHERE phone = ?";
        try (Connection conn = DBConn.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            pstmt.setString(1, phone);
            try (ResultSet rs = pstmt.executeQuery()) {
                return rs.next();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean insertUser(UserDTO user) {
        // 단일 책임 원칙: DB 맵핑 모델에만 데이터 전송 (나머지는 무시하거나 부가테이블에 추후 맵핑)
        String query = "INSERT INTO users (id, pw, name, phone, gender, provider, role) VALUES (?, ?, ?, ?, ?, ?, 'USER')";
        
        try (Connection conn = DBConn.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            pstmt.setString(1, user.getId());
            // 비밀번호는 추후 BCrypt 추가 모듈 필요 
            pstmt.setString(2, user.getPw());
            pstmt.setString(3, user.getName());
            pstmt.setString(4, user.getPhone());
            pstmt.setString(5, user.getGender());
            pstmt.setString(6, user.getProvider());
            
            int result = pstmt.executeUpdate();
            return result > 0;
            
        } catch (Exception e) {
            e.printStackTrace(); // 배포시 로그 시스템 연결로 대체
        }
        return false;
    }

    // 로그인 검증 로직 (보안 프로토콜: PreparedStatement 사용)
    public UserDTO loginUser(String id, String pw) {
        String query = "SELECT id, name, phone, gender, provider, role FROM users WHERE id = ? AND pw = ?";
        
        try (Connection conn = DBConn.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            pstmt.setString(1, id);
            pstmt.setString(2, pw);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    UserDTO user = new UserDTO();
                    user.setId(rs.getString("id"));
                    user.setName(rs.getString("name"));
                    user.setPhone(rs.getString("phone"));
                    user.setGender(rs.getString("gender"));
                    user.setProvider(rs.getString("provider"));
                    user.setRole(rs.getString("role"));
                    return user;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
