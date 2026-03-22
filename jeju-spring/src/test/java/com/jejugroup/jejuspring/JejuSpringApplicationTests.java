package com.jejugroup.jejuspring;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.jejugroup.jejuspring.auth.model.SessionUser;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrlPattern;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@SpringBootTest
class JejuSpringApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void contextLoads() {
	}

	@Test
	void landingPageLoadsAtRoot() throws Exception {
		mockMvc.perform(get("/"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("제주 그룹 - 모든 여행을 제주그룹 하나로")))
			.andExpect(content().string(containsString("모든 여행의 시작과 끝, 제주그룹이 함께합니다.")));
	}

	@Test
	void migrationDashboardLoads() throws Exception {
		mockMvc.perform(get("/migration"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("jeju-spring migration hub")))
			.andExpect(content().string(containsString("jeju-web .env reuse")));
	}

	@Test
	void readinessEndpointLoads() throws Exception {
		mockMvc.perform(get("/migration/readiness"))
			.andExpect(status().isOk())
			.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
			.andExpect(content().string(containsString("\"healthPath\":\"/actuator/health\"")))
			.andExpect(content().string(containsString("\"sharedEnvPath\":\"../jeju-web/.env\"")));
	}

	@Test
	void authLoginPageLoads() throws Exception {
		mockMvc.perform(get("/auth/login"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("로그인 페이지를 Thymeleaf로 옮겼다")))
			.andExpect(content().string(containsString("JejuGroup account")));
	}

	@Test
	void authSignupPageLoads() throws Exception {
		mockMvc.perform(get("/auth/signup"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("회원가입 페이지도 Thymeleaf로 옮긴다")))
			.andExpect(content().string(containsString("일반 회원가입")));
	}

	@Test
	void authPassPageLoads() throws Exception {
		mockMvc.perform(get("/auth/pass"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("PASS")))
			.andExpect(content().string(containsString("이용 중인 통신사를 선택해 주세요")));
	}

	@Test
	void authVerifyEndpointLoads() throws Exception {
		mockMvc.perform(get("/api/auth/verify"))
			.andExpect(status().isOk())
			.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
			.andExpect(content().string(containsString("\"success\":true")))
			.andExpect(content().string(containsString("\"siteKey\":")));
	}

	@Test
	void myPageRedirectsWhenSessionMissing() throws Exception {
		mockMvc.perform(get("/mypage/dashboard"))
			.andExpect(status().is3xxRedirection())
			.andExpect(redirectedUrlPattern("/auth/login**"));
	}

	@Test
	void myPageLoadsWhenSessionExists() throws Exception {
		mockMvc.perform(get("/mypage/dashboard").sessionAttr("user", new SessionUser("minji", "홍민지", "USER")))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("통합 예약 관리")))
			.andExpect(content().string(containsString("홍민지")));
	}

	@Test
	void travelActivitiesPageLoads() throws Exception {
		mockMvc.perform(get("/travel/activities"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("추천 액티비티")))
			.andExpect(content().string(containsString("제주항공 탑승객 인증")));
	}

	@Test
	void travelEsimPageLoads() throws Exception {
		mockMvc.perform(get("/travel/esim"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("언제 어디서나")))
			.andExpect(content().string(containsString("인기 있는 여행지")));
	}

	@Test
	void travelGuidePageLoads() throws Exception {
		mockMvc.perform(get("/travel/guide"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("나만의 특별한 여행 가이드")))
			.andExpect(content().string(containsString("미슐랭 가이드 추천")));
	}

	@Test
	void travelTipsPageLoads() throws Exception {
		mockMvc.perform(get("/travel/tips"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("Global Travel Tips")))
			.andExpect(content().string(containsString("Tokyo, Japan")));
	}

	@Test
	void stayHotelListPageLoads() throws Exception {
		mockMvc.perform(get("/stay/hotel-list"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("히로시마 프리미엄 호텔")))
			.andExpect(content().string(containsString("지도에서 히로시마 호텔 보기")))
			.andExpect(content().string(containsString("hotel-list-page-data")));
	}

	@Test
	void stayHotelListApiLoads() throws Exception {
		mockMvc.perform(get("/api/stay/hotel-list").param("region", "jeju").param("filter", "resort").param("filter", "rating-8"))
			.andExpect(status().isOk())
			.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
			.andExpect(content().string(containsString("\"region\":\"jeju\"")))
			.andExpect(content().string(containsString("\"checked\":true")));
	}

	@Test
	void dealsMainPageLoads() throws Exception {
		mockMvc.perform(get("/deals"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("전 세계 여행을 더 가볍게")))
			.andExpect(content().string(containsString("지금 바로 사용 가능한 쿠폰")));
	}

	@Test
	void dealsMemberPageLoads() throws Exception {
		mockMvc.perform(get("/deals/member"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("JEJU UNIVERSE")))
			.andExpect(content().string(containsString("회원 등급별 특별 혜택")));
	}

	@Test
	void dealsPartnerPageLoads() throws Exception {
		mockMvc.perform(get("/deals/partner"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("Partnership Benefits")))
			.andExpect(content().string(containsString("HYUNDAI CARD")));
	}

}
