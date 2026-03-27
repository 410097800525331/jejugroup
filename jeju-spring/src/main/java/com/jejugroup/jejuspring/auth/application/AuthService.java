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
import java.util.Objects;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.jejugroup.jejuspring.config.AppProperties;

@Service
public class AuthService {
    private static final String RECAPTCHA_TEST_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
    private static final String RECAPTCHA_TEST_SECRET_KEY = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe";

    private final AppProperties appProperties;
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

    public boolean checkIdExists(String id) throws SQLException {
        return exists("SELECT id FROM users WHERE id = ?", id);
    }

    public boolean checkPhoneExists(String phone) throws SQLException {
        return exists("SELECT phone FROM users WHERE phone = ?", phone);
    }

    public boolean checkEmailExists(String email) throws SQLException {
        return exists("SELECT email FROM users WHERE email = ?", email);
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

    Connection openConnection() throws SQLException {
        String url = normalize(appProperties.alwaysdata().dbUrl());
        String user = normalize(appProperties.alwaysdata().dbUser());
        String password = normalize(appProperties.alwaysdata().dbPassword());

        if (!StringUtils.hasText(url) || !StringUtils.hasText(user) || !StringUtils.hasText(password)) {
            throw new SQLException("Spring auth DB configuration is missing");
        }

        return DriverManager.getConnection(url, user, password);
    }

    private String urlEncode(String value) {
        return URLEncoder.encode(Objects.toString(value, ""), StandardCharsets.UTF_8);
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }
}
