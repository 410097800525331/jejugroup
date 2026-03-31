package com.jejugroup.jejuspring.booking;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Date;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.jayway.jsonpath.JsonPath;
import com.jejugroup.jejuspring.IntegrationTestDatabaseProperties;
import com.jejugroup.jejuspring.auth.model.SessionUser;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class BookingApiControllerIntegrationTests extends IntegrationTestDatabaseProperties {
    private static final String MEMBER_USER_ID = "booking-member-test";
    private static final String MEMBER_USER_NAME = "Booking Member";
    private static final String MEMBER_USER_EMAIL = "booking.member@example.com";
    private static final String MEMBER_USER_PHONE = "010-1111-1111";
    private static final String OTHER_MEMBER_USER_ID = "booking-member-other";
    private static final String OTHER_MEMBER_USER_NAME = "Booking Member Other";
    private static final String OTHER_MEMBER_USER_EMAIL = "booking.member.other@example.com";
    private static final String OTHER_MEMBER_USER_PHONE = "010-2222-2222";
    private static final String MEMBER_DESTINATION = "Booking Test Destination Member";
    private static final String GUEST_DESTINATION = "Booking Test Destination Guest";
    private static final String STAY_DESTINATION = "Booking Test Destination Stay";
    private static final String LEGACY_DESTINATION = "Booking Test Destination Legacy";
    private static final LocalDate TRAVEL_DATE = LocalDate.of(2026, 4, 18);
    private static final LocalDate CHECK_IN_DATE = LocalDate.of(2026, 5, 10);
    private static final LocalDate CHECK_OUT_DATE = LocalDate.of(2026, 5, 12);

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @DynamicPropertySource
    static void registerBookingDatabaseProperties(DynamicPropertyRegistry registry) {
        String dbUrl = firstNonBlank(
            System.getenv("JEJU_SPRING_TEST_DB_URL"),
            System.getenv("DB_URL"),
            localEnv("DB_URL"),
            "jdbc:mysql://localhost:3306/jejugroup_db?characterEncoding=UTF-8&serverTimezone=Asia/Seoul&useSSL=false&allowPublicKeyRetrieval=true"
        );
        String dbUser = firstNonBlank(
            System.getenv("JEJU_SPRING_TEST_DB_USER"),
            System.getenv("DB_USER"),
            localEnv("DB_USER"),
            "jejugroup"
        );
        String dbPassword = firstNonBlank(
            System.getenv("JEJU_SPRING_TEST_DB_PASSWORD"),
            System.getenv("DB_PASSWORD"),
            localEnv("DB_PASSWORD"),
            ""
        );

        registry.add("app.database.db-url", () -> dbUrl);
        registry.add("app.database.db-user", () -> dbUser);
        registry.add("app.database.db-password", () -> dbPassword);
    }

    @AfterEach
    void cleanup() {
        jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS=0");
        try {
            jdbcTemplate.update(
                """
                DELETE bp
                FROM booking_passengers bp
                INNER JOIN bookings b ON b.id = bp.booking_id
                WHERE b.destination IN (?, ?, ?, ?)
                """,
                MEMBER_DESTINATION,
                GUEST_DESTINATION,
                STAY_DESTINATION,
                LEGACY_DESTINATION
            );
            jdbcTemplate.update(
                """
                DELETE pt
                FROM payment_transactions pt
                INNER JOIN payment_attempts pa ON pa.id = pt.payment_attempt_id
                INNER JOIN bookings b ON b.id = pa.booking_id
                WHERE b.destination IN (?, ?, ?, ?)
                """,
                MEMBER_DESTINATION,
                GUEST_DESTINATION,
                STAY_DESTINATION,
                LEGACY_DESTINATION
            );
            jdbcTemplate.update(
                """
                DELETE pa
                FROM payment_attempts pa
                INNER JOIN bookings b ON b.id = pa.booking_id
                WHERE b.destination IN (?, ?, ?, ?)
                """,
                MEMBER_DESTINATION,
                GUEST_DESTINATION,
                STAY_DESTINATION,
                LEGACY_DESTINATION
            );
            jdbcTemplate.update(
                """
                DELETE bi
                FROM booking_items bi
                INNER JOIN bookings b ON b.id = bi.booking_id
                WHERE b.destination IN (?, ?, ?, ?)
                """,
                MEMBER_DESTINATION,
                GUEST_DESTINATION,
                STAY_DESTINATION,
                LEGACY_DESTINATION
            );
            jdbcTemplate.update("DELETE FROM bookings WHERE destination IN (?, ?, ?, ?)", MEMBER_DESTINATION, GUEST_DESTINATION, STAY_DESTINATION, LEGACY_DESTINATION);
            jdbcTemplate.update("DELETE FROM user_profiles WHERE user_id = ?", MEMBER_USER_ID);
            jdbcTemplate.update("DELETE FROM users WHERE id = ?", MEMBER_USER_ID);
            jdbcTemplate.update("DELETE FROM user_profiles WHERE user_id = ?", OTHER_MEMBER_USER_ID);
            jdbcTemplate.update("DELETE FROM users WHERE id = ?", OTHER_MEMBER_USER_ID);
        } finally {
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS=1");
        }
    }

    @Test
    void memberCheckoutPersistsBookingTreeAndShowsUpInBookingReads() throws Exception {
        seedMemberUser();

        MvcResult checkoutResult = mockMvc.perform(post("/api/booking/checkout")
                .sessionAttr("user", new SessionUser(MEMBER_USER_ID, MEMBER_USER_NAME, "", "", "USER"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(newCheckoutJson(
                    MEMBER_DESTINATION,
                    TRAVEL_DATE,
                    129000,
                    110000,
                    19000,
                    true,
                    "Kim",
                    "Minji",
                    "Kim",
                    "Minji",
                    "card",
                    "toss",
                    null,
                    null,
                    null,
                    null,
                    null
                )))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.destination").value(MEMBER_DESTINATION))
            .andExpect(jsonPath("$.data.amount").value(129000))
            .andExpect(jsonPath("$.data.memberBooking").value(true))
            .andExpect(jsonPath("$.data.travelDate").value(TRAVEL_DATE.toString()))
            .andExpect(jsonPath("$.data.lastName").value("Kim"))
            .andExpect(jsonPath("$.data.firstName").value("Minji"))
            .andExpect(jsonPath("$.data.email").value(MEMBER_USER_EMAIL))
            .andReturn();

        String bookingNo = JsonPath.read(checkoutResult.getResponse().getContentAsString(), "$.data.bookingNo");
        String reservationNo = JsonPath.read(checkoutResult.getResponse().getContentAsString(), "$.data.reservationNo");
        assertThat(bookingNo).matches("^JA\\d{8}$");
        assertThat(reservationNo).isEqualTo(bookingNo);

        assertThat(jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM bookings WHERE booking_no = ? AND destination = ? AND user_id = ?",
            Long.class,
            bookingNo,
            MEMBER_DESTINATION,
            MEMBER_USER_ID
        )).isEqualTo(1L);
        assertThat(jdbcTemplate.queryForObject(
            "SELECT booking_type FROM bookings WHERE booking_no = ?",
            String.class,
            bookingNo
        )).isEqualTo("air");
        assertThat(jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM booking_items bi INNER JOIN bookings b ON b.id = bi.booking_id WHERE b.booking_no = ?",
            Long.class,
            bookingNo
        )).isEqualTo(1L);
        assertThat(jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM booking_passengers bp INNER JOIN bookings b ON b.id = bp.booking_id WHERE b.booking_no = ?",
            Long.class,
            bookingNo
        )).isEqualTo(1L);
        assertThat(jdbcTemplate.queryForObject(
            "SELECT email FROM booking_passengers bp INNER JOIN bookings b ON b.id = bp.booking_id WHERE b.booking_no = ? AND bp.is_primary = 1",
            String.class,
            bookingNo
        )).isEqualTo(MEMBER_USER_EMAIL);
        assertThat(jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM payment_attempts pa INNER JOIN bookings b ON b.id = pa.booking_id WHERE b.booking_no = ?",
            Long.class,
            bookingNo
        )).isEqualTo(1L);
        assertThat(jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM payment_transactions pt INNER JOIN payment_attempts pa ON pa.id = pt.payment_attempt_id INNER JOIN bookings b ON b.id = pa.booking_id WHERE b.booking_no = ?",
            Long.class,
            bookingNo
        )).isEqualTo(1L);

        mockMvc.perform(get("/api/booking/me")
                .sessionAttr("user", new SessionUser(MEMBER_USER_ID, MEMBER_USER_NAME, "", "", "USER")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.bookings[0].bookingNo").value(bookingNo))
            .andExpect(jsonPath("$.data.bookings[0].bookingType").value("air"));

        mockMvc.perform(get("/api/mypage/dashboard")
                .sessionAttr("user", new SessionUser(MEMBER_USER_ID, MEMBER_USER_NAME, "", "", "USER")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.dashboard.bookings[0].title").value(MEMBER_DESTINATION + " 항공권"))
            .andExpect(jsonPath("$.dashboard.bookings[0].amount").exists());
    }

    @Test
    void memberCanCancelOwnBookingAndMypageReadsReflectCancelledState() throws Exception {
        seedMemberUser();

        MvcResult checkoutResult = mockMvc.perform(post("/api/booking/checkout")
                .sessionAttr("user", new SessionUser(MEMBER_USER_ID, MEMBER_USER_NAME, "", "", "USER"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(newCheckoutJson(
                    MEMBER_DESTINATION,
                    TRAVEL_DATE,
                    129000,
                    110000,
                    19000,
                    true,
                    "Kim",
                    "Minji",
                    "Kim",
                    "Minji",
                    "card",
                    "toss",
                    null,
                    null,
                    null,
                    null,
                    null
                )))
            .andExpect(status().isOk())
            .andReturn();

        String bookingNo = JsonPath.read(checkoutResult.getResponse().getContentAsString(), "$.data.bookingNo");

        mockMvc.perform(post("/api/booking/{bookingNo}/cancel", bookingNo)
                .sessionAttr("user", new SessionUser(MEMBER_USER_ID, MEMBER_USER_NAME, "", "", "USER")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.message").value("예약이 취소되었습니다."))
            .andExpect(jsonPath("$.data.bookingNo").value(bookingNo))
            .andExpect(jsonPath("$.data.status").value("cancelled"))
            .andExpect(jsonPath("$.data.cancelledAt").exists());

        assertThat(jdbcTemplate.queryForObject(
            "SELECT status FROM bookings WHERE booking_no = ?",
            String.class,
            bookingNo
        )).isEqualTo("cancelled");
        assertThat(jdbcTemplate.queryForObject(
            "SELECT payment_status FROM bookings WHERE booking_no = ?",
            String.class,
            bookingNo
        )).isEqualTo("cancelled");
        assertThat(jdbcTemplate.queryForObject(
            "SELECT cancelled_at IS NOT NULL FROM bookings WHERE booking_no = ?",
            Boolean.class,
            bookingNo
        )).isTrue();

        mockMvc.perform(get("/api/booking/me")
                .sessionAttr("user", new SessionUser(MEMBER_USER_ID, MEMBER_USER_NAME, "", "", "USER")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.bookings[0].bookingNo").value(bookingNo))
            .andExpect(jsonPath("$.data.bookings[0].status").value("cancelled"))
            .andExpect(jsonPath("$.data.bookings[0].cancelledAt").exists());
    }

    @Test
    void memberCannotCancelAnotherMembersBooking() throws Exception {
        seedMemberUser();
        seedOtherMemberUser();

        MvcResult checkoutResult = mockMvc.perform(post("/api/booking/checkout")
                .sessionAttr("user", new SessionUser(OTHER_MEMBER_USER_ID, OTHER_MEMBER_USER_NAME, "", "", "USER"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(newCheckoutJson(
                    MEMBER_DESTINATION,
                    TRAVEL_DATE,
                    129000,
                    110000,
                    19000,
                    true,
                    "Han",
                    "Jisoo",
                    "Han",
                    "Jisoo",
                    "card",
                    "toss",
                    null,
                    null,
                    null,
                    null,
                    null
                )))
            .andExpect(status().isOk())
            .andReturn();

        String bookingNo = JsonPath.read(checkoutResult.getResponse().getContentAsString(), "$.data.bookingNo");

        mockMvc.perform(post("/api/booking/{bookingNo}/cancel", bookingNo)
                .sessionAttr("user", new SessionUser(MEMBER_USER_ID, MEMBER_USER_NAME, "", "", "USER")))
            .andExpect(status().isForbidden())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("권한이 없습니다."));

        assertThat(jdbcTemplate.queryForObject(
            "SELECT status FROM bookings WHERE booking_no = ?",
            String.class,
            bookingNo
        )).isEqualTo("confirmed");
        assertThat(jdbcTemplate.queryForObject(
            "SELECT payment_status FROM bookings WHERE booking_no = ?",
            String.class,
            bookingNo
        )).isEqualTo("paid");
        assertThat(jdbcTemplate.queryForObject(
            "SELECT cancelled_at IS NOT NULL FROM bookings WHERE booking_no = ?",
            Boolean.class,
            bookingNo
        )).isFalse();
    }

    @Test
    void alreadyCancelledBookingIsRejectedSafely() throws Exception {
        seedMemberUser();

        MvcResult checkoutResult = mockMvc.perform(post("/api/booking/checkout")
                .sessionAttr("user", new SessionUser(MEMBER_USER_ID, MEMBER_USER_NAME, "", "", "USER"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(newCheckoutJson(
                    MEMBER_DESTINATION,
                    TRAVEL_DATE,
                    129000,
                    110000,
                    19000,
                    true,
                    "Kim",
                    "Minji",
                    "Kim",
                    "Minji",
                    "card",
                    "toss",
                    null,
                    null,
                    null,
                    null,
                    null
                )))
            .andExpect(status().isOk())
            .andReturn();

        String bookingNo = JsonPath.read(checkoutResult.getResponse().getContentAsString(), "$.data.bookingNo");

        mockMvc.perform(post("/api/booking/{bookingNo}/cancel", bookingNo)
                .sessionAttr("user", new SessionUser(MEMBER_USER_ID, MEMBER_USER_NAME, "", "", "USER")))
            .andExpect(status().isOk());

        mockMvc.perform(post("/api/booking/{bookingNo}/cancel", bookingNo)
                .sessionAttr("user", new SessionUser(MEMBER_USER_ID, MEMBER_USER_NAME, "", "", "USER")))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("이미 취소된 예약입니다."));

        assertThat(jdbcTemplate.queryForObject(
            "SELECT status FROM bookings WHERE booking_no = ?",
            String.class,
            bookingNo
        )).isEqualTo("cancelled");
        assertThat(jdbcTemplate.queryForObject(
            "SELECT payment_status FROM bookings WHERE booking_no = ?",
            String.class,
            bookingNo
        )).isEqualTo("cancelled");
    }

    @Test
    void loggedInUserCanOptOutOfMemberBookingWhenRequestSaysFalse() throws Exception {
        seedMemberUser();

        MvcResult checkoutResult = mockMvc.perform(post("/api/booking/checkout")
                .sessionAttr("user", new SessionUser(MEMBER_USER_ID, MEMBER_USER_NAME, "", "", "USER"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(newCheckoutJson(
                    MEMBER_DESTINATION,
                    TRAVEL_DATE,
                    99000,
                    90000,
                    9000,
                    false,
                    "Kim",
                    "Minji",
                    "Kim",
                    "Minji",
                    "card",
                    "toss",
                    null,
                    null,
                    null,
                    null,
                    null
                )))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.memberBooking").value(false))
            .andReturn();

        String bookingNo = JsonPath.read(checkoutResult.getResponse().getContentAsString(), "$.data.bookingNo");
        assertThat(jdbcTemplate.queryForObject(
            "SELECT user_id FROM bookings WHERE booking_no = ?",
            String.class,
            bookingNo
        )).isNull();
    }

    @Test
    void guestLookupSupportsEmailAndLegacyFallback() throws Exception {
        MvcResult checkoutResult = mockMvc.perform(post("/api/booking/checkout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(newCheckoutJson(
                    GUEST_DESTINATION,
                    TRAVEL_DATE,
                    88000,
                    80000,
                    8000,
                    false,
                    "Lee",
                    "Jisoo",
                    "Lee",
                    "Jisoo",
                    "card",
                    "nicepay",
                    null,
                    null,
                    null,
                    null,
                    "guest.lookup@example.com"
                )))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.memberBooking").value(false))
            .andReturn();

        String bookingNo = JsonPath.read(checkoutResult.getResponse().getContentAsString(), "$.data.bookingNo");
        assertThat(bookingNo).matches("^JA\\d{8}$");

        assertThat(jdbcTemplate.queryForObject(
            "SELECT user_id FROM bookings WHERE booking_no = ?",
            String.class,
            bookingNo
        )).isNull();

        mockMvc.perform(post("/api/booking/guest-lookup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(guestLookupJson(bookingNo, "wrong@example.com")))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.success").value(false));

        mockMvc.perform(post("/api/booking/guest-lookup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(guestLookupJson(bookingNo, "guest.lookup@example.com")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.bookingNo").value(bookingNo))
            .andExpect(jsonPath("$.data.destination").value(GUEST_DESTINATION))
            .andExpect(jsonPath("$.data.amount").value(88000))
            .andExpect(jsonPath("$.data.memberBooking").value(false))
            .andExpect(jsonPath("$.data.travelDate").value(TRAVEL_DATE.toString()))
            .andExpect(jsonPath("$.data.lastName").value("Lee"))
            .andExpect(jsonPath("$.data.firstName").value("Jisoo"))
            .andExpect(jsonPath("$.data.email").value("guest.lookup@example.com"));

        mockMvc.perform(post("/api/booking/guest-lookup")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "reservationNo": "%s",
                      "travelDate": "%s",
                      "lastName": "Lee",
                      "firstName": "Jisoo"
                    }
                    """.formatted(bookingNo, TRAVEL_DATE)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void stayCheckoutPersistsStayBookingWithJSReservationNumber() throws Exception {
        MvcResult checkoutResult = mockMvc.perform(post("/api/booking/checkout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(newCheckoutJson(
                    STAY_DESTINATION,
                    CHECK_IN_DATE,
                    194700,
                    177000,
                    17700,
                    false,
                    "Hong",
                    "Gildong",
                    "Hong",
                    "Gildong",
                    "card",
                    "kcp",
                    "stay",
                    null,
                    CHECK_IN_DATE,
                    CHECK_OUT_DATE,
                    "stay.lookup@example.com"
                )))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.memberBooking").value(false))
            .andExpect(jsonPath("$.data.destination").value(STAY_DESTINATION))
            .andExpect(jsonPath("$.data.travelDate").value(CHECK_IN_DATE.toString()))
            .andExpect(jsonPath("$.data.email").value("stay.lookup@example.com"))
            .andReturn();

        String bookingNo = JsonPath.read(checkoutResult.getResponse().getContentAsString(), "$.data.bookingNo");
        String reservationNo = JsonPath.read(checkoutResult.getResponse().getContentAsString(), "$.data.reservationNo");
        assertThat(bookingNo).matches("^JS\\d{8}$");
        assertThat(reservationNo).isEqualTo(bookingNo);

        assertThat(jdbcTemplate.queryForObject(
            "SELECT booking_type FROM bookings WHERE booking_no = ?",
            String.class,
            bookingNo
        )).isEqualTo("stay");
        assertThat(jdbcTemplate.queryForObject(
            "SELECT email FROM booking_passengers bp INNER JOIN bookings b ON b.id = bp.booking_id WHERE b.booking_no = ? AND bp.is_primary = 1",
            String.class,
            bookingNo
        )).isEqualTo("stay.lookup@example.com");
        assertThat(jdbcTemplate.queryForObject(
            "SELECT service_start_date FROM booking_items bi INNER JOIN bookings b ON b.id = bi.booking_id WHERE b.booking_no = ?",
            Date.class,
            bookingNo
        )).isEqualTo(Date.valueOf(CHECK_IN_DATE));
        assertThat(jdbcTemplate.queryForObject(
            "SELECT service_end_date FROM booking_items bi INNER JOIN bookings b ON b.id = bi.booking_id WHERE b.booking_no = ?",
            Date.class,
            bookingNo
        )).isEqualTo(Date.valueOf(CHECK_OUT_DATE));
    }

    @Test
    void checkoutRejectsInvalidPayload() throws Exception {
        mockMvc.perform(post("/api/booking/checkout")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "paymentMethod": "card",
                      "totalAmount": 129000,
                      "supplyAmount": 117273,
                      "vatAmount": 11727,
                      "memberBooking": false,
                      "lookup": {
                        "bookerLastName": "",
                        "bookerFirstName": "",
                        "passengerLastName": "",
                        "passengerFirstName": "",
                        "travelDate": null
                      },
                      "payment": {
                        "cardNumber": "4111111111111111",
                        "cardHolder": "Test",
                        "cardExpiry": "12/29",
                        "cardCvv": "123",
                        "mobileNumber": "01000000000"
                      }
                    }
                    """))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void legacyFlatCheckoutPayloadStillWorks() throws Exception {
        mockMvc.perform(post("/api/booking/checkout")
                .contentType(MediaType.APPLICATION_JSON)
            .content("""
                    {
                      "destination": "%s",
                      "travelDate": "2026-04-18",
                      "amount": 50000,
                      "lastName": "Park",
                      "firstName": "Mina",
                      "paymentProvider": "card",
                      "paymentMethod": "card",
                      "currency": "KRW"
                    }
                    """.formatted(LEGACY_DESTINATION)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.destination").value(LEGACY_DESTINATION))
            .andExpect(jsonPath("$.data.amount").value(50000))
            .andExpect(jsonPath("$.data.lastName").value("Park"))
            .andExpect(jsonPath("$.data.firstName").value("Mina"));
    }

    private void seedMemberUser() {
        seedUser(
            MEMBER_USER_ID,
            MEMBER_USER_NAME,
            MEMBER_USER_EMAIL,
            MEMBER_USER_PHONE
        );
    }

    private void seedOtherMemberUser() {
        seedUser(
            OTHER_MEMBER_USER_ID,
            OTHER_MEMBER_USER_NAME,
            OTHER_MEMBER_USER_EMAIL,
            OTHER_MEMBER_USER_PHONE
        );
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
            Date.valueOf(LocalDate.of(1991, 3, 3)),
            "F",
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

    private String newCheckoutJson(
        String destination,
        LocalDate travelDate,
        int totalAmount,
        int supplyAmount,
        int vatAmount,
        boolean memberBooking,
        String bookerLastName,
        String bookerFirstName,
        String passengerLastName,
        String passengerFirstName,
        String paymentMethod,
        String paymentProvider,
        String bookingType,
        String tripType,
        LocalDate checkInDate,
        LocalDate checkOutDate,
        String guestEmail
    ) {
        return """
            {
              "paymentMethod": "%s",
              "totalAmount": %d,
              "supplyAmount": %d,
              "vatAmount": %d,
              "memberBooking": %s,
              "bookingType": %s,
              "tripType": %s,
              "checkInDate": %s,
              "checkOutDate": %s,
              "guestEmail": %s,
              "lookup": {
                "bookerLastName": "%s",
                "bookerFirstName": "%s",
                "passengerLastName": "%s",
                "passengerFirstName": "%s",
                "travelDate": "%s",
                "email": %s
              },
              "payment": {
                "cardNumber": "4111111111111111",
                "cardHolder": "%s %s",
                "cardExpiry": "12/29",
                "cardCvv": "123",
                "mobileNumber": "01000000000"
              },
              "currency": "KRW",
              "destination": "%s",
              "memo": "JEJU",
              "paymentProvider": "%s"
            }
            """.formatted(
            paymentMethod,
            totalAmount,
            supplyAmount,
            vatAmount,
            memberBooking,
            jsonOrNull(bookingType),
            jsonOrNull(tripType),
            jsonOrNull(checkInDate == null ? null : checkInDate.toString()),
            jsonOrNull(checkOutDate == null ? null : checkOutDate.toString()),
            jsonOrNull(guestEmail),
            bookerLastName,
            bookerFirstName,
            passengerLastName,
            passengerFirstName,
            travelDate,
            jsonOrNull(guestEmail),
            passengerFirstName,
            passengerLastName,
            destination,
            paymentProvider
        );
    }

    private String guestLookupJson(String reservationNo, String email) {
        return """
            {
              "reservationNo": "%s",
              "email": "%s"
            }
            """.formatted(reservationNo, email);
    }

    private String jsonOrNull(String value) {
        return value == null ? "null" : "\"%s\"".formatted(value);
    }

    private static String localEnv(String name) {
        for (Path candidate : java.util.List.of(Path.of("jeju-spring/.env"), Path.of(".env"))) {
            if (!Files.isRegularFile(candidate)) {
                continue;
            }

            try {
                Map<String, String> values = new LinkedHashMap<>();
                for (String line : Files.readAllLines(candidate, StandardCharsets.UTF_8)) {
                    String trimmed = line.trim();
                    if (trimmed.isEmpty() || trimmed.startsWith("#") || !trimmed.contains("=")) {
                        continue;
                    }

                    String[] parts = trimmed.split("=", 2);
                    values.put(parts[0].trim(), parts[1].trim());
                }
                return values.getOrDefault(name, "");
            } catch (IOException exception) {
                return "";
            }
        }

        return "";
    }

    private static String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return "";
    }
}
