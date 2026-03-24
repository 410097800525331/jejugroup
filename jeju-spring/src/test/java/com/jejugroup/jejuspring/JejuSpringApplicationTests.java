package com.jejugroup.jejuspring;

import java.sql.Connection;
import java.sql.Date;
import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;

import com.jejugroup.jejuspring.auth.model.SessionUser;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrlPattern;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@SpringBootTest
class JejuSpringApplicationTests extends IntegrationTestDatabaseProperties {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private Environment environment;

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
			.andExpect(content().string(containsString("English")))
			.andExpect(content().string(containsString("Scroll Down")));
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
            .andExpect(content().string(containsString("\"sharedEnvPath\":\"./.env\"")));
	}

	@Test
	void authLoginPageLoads() throws Exception {
		mockMvc.perform(get("/auth/login"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("First Manual Migration Slice")))
			.andExpect(content().string(containsString("JejuGroup account")));
	}

	@Test
	void authSignupPageLoads() throws Exception {
		mockMvc.perform(get("/auth/signup"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("Second Manual Migration Slice")))
			.andExpect(content().string(containsString("Create Account")));
	}

	@Test
	void authPassPageLoads() throws Exception {
		mockMvc.perform(get("/auth/pass"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("PASS")))
			.andExpect(content().string(containsString("Third Manual Migration Slice")));
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
	void myPageLoadsWhenSessionUserAlsoExistsInDb() throws Exception {
		seedUser("minji", "?띾?吏DB", "minji.db@jejugroup.example");

		mockMvc.perform(get("/mypage/dashboard").sessionAttr("user", new SessionUser("minji", "", "USER")))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("?띾?吏DB")))
			.andExpect(content().string(containsString("minji.db@jejugroup.example")));
	}

	private void seedUser(String userId, String name, String email) {
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
			"010-0000-0000",
			email,
			Date.valueOf(LocalDate.of(1990, 1, 1)),
			"M",
			"PASS",
			"USER"
		);
	}

	@Test
	void travelActivitiesPageLoads() throws Exception {
		mockMvc.perform(get("/travel/activities"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("JEJU STAY Activities")))
			.andExpect(content().string(containsString("Curated Picks")));
	}

	@Test
	void travelEsimPageLoads() throws Exception {
		mockMvc.perform(get("/travel/esim"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("JEJU STAY eSIM")))
			.andExpect(content().string(containsString("Popular Destinations")));
	}

	@Test
	void travelGuidePageLoads() throws Exception {
		mockMvc.perform(get("/travel/guide"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("Travel Guide")))
			.andExpect(content().string(containsString("Explore Countries")));
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
			.andExpect(content().string(containsString("hotel-list-page-data")))
			.andExpect(content().string(containsString("migration hub")));
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
			.andExpect(content().string(containsString("ONLY JEJU GROUP")))
			.andExpect(content().string(containsString("migration hub")));
	}

	@Test
	void dealsMemberPageLoads() throws Exception {
		mockMvc.perform(get("/deals/member"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("JEJU UNIVERSE")))
			.andExpect(content().string(containsString("Private Member Sale")));
	}

	@Test
	void dealsPartnerPageLoads() throws Exception {
		mockMvc.perform(get("/deals/partner"))
			.andExpect(status().isOk())
			.andExpect(content().string(containsString("Partnership Benefits")))
			.andExpect(content().string(containsString("HYUNDAI CARD")));
	}

}
