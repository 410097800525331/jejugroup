package util;

import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.URI;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.Duration;

public class TestDB {
    public static void main(String[] args) {
        System.out.println("=== Jeju Group JDBC Connectivity Test ===");
        System.out.println("Java: " + System.getProperty("java.version"));

        String url = EnvLoader.get("DB_URL");
        String user = EnvLoader.get("DB_USER");
        String password = EnvLoader.get("DB_PASSWORD");

        System.out.println("[Env] DB_URL: " + safe(url));
        System.out.println("[Env] DB_USER: " + safe(user));
        System.out.println("[Env] DB_PASSWORD length: " + (password == null ? 0 : password.length()));

        if (isBlank(url) || isBlank(user) || password == null) {
            System.err.println("[FAIL] Missing DB env values. Check jeju-web/.env");
            System.exit(2);
        }

        testTcp(url);
        testJdbc();
    }

    private static void testTcp(String jdbcUrl) {
        HostPort hp = parseHostPort(jdbcUrl);
        if (hp == null) {
            System.out.println("[TCP] Skip (could not parse host/port from DB_URL)");
            return;
        }

        System.out.println("[TCP] Testing socket to " + hp.host + ":" + hp.port + " ...");
        long start = System.nanoTime();
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(hp.host, hp.port), (int) Duration.ofSeconds(5).toMillis());
            long elapsedMs = Duration.ofNanos(System.nanoTime() - start).toMillis();
            System.out.println("[TCP] OK (" + elapsedMs + " ms)");
        } catch (Exception e) {
            System.err.println("[TCP] FAIL: " + e.getClass().getSimpleName() + " - " + e.getMessage());
        }
    }

    private static void testJdbc() {
        System.out.println("[JDBC] Connecting with DBConn.getConnection()...");
        long start = System.nanoTime();
        try {
            try (Connection conn = DBConn.getConnection();
                 Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery("SELECT NOW() AS now_time, CURRENT_USER() AS current_user_name")) {

                long elapsedMs = Duration.ofNanos(System.nanoTime() - start).toMillis();
                System.out.println("[JDBC] OK (" + elapsedMs + " ms)");

                if (rs.next()) {
                    System.out.println("[JDBC] DB_TIME: " + rs.getString("now_time"));
                    System.out.println("[JDBC] CURRENT_USER(): " + rs.getString("current_user_name"));
                }
            }
        } catch (SQLException e) {
            long elapsedMs = Duration.ofNanos(System.nanoTime() - start).toMillis();
            System.err.println("[JDBC] FAIL (" + elapsedMs + " ms)");
            System.err.println("[JDBC] SQLState : " + e.getSQLState());
            System.err.println("[JDBC] ErrorCode: " + e.getErrorCode());
            System.err.println("[JDBC] Message  : " + e.getMessage());
            printHint(e.getMessage());
            System.exit(1);
        } catch (Exception e) {
            System.err.println("[JDBC] FAIL: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            System.exit(1);
        }
    }

    private static void printHint(String msg) {
        if (msg == null) {
            return;
        }
        String lower = msg.toLowerCase();
        if (lower.contains("access denied")) {
            System.err.println("[Hint] DB host is reachable but authentication/permission is rejected.");
            System.err.println("[Hint] Alwaysdata panel: re-save DB user password and grant privileges to jejugroup_db.");
            System.err.println("[Hint] Check allowed hosts for user 'jejugroup' (or wildcard) after account recreation.");
        }
    }

    private static HostPort parseHostPort(String jdbcUrl) {
        try {
            String uriRaw = jdbcUrl.replaceFirst("^jdbc:", "");
            URI uri = URI.create(uriRaw);
            String host = uri.getHost();
            int port = uri.getPort() > 0 ? uri.getPort() : 3306;
            if (isBlank(host)) {
                return null;
            }
            return new HostPort(host, port);
        } catch (Exception e) {
            return null;
        }
    }

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    private static String safe(String value) {
        return value == null ? "<null>" : value;
    }

    private static class HostPort {
        private final String host;
        private final int port;

        private HostPort(String host, int port) {
            this.host = host;
            this.port = port;
        }
    }
}
