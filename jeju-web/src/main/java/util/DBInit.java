package util;

import java.sql.Connection;
import java.sql.Statement;

public class DBInit {
    public static void main(String[] args) {
        try (Connection conn = DBConn.getConnection();
             Statement stmt = conn.createStatement()) {
            
            stmt.execute("DROP TABLE IF EXISTS member");
            
            String sql = "CREATE TABLE `member` (" +
                         "  `phone` varchar(30) NOT NULL," +
                         "  `name` varchar(20) NOT NULL," +
                         "  `gender` char(1) NOT NULL," +
                         "  `id` varchar(20) PRIMARY KEY," +
                         "  `pw` varchar(255) NOT NULL," +
                         "  `email` varchar(30) NOT NULL," +
                         "  `zipcode` char(7) NOT NULL," +
                         "  `address1` varchar(60) NOT NULL," +
                         "  `address2` varchar(60) NOT NULL" +
                         ")";
            stmt.execute(sql);
            System.out.println("Member table created successfully using DBConn.");
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
