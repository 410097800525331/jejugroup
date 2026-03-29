import java.sql.*;
import com.jejugroup.jejuspring.config.AppProperties;
import com.jejugroup.jejuspring.mypage.application.*;
import com.jejugroup.jejuspring.booking.application.BookingQueryRepository;
public class ProbeDashboard {
  public static void main(String[] args) throws Exception {
    AppProperties.Alwaysdata db = new AppProperties.Alwaysdata(
      System.getenv("ALWAYSDATA_DB_URL"),
      System.getenv("ALWAYSDATA_DB_USER"),
      System.getenv("ALWAYSDATA_DB_PASSWORD"),
      null,null,null,null,null,null,null,null,null
    );
    AppProperties props = new AppProperties(db, null);
    var repo = new MyPageDashboardRepository(
      props,
      new BookingQueryRepository(),
      new MyPageProfileQueryService(),
      new MyPageMembershipQueryService(),
      new MyPageStatsQueryService(),
      new MyPageSupportQueryService(),
      new MyPageCompanionQueryService(),
      new MyPageTravelEventQueryService(),
      new MyPageItineraryService()
    );
    var snap = repo.load("test");
    System.out.println("linked=" + snap.linkedCompanions().size());
    for (var c : snap.linkedCompanions()) {
      System.out.println(c.id()+"|"+c.name()+"|"+c.avatarUrl());
    }
  }
}
