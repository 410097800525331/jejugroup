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

    // 이메일 중복 확인
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
        String query = "INSERT INTO users (id, pw, name, phone, email, birth_date, gender, provider, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'USER')";
        
        try (Connection conn = DBConn.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            pstmt.setString(1, user.getId());
            // 비밀번호는 추후 BCrypt 추가 모듈 필요 
            pstmt.setString(2, user.getPw());
            pstmt.setString(3, user.getName());
            pstmt.setString(4, user.getPhone());
            pstmt.setString(5, user.getEmail());
            pstmt.setString(6, user.getBirthDate());
            pstmt.setString(7, user.getGender());
            pstmt.setString(8, user.getProvider());
            
            int result = pstmt.executeUpdate();
            return result > 0;
            
        } catch (Exception e) {
            e.printStackTrace(); // 배포시 로그 시스템 연결로 대체
        }
        return false;
    }

    // 로그인 검증 로직 (Zero Monolith 보안 강화: 단방향 해시 검증)
    public UserDTO loginUser(String id, String plainPw) {
        String query = "SELECT id, pw, name, phone, email, birth_date, gender, provider, role FROM users WHERE id = ?";
        
        try (Connection conn = DBConn.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            pstmt.setString(1, id);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    String hashedPw = rs.getString("pw");
                    
                    // 평문과 DB의 해시를 비교 (단일 책임 모듈 호출)
                    if (util.BCryptUtil.checkPassword(plainPw, hashedPw)) {
                        UserDTO user = new UserDTO();
                        user.setId(rs.getString("id"));
                        user.setName(rs.getString("name"));
                        user.setPhone(rs.getString("phone"));
                        user.setEmail(rs.getString("email"));
                        user.setBirthDate(rs.getString("birth_date"));
                        user.setGender(rs.getString("gender"));
                        user.setProvider(rs.getString("provider"));
                        user.setRole(rs.getString("role"));
                        return user;
                    } else {
                        System.err.println("[SECURITY] 아이디(" + id + ") 로그인 실패: 비밀번호 불일치 (해시 검증 아웃)");
                    }
                } else {
                    System.err.println("[SECURITY] 아이디(" + id + ") 로그인 실패: 존재하지 않는 계정");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
