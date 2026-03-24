package com.jejugroup.jejuspring.auth.application;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.DateTimeException;
import java.time.LocalDate;
import java.util.Objects;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.jejugroup.jejuspring.auth.model.SessionUser;
import com.jejugroup.jejuspring.auth.model.SignupRequest;
import com.jejugroup.jejuspring.config.AppProperties;

@Service
public class AuthService {
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private static final String RECAPTCHA_TEST_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
    private static final String RECAPTCHA_TEST_SECRET_KEY = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe";

    private final AppProperties appProperties;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final String recaptchaSecretKey;
    private final String recaptchaSiteKey;

    public AuthService(
        AppProperties appProperties,
        @Value("${RECAPTCHA_SITE_KEY:}") String recaptchaSiteKey,
        @Value("${RECAPTCHA_SECRET_KEY:}") String recaptchaSecretKey
    ) {
        this.appProperties = appProperties;
        this.recaptchaSiteKey = normalize(recaptchaSiteKey);
        this.recaptchaSecretKey = normalize(recaptchaSecretKey);
    }

    public SessionUser login(String id, String plainPw) throws SQLException {
        if (!StringUtils.hasText(id) || !StringUtils.hasText(plainPw)) {
            throw new IllegalArgumentException("아이디와 비밀번호를 입력해주세요.");
        }

        String query = "SELECT id, pw, name, role FROM users WHERE id = ?";
        try (Connection connection = openConnection();
             PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, id);

            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return null;
                }

                String hashedPassword = resultSet.getString("pw");
                if (!passwordEncoder.matches(plainPw, hashedPassword)) {
                    return null;
                }

                return new SessionUser(
                    resultSet.getString("id"),
                    resultSet.getString("name"),
                    resultSet.getString("role")
                );
            }
        }
    }

    public boolean checkIdExists(String id) throws SQLException {
        return exists("SELECT id FROM users WHERE id = ?", id);
    }

    public boolean checkPhoneExists(String phone) throws SQLException {
        return exists("SELECT phone FROM users WHERE phone = ?", phone);
    }

    public boolean checkEmailExists(String email) throws SQLException {
        return exists("SELECT email FROM users WHERE email = ?", email);
    }

    public void signup(SignupRequest request) throws SQLException {
        if (isBlank(request.phone()) || isBlank(request.name()) || isBlank(request.id()) || isBlank(request.pw())
            || isBlank(request.email()) || isBlank(request.birthDate()) || isBlank(request.rrnBackFirstDigit())) {
            throw new IllegalArgumentException("Required fields missing");
        }

        if (!EMAIL_PATTERN.matcher(request.email()).matches()) {
            throw new IllegalArgumentException("Invalid email format");
        }

        char rrnDigit = request.rrnBackFirstDigit().trim().charAt(0);
        if (!isValidRrnBackFirstDigit(rrnDigit)) {
            throw new IllegalArgumentException("rrnBackFirstDigit must be 1-8");
        }

        String normalizedBirthDate = normalizeBirthDate(request.birthDate(), rrnDigit);
        if (normalizedBirthDate == null) {
            throw new IllegalArgumentException("birthDate must be yy-mm-dd");
        }

        if (checkIdExists(request.id().trim())) {
            throw new IllegalStateException("ID already exists");
        }

        if (checkPhoneExists(request.phone().trim())) {
            throw new IllegalStateException("Phone already exists");
        }

        if (checkEmailExists(request.email().trim())) {
            throw new IllegalStateException("Email already exists");
        }

        String query = """
            INSERT INTO users (id, pw, name, phone, email, birth_date, gender, provider, role)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'USER')
            """;

        try (Connection connection = openConnection();
             PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, request.id().trim());
            statement.setString(2, passwordEncoder.encode(request.pw().trim()));
            statement.setString(3, request.name().trim());
            statement.setString(4, request.phone().trim());
            statement.setString(5, request.email().trim());
            statement.setString(6, normalizedBirthDate);
            statement.setString(7, deriveGenderByRrnFirstDigit(rrnDigit));
            statement.setString(8, isBlank(request.provider()) ? "PASS" : request.provider().trim());
            statement.executeUpdate();
        }
    }

    public String resolveRecaptchaSiteKey() {
        if (StringUtils.hasText(recaptchaSiteKey)) {
            return recaptchaSiteKey;
        }
        return RECAPTCHA_TEST_SITE_KEY;
    }

    public boolean verifyRecaptcha(String token) {
        String secret = StringUtils.hasText(recaptchaSecretKey) ? recaptchaSecretKey : RECAPTCHA_TEST_SECRET_KEY;
        String body = "secret=%s&response=%s".formatted(
            urlEncode(secret),
            urlEncode(token)
        );

        HttpRequest request = HttpRequest.newBuilder(URI.create("https://www.google.com/recaptcha/api/siteverify"))
            .header("Content-Type", "application/x-www-form-urlencoded")
            .POST(HttpRequest.BodyPublishers.ofString(body))
            .build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            String responseBody = response.body();
            return response.statusCode() >= 200
                && response.statusCode() < 300
                && responseBody != null
                && (responseBody.contains("\"success\": true") || responseBody.contains("\"success\":true"));
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            return false;
        } catch (IOException exception) {
            return false;
        }
    }

    private boolean exists(String query, String parameter) throws SQLException {
        try (Connection connection = openConnection();
             PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, parameter);
            try (ResultSet resultSet = statement.executeQuery()) {
                return resultSet.next();
            }
        }
    }

    private Connection openConnection() throws SQLException {
        String url = normalize(appProperties.alwaysdata().dbUrl());
        String user = normalize(appProperties.alwaysdata().dbUser());
        String password = normalize(appProperties.alwaysdata().dbPassword());

        if (!StringUtils.hasText(url) || !StringUtils.hasText(user) || !StringUtils.hasText(password)) {
            throw new SQLException("Spring auth DB configuration is missing");
        }

        return DriverManager.getConnection(url, user, password);
    }

    private String deriveGenderByRrnFirstDigit(char digit) {
        if (digit == '1' || digit == '3' || digit == '5' || digit == '7') {
            return "M";
        }
        return "F";
    }

    private boolean isValidRrnBackFirstDigit(char digit) {
        return digit >= '1' && digit <= '8';
    }

    private String normalizeBirthDate(String birthDateInput, char rrnDigit) {
        String digits = birthDateInput.replaceAll("[^0-9]", "");
        if (digits.length() != 6) {
            return null;
        }

        try {
            int yy = Integer.parseInt(digits.substring(0, 2));
            int mm = Integer.parseInt(digits.substring(2, 4));
            int dd = Integer.parseInt(digits.substring(4, 6));
            int century = (rrnDigit == '1' || rrnDigit == '2' || rrnDigit == '5' || rrnDigit == '6') ? 1900 : 2000;
            return LocalDate.of(century + yy, mm, dd).toString();
        } catch (DateTimeException | NumberFormatException exception) {
            return null;
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String urlEncode(String value) {
        return URLEncoder.encode(Objects.toString(value, ""), StandardCharsets.UTF_8);
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }
}
