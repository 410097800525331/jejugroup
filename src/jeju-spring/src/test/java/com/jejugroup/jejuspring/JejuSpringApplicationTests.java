package com.jejugroup.jejuspring;

import java.sql.Connection;
import java.sql.Date;
import java.time.LocalDate;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;

import com.jejugroup.jejuspring.auth.model.SessionUser;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrlPattern;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@SpringBootTest
class JejuSpringApplicationTests extends IntegrationTestDatabaseProperties {
	private static final String MYPAGE_PROFILE_OWNER_ID = "mypage-profile-owner";
	private static final String MYPAGE_PROFILE_OWNER_NAME = "Mypage Original";
	private static final String MYPAGE_PROFILE_OWNER_EMAIL = "mypage.original@example.com";
	private static final String MYPAGE_PROFILE_OWNER_PHONE = "010-1010-1010";
	private static final String MYPAGE_PROFILE_CONFLICT_ID = "mypage-profile-conflict";
	private static final String MYPAGE_PROFILE_CONFLICT_NAME = "Mypage Conflict";
	private static final String MYPAGE_PROFILE_CONFLICT_EMAIL = "mypage.conflict@example.com";
	private static final String MYPAGE_PROFILE_CONFLICT_PHONE = "010-2020-2020";

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private Environment environment;

	@AfterEach
	void cleanupMypageFixtures() {
		jdbcTemplate.update(
			"DELETE FROM user_profiles WHERE user_id IN (?, ?, ?)",
			MYPAGE_PROFILE_OWNER_ID,
			MYPAGE_PROFILE_CONFLICT_ID,
			"minji"
		);
		jdbcTemplate.update(
			"DELETE FROM users WHERE id IN (?, ?, ?)",
			MYPAGE_PROFILE_OWNER_ID,
			MYPAGE_PROFILE_CONFLICT_ID,
			"minji"
		);
	}

	@Test
	void contextLoads() {
	}

	@Test
	void resolvedSpringTestDatabaseUrlsStayOffAlwaysdata() throws Exception {
		String datasourceUrl = environment.getProperty("spring.datasource.url");
		String flywayUrl = environment.getProperty("spring.flyway.url");

		org.assertj.core.api.Assertions.assertThat(datasourceUrl).isNotBlank();
		org.assertj.core.api.Assertions.assertThat(flywayUrl).isNotBlank();
		org.assertj.core.api.Assertions.assertThat(datasourceUrl).doesNotContain("alwaysdata");
		org.assertj.core.api.Assertions.assertThat(flywayUrl).doesNotContain("alwaysdata");
		org.assertj.core.api.Assertions.assertThat(flywayUrl).isEqualTo(datasourceUrl);

		try (Connection connection = jdbcTemplate.getDataSource().getConnection()) {
			String actualUrl = connection.getMetaData().getURL();
			org.assertj.core.api.Assertions.assertThat(actualUrl).isEqualTo(datasourceUrl);
			org.assertj.core.api.Assertions.assertThat(actualUrl).doesNotContain("alwaysdata");
		}
	}

	@Test
	void landingPageLoadsAtRoot() throws Exception {
		mockMvc.perform(get("/"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("landing-root")))
			.andExpect(content().string(containsString("Scroll Down")));
	}

	@Test
	void migrationDashboardLoads() throws Exception {
		mockMvc.perform(get("/migration"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("jeju-spring migration hub")))
			.andExpect(content().string(containsString("jeju-web .env reuse")))
			.andExpect(content().string(containsString("Gemini key (legacy OpenAI fallback)")))
			.andExpect(content().string(containsString("GEMINI_API_KEY / OPENAI_API_KEY")));
	}

	@Test
	void readinessEndpointLoads() throws Exception {
        mockMvc.perform(get("/migration/readiness"))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(content().string(containsString("\"healthPath\":\"/actuator/health\"")))
            .andExpect(content().string(containsString("\"sharedEnvPath\":\"./.env\"")));
	}

	@Test
	void authLoginAliasRedirectsToFrontMirrorPage() throws Exception {
		mockMvc.perform(get("/auth/login"))
			.andExpect(status().is3xxRedirection())
			.andExpect(redirectedUrlPattern("/pages/auth/login.html?shell=main*"));
	}

	@Test
	void authLoginFrontMirrorPageLoads() throws Exception {
		mockMvc.perform(get("/pages/auth/login.html"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("로그인")))
			.andExpect(content().string(containsString("회원 전용 혜택을 받아보세요.")));
	}

	@Test
	void authSignupAliasRedirectsToFrontMirrorPage() throws Exception {
		mockMvc.perform(get("/auth/signup"))
			.andExpect(status().is3xxRedirection())
			.andExpect(redirectedUrlPattern("/pages/auth/signup.html?shell=main*"));
	}

	@Test
	void authSignupFrontMirrorPageLoads() throws Exception {
		mockMvc.perform(get("/pages/auth/signup.html"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("회원가입 | 제주그룹")))
			.andExpect(content().string(containsString("jeju-signup-app")));
	}

	@Test
	void authPassAliasRedirectsToFrontMirrorPage() throws Exception {
		mockMvc.perform(get("/auth/pass"))
			.andExpect(status().is3xxRedirection())
			.andExpect(redirectedUrlPattern("/pages/auth/pass_auth.html?shell=main*"));
	}

	@Test
	void authPassFrontMirrorPageLoads() throws Exception {
		mockMvc.perform(get("/pages/auth/pass_auth.html"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("PASS")))
			.andExpect(content().string(containsString("jeju-pass-auth-app")));
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
	void mypageDashboardAliasRedirectsToCanonicalPage() throws Exception {
		mockMvc.perform(get("/mypage/dashboard").param("shell", "stay").param("filter", "rent"))
			.andExpect(status().is3xxRedirection())
			.andExpect(redirectedUrlPattern("/pages/mypage/dashboard.html?shell=stay&filter=rent*"));
	}

	@Test
	void mypageDashboardCanonicalPageLoadsAsFrontMirror() throws Exception {
		mockMvc.perform(get("/pages/mypage/dashboard.html"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("mypage-dashboard-root")))
			.andExpect(content().string(containsString("jeju-page-shell-header")))
			.andExpect(content().string(containsString("jeju-page-shell-footer")));
	}

	@Test
	void mypageDashboardApiKeepsAuthenticatedBehavior() throws Exception {
		seedUser("minji", "?띾?吏DB", "minji.db@jejugroup.example");

		mockMvc.perform(get("/api/mypage/dashboard").sessionAttr("user", new SessionUser("minji", "", "", "", "USER")))
			.andExpect(status().isOk())
			.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
			.andExpect(content().string(containsString("\"success\":true")))
			.andExpect(content().string(containsString("minji.db@jejugroup.example")));
	}

	@Test
	void mypageProfileUpdateRequiresAuthentication() throws Exception {
		mockMvc.perform(put("/api/mypage/profile")
				.contentType(MediaType.APPLICATION_JSON)
				.content(profileUpdateJson("New Name", "new@example.com", "010-3030-3030")))
			.andExpect(status().isUnauthorized());
	}

	@Test
	void mypageProfileUpdatePersistsFieldsAndDashboardRefreshReadsSavedValues() throws Exception {
		seedUser(MYPAGE_PROFILE_OWNER_ID, MYPAGE_PROFILE_OWNER_NAME, MYPAGE_PROFILE_OWNER_EMAIL, MYPAGE_PROFILE_OWNER_PHONE);

		mockMvc.perform(put("/api/mypage/profile")
				.sessionAttr("user", new SessionUser(MYPAGE_PROFILE_OWNER_ID, MYPAGE_PROFILE_OWNER_NAME, "", "", "USER"))
				.contentType(MediaType.APPLICATION_JSON)
				.content(profileUpdateJson("Mypage Saved", "mypage.saved@example.com", "010-4040-4040")))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.success").value(true))
			.andExpect(jsonPath("$.message").value("프로필이 저장되었습니다."));

		assertThat(jdbcTemplate.queryForObject(
			"SELECT name FROM users WHERE id = ?",
			String.class,
			MYPAGE_PROFILE_OWNER_ID
		)).isEqualTo("Mypage Saved");
		assertThat(jdbcTemplate.queryForObject(
			"SELECT email FROM users WHERE id = ?",
			String.class,
			MYPAGE_PROFILE_OWNER_ID
		)).isEqualTo("mypage.saved@example.com");
		assertThat(jdbcTemplate.queryForObject(
			"SELECT phone FROM users WHERE id = ?",
			String.class,
			MYPAGE_PROFILE_OWNER_ID
		)).isEqualTo("010-4040-4040");
		assertThat(jdbcTemplate.queryForObject(
			"SELECT display_name FROM user_profiles WHERE user_id = ?",
			String.class,
			MYPAGE_PROFILE_OWNER_ID
		)).isEqualTo("Mypage Saved");

		mockMvc.perform(get("/api/mypage/dashboard")
				.sessionAttr("user", new SessionUser(MYPAGE_PROFILE_OWNER_ID, MYPAGE_PROFILE_OWNER_NAME, "", "", "USER")))
			.andExpect(status().isOk())
			.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
			.andExpect(jsonPath("$.success").value(true))
			.andExpect(jsonPath("$.dashboard.profile.name").value("Mypage Saved"))
			.andExpect(jsonPath("$.dashboard.profile.email").value("mypage.saved@example.com"))
			.andExpect(jsonPath("$.dashboard.profile.phone").value("010-4040-4040"));
	}

	@Test
	void mypageProfileUpdateRejectsValidationFailures() throws Exception {
		seedUser(MYPAGE_PROFILE_OWNER_ID, MYPAGE_PROFILE_OWNER_NAME, MYPAGE_PROFILE_OWNER_EMAIL, MYPAGE_PROFILE_OWNER_PHONE);

		mockMvc.perform(put("/api/mypage/profile")
				.sessionAttr("user", new SessionUser(MYPAGE_PROFILE_OWNER_ID, MYPAGE_PROFILE_OWNER_NAME, "", "", "USER"))
				.contentType(MediaType.APPLICATION_JSON)
				.content(profileUpdateJson("   ", "not-an-email", "010-5050-5050")))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.success").value(false));
	}

	@Test
	void mypageProfileUpdateRejectsDuplicateEmailAndPhoneConflicts() throws Exception {
		seedUser(MYPAGE_PROFILE_OWNER_ID, MYPAGE_PROFILE_OWNER_NAME, MYPAGE_PROFILE_OWNER_EMAIL, MYPAGE_PROFILE_OWNER_PHONE);
		seedUser(MYPAGE_PROFILE_CONFLICT_ID, MYPAGE_PROFILE_CONFLICT_NAME, MYPAGE_PROFILE_CONFLICT_EMAIL, MYPAGE_PROFILE_CONFLICT_PHONE);

		mockMvc.perform(put("/api/mypage/profile")
				.sessionAttr("user", new SessionUser(MYPAGE_PROFILE_OWNER_ID, MYPAGE_PROFILE_OWNER_NAME, "", "", "USER"))
				.contentType(MediaType.APPLICATION_JSON)
				.content(profileUpdateJson("Mypage Saved", MYPAGE_PROFILE_CONFLICT_EMAIL, "010-6060-6060")))
			.andExpect(status().isConflict())
			.andExpect(jsonPath("$.success").value(false))
			.andExpect(jsonPath("$.message").value("이미 사용 중인 이메일 또는 전화번호입니다."));

		mockMvc.perform(put("/api/mypage/profile")
				.sessionAttr("user", new SessionUser(MYPAGE_PROFILE_OWNER_ID, MYPAGE_PROFILE_OWNER_NAME, "", "", "USER"))
				.contentType(MediaType.APPLICATION_JSON)
				.content(profileUpdateJson("Mypage Saved", "mypage.saved2@example.com", MYPAGE_PROFILE_CONFLICT_PHONE)))
			.andExpect(status().isConflict())
			.andExpect(jsonPath("$.success").value(false))
			.andExpect(jsonPath("$.message").value("이미 사용 중인 이메일 또는 전화번호입니다."));
	}

	private void seedUser(String userId, String name, String email) {
		seedUser(userId, name, email, "010-0000-0000");
	}

	private void seedUser(String userId, String name, String email, String phone) {
		jdbcTemplate.update(
			"""
			INSERT INTO users (id, pw, name, phone, email, birth_date, gender, provider, role)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
			ON DUPLICATE KEY UPDATE
				pw = VALUES(pw),
				name = VALUES(name),
				phone = VALUES(phone),
				email = VALUES(email),
				birth_date = VALUES(birth_date),
				gender = VALUES(gender),
				provider = VALUES(provider),
				role = VALUES(role)
			""",
			userId,
			"encoded-password",
			name,
			phone,
			email,
			Date.valueOf(LocalDate.of(1990, 1, 1)),
			"M",
			"PASS",
			"USER"
		);

		jdbcTemplate.update(
			"""
			INSERT INTO user_profiles (user_id, display_name)
			VALUES (?, ?)
			ON DUPLICATE KEY UPDATE
				display_name = VALUES(display_name)
			""",
			userId,
			name
		);
	}

	private String profileUpdateJson(String name, String email, String phone) {
		return """
			{
			  "name": "%s",
			  "email": "%s",
			  "phone": "%s"
			}
			""".formatted(name, email, phone);
	}

	@Test
	void travelActivitiesShortRouteRedirectsToCanonicalPage() throws Exception {
		mockMvc.perform(get("/travel/activities"))
			.andExpect(status().is3xxRedirection())
			.andExpect(redirectedUrl("/jejustay/pages/travel/activities.html"));
	}

	@Test
	void travelActivitiesCanonicalPageLoads() throws Exception {
		mockMvc.perform(get("/jejustay/pages/travel/activities.html"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("activities-page")))
			.andExpect(content().string(containsString("activity-grid")));
	}

	@Test
	void travelEsimShortRouteRedirectsToCanonicalPage() throws Exception {
		mockMvc.perform(get("/travel/esim"))
			.andExpect(status().is3xxRedirection())
			.andExpect(redirectedUrl("/jejustay/pages/travel/esim.html"));
	}

	@Test
	void travelEsimCanonicalPageLoads() throws Exception {
		mockMvc.perform(get("/jejustay/pages/travel/esim.html"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("eSIM |")))
			.andExpect(content().string(containsString("country-grid")));
	}

	@Test
	void travelGuideShortRouteRedirectsToCanonicalPage() throws Exception {
		mockMvc.perform(get("/travel/guide"))
			.andExpect(status().is3xxRedirection())
			.andExpect(redirectedUrl("/jejustay/pages/travel/travel_guide.html"));
	}

	@Test
	void travelGuideCanonicalPageLoads() throws Exception {
		mockMvc.perform(get("/jejustay/pages/travel/travel_guide.html"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("guide-hero")))
			.andExpect(content().string(containsString("guide-search-wrapper")));
	}

	@Test
	void travelTipsShortRouteRedirectsToCanonicalPage() throws Exception {
		mockMvc.perform(get("/travel/tips"))
			.andExpect(status().is3xxRedirection())
			.andExpect(redirectedUrl("/jejustay/pages/travel/travel_tips.html"));
	}

	@Test
	void travelTipsCanonicalPageLoads() throws Exception {
		mockMvc.perform(get("/jejustay/pages/travel/travel_tips.html"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("travel-tips-page")))
			.andExpect(content().string(containsString("city-selector")));
	}

	@Test
	void stayHotelListShortRouteRedirectsToCanonicalPage() throws Exception {
		mockMvc.perform(get("/stay/hotel-list"))
			.andExpect(status().is3xxRedirection())
			.andExpect(redirectedUrl("/jejustay/pages/hotel/hotel-list.html"));
	}

	@Test
	void stayHotelListCanonicalPageLoads() throws Exception {
		mockMvc.perform(get("/jejustay/pages/hotel/hotel-list.html"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("stay-hotel-list-page")))
			.andExpect(content().string(containsString("hotel-list-page-root")));
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
	void dealsMainShortRouteRedirectsToCanonicalPage() throws Exception {
		mockMvc.perform(get("/deals"))
			.andExpect(status().is3xxRedirection())
			.andExpect(redirectedUrl("/jejustay/pages/deals/deals.html"));
	}

	@Test
	void dealsMainCanonicalPageLoads() throws Exception {
		mockMvc.perform(get("/jejustay/pages/deals/deals.html"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("deals-page")))
			.andExpect(content().string(containsString("dealSection")));
	}

	@Test
	void dealsMemberShortRouteRedirectsToCanonicalPage() throws Exception {
		mockMvc.perform(get("/deals/member"))
			.andExpect(status().is3xxRedirection())
			.andExpect(redirectedUrl("/jejustay/pages/deals/deals_member.html"));
	}

	@Test
	void dealsMemberCanonicalPageLoads() throws Exception {
		mockMvc.perform(get("/jejustay/pages/deals/deals_member.html"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("deals-member-page")))
			.andExpect(content().string(containsString("tier-section")));
	}

	@Test
	void dealsPartnerShortRouteRedirectsToCanonicalPage() throws Exception {
		mockMvc.perform(get("/deals/partner"))
			.andExpect(status().is3xxRedirection())
			.andExpect(redirectedUrl("/jejustay/pages/deals/deals_partner.html"));
	}

	@Test
	void dealsPartnerCanonicalPageLoads() throws Exception {
		mockMvc.perform(get("/jejustay/pages/deals/deals_partner.html"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("deals-partner-page")))
			.andExpect(content().string(containsString("partner-grid")));
	}

}
