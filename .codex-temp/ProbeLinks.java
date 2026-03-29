import java.sql.*;
public class ProbeLinks {
  public static void main(String[] args) throws Exception {
    String url = System.getenv("ALWAYSDATA_DB_URL");
    String user = System.getenv("ALWAYSDATA_DB_USER");
    String pass = System.getenv("ALWAYSDATA_DB_PASSWORD");
    try (Connection c = DriverManager.getConnection(url, user, pass)) {
      for (String owner : new String[]{"test", "test10"}) {
        try (PreparedStatement ps = c.prepareStatement("select owner_user_id, companion_user_id, is_member from companion_links where owner_user_id=? order by companion_user_id")) {
          ps.setString(1, owner);
          try (ResultSet rs = ps.executeQuery()) {
            System.out.println("owner=" + owner);
            while (rs.next()) {
              System.out.println(rs.getString(1)+"|"+rs.getString(2)+"|"+rs.getInt(3));
            }
          }
        }
      }
    }
  }
}
