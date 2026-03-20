package util;

import java.sql.Connection;
import java.sql.SQLException;

public class DBConnection {
    private DBConnection() {
    }

    public static Connection getConnection() throws ClassNotFoundException, SQLException {
        return DBConn.getConnection();
    }
}
