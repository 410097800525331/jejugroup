package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import dto.UserDTO;
import util.DBConn;

public class UserDAO {
    // 보안 프로토콜: 무조건 PreparedStatement로 바인딩 처리 (SQL 인젝션 방어기제)
    // 아이디 중복 확인 (보안 프로토콜: PreparedStatement 사용)
    public boolean checkIdExists(String loginId) {
        String query = "SELECT login_id FROM users WHERE login_id = ?";
        try (Connection conn = DBConn.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            pstmt.setString(1, loginId);
            try (ResultSet rs = pstmt.executeQuery()) {
                return rs.next();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    // 이메일 중복 확인 (기존 호환성 유지)
    public boolean checkEmailExists(String email) {
        String query = "SELECT email FROM users WHERE email = ?";
        try (Connection conn = DBConn.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            pstmt.setString(1, email);
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
        String query = "INSERT INTO users (login_id, password, name, email, role) VALUES (?, ?, ?, ?, 'USER')";
        
        try (Connection conn = DBConn.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            pstmt.setString(1, user.getLoginId());
            // 비밀번호는 추후 BCrypt 추가 모듈 필요 
            pstmt.setString(2, user.getPassword());
            pstmt.setString(3, user.getName());
            pstmt.setString(4, user.getEmail());
            
            int result = pstmt.executeUpdate();
            return result > 0;
            
        } catch (Exception e) {
            e.printStackTrace(); // 배포시 로그 시스템 연결로 대체
        }
        return false;
    }

    // 로그인 검증 로직 (보안 프로토콜: PreparedStatement 사용)
    public UserDTO loginUser(String loginId, String password) {
        String query = "SELECT login_id, name, email, role FROM users WHERE login_id = ? AND password = ?";
        
        try (Connection conn = DBConn.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            pstmt.setString(1, loginId);
            pstmt.setString(2, password);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    UserDTO user = new UserDTO();
                    user.setLoginId(rs.getString("login_id"));
                    user.setName(rs.getString("name"));
                    user.setEmail(rs.getString("email"));
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
