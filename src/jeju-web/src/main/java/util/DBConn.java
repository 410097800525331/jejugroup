package util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConn {
    public static Connection getConnection() throws SQLException, ClassNotFoundException {
        // DB 최적화: 최신 MySQL v8.0+ 드라이버 사용
        Class.forName("com.mysql.cj.jdbc.Driver");
        
        // [Security Protocol] 모든 접속 정보는 EnvLoader를 통해 관리
        String url = EnvLoader.get("DB_URL");
        String id = EnvLoader.get("DB_USER");
        String pw = EnvLoader.get("DB_PASSWORD");
        
        // 폴백 로직 (로컬 기본값) - 설정이 아예 없을 경우에만 작동
        if (url == null) url = "jdbc:mysql://127.0.0.1:3306/jejudb?useSSL=false&serverTimezone=Asia/Seoul&characterEncoding=UTF-8";
        if (id == null) id = "root";

        if (pw == null || pw.isEmpty()) {
            throw new SQLException("CRITICAL: DB_PASSWORD (env) is not set.");
        }
        
        return DriverManager.getConnection(url, id, pw);
    }
}
