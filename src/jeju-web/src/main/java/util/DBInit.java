package util;

import java.sql.Connection;
import java.sql.Statement;

public class DBInit {
    public static void main(String[] args) {
        try (Connection conn = DBConn.getConnection();
             Statement stmt = conn.createStatement()) {

            stmt.execute("DROP TABLE IF EXISTS users");

            String sql = "CREATE TABLE users (" +
                         " id VARCHAR(50) PRIMARY KEY," +
                         " pw VARCHAR(255) NOT NULL," +
                         " name VARCHAR(50) NOT NULL," +
                         " phone VARCHAR(30) NOT NULL UNIQUE," +
                         " email VARCHAR(100) NOT NULL UNIQUE," +
                         " birth_date DATE NOT NULL," +
                         " gender CHAR(1) NOT NULL," +
                         " provider VARCHAR(20) NOT NULL DEFAULT 'PASS'," +
                         " role VARCHAR(20) NOT NULL DEFAULT 'USER'," +
                         " created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                         ")";

            stmt.execute(sql);
            System.out.println("users table created successfully using DBConn.");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
