package com.jejugroup.jejuspring.auth.application;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.sql.SQLException;
import java.util.Base64;

import jakarta.servlet.http.HttpSession;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.util.UriComponentsBuilder;

import com.jejugroup.jejuspring.auth.model.SessionUser;
import com.jejugroup.jejuspring.config.AppProperties;

@Service
public class NaverAuthService {
    private static final String PROVIDER = "NAVER";
    private static final String SESSION_STATE_KEY = NaverAuthService.class.getName() + ".STATE";
    private static final String AUTHORIZATION_ENDPOINT = "https://nid.naver.com/oauth2.0/authorize";
    private static final String TOKEN_ENDPOINT = "https://nid.naver.com/oauth2.0/token";
    private static final String PROFILE_ENDPOINT = "https://openapi.naver.com/v1/nid/me";
    private static final String CALLBACK_URL = "http://129.146.53.253/pages/auth/oauth_callback.html";
    private static final String GRANT_TYPE = "authorization_code";

    private final AppProperties appProperties;
    private final NaverAuthAccountRepository naverAuthAccountRepository;
    private final AuthSessionService authSessionService;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final SecureRandom secureRandom = new SecureRandom();

    public NaverAuthService(
        AppProperties appProperties,
        NaverAuthAccountRepository naverAuthAccountRepository,
        AuthSessionService authSessionService,
        HttpClient httpClient,
        ObjectMapper objectMapper
    ) {
        this.appProperties = appProperties;
        this.naverAuthAccountRepository = naverAuthAccountRepository;
        this.authSessionService = authSessionService;
        this.httpClient = httpClient;
        this.objectMapper = objectMapper;
    }

    public URI createAuthorizationUri(HttpSession session) {
        requireSession(session);
        String clientId = requireClientId();
        String state = generateState();
        session.setAttribute(SESSION_STATE_KEY, state);

        return UriComponentsBuilder.fromHttpUrl(AUTHORIZATION_ENDPOINT)
            .queryParam("response_type", "code")
            .queryParam("client_id", clientId)
            .queryParam("redirect_uri", CALLBACK_URL)
            .queryParam("state", state)
            .build(true)
            .toUri();
    }

    public SessionUser completeLogin(String code, String state, HttpSession session) throws SQLException {
        requireSession(session);
        String normalizedCode = normalize(code);
        String normalizedState = normalize(state);

        if (!StringUtils.hasText(normalizedCode) || !StringUtils.hasText(normalizedState)) {
            throw new IllegalArgumentException("Naver callback parameters are required");
        }

        String expectedState = normalize((String) session.getAttribute(SESSION_STATE_KEY));
        session.removeAttribute(SESSION_STATE_KEY);

        if (!StringUtils.hasText(expectedState) || !expectedState.equals(normalizedState)) {
            throw new NaverAuthStateMismatchException();
        }

        String accessToken = exchangeAccessToken(normalizedCode, normalizedState);
        NaverProfile profile = fetchProfile(accessToken);
        if (!StringUtils.hasText(profile.providerAccountId())) {
            throw new NaverAuthUnauthorizedException();
        }

        SessionUser user = naverAuthAccountRepository.resolveOrLinkExistingUser(
            profile.providerAccountId(),
            profile.email()
        );

        return authSessionService.establishSession(user, session);
    }

    private String exchangeAccessToken(String code, String state) {
        String clientId = requireClientId();
        String clientSecret = requireClientSecret();

        String body = formEncode("grant_type", GRANT_TYPE)
            + "&" + formEncode("client_id", clientId)
            + "&" + formEncode("client_secret", clientSecret)
            + "&" + formEncode("code", code)
            + "&" + formEncode("state", state);

        HttpRequest request = HttpRequest.newBuilder(URI.create(TOKEN_ENDPOINT))
            .header("Content-Type", "application/x-www-form-urlencoded")
            .header("Accept", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(body == null ? "" : body))
            .build();

        HttpResponse<String> response = send(request);
        JsonNode root = parseJson(response.body());
        if (response.statusCode() < 200 || response.statusCode() >= 300 || root.hasNonNull("error")) {
            throw new NaverAuthUpstreamException();
        }

        String accessToken = root.path("access_token").asText("");
        if (!StringUtils.hasText(accessToken)) {
            throw new NaverAuthUpstreamException();
        }

        return accessToken.trim();
    }

    private NaverProfile fetchProfile(String accessToken) {
        HttpRequest request = HttpRequest.newBuilder(URI.create(PROFILE_ENDPOINT))
            .header("Authorization", "Bearer " + accessToken)
            .header("Accept", "application/json")
            .GET()
            .build();

        HttpResponse<String> response = send(request);
        JsonNode root = parseJson(response.body());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new NaverAuthUpstreamException();
        }

        String resultCode = root.path("resultcode").asText("");
        if (!"00".equals(resultCode)) {
            throw new NaverAuthUpstreamException();
        }

        JsonNode profileNode = root.path("response");
        return new NaverProfile(
            normalize(profileNode.path("id").asText("")),
            normalize(profileNode.path("email").asText("")),
            normalize(profileNode.path("name").asText("")),
            normalize(profileNode.path("mobile").asText("")),
            normalize(profileNode.path("gender").asText(""))
        );
    }

    private HttpResponse<String> send(HttpRequest request) {
        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            if (response == null || response.body() == null) {
                throw new NaverAuthUpstreamException();
            }
            return response;
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new NaverAuthUpstreamException();
        } catch (IOException exception) {
            throw new NaverAuthUpstreamException();
        }
    }

    private JsonNode parseJson(String body) {
        try {
            return objectMapper.readTree(body);
        } catch (IOException exception) {
            throw new NaverAuthUpstreamException();
        }
    }

    private String requireClientId() {
        String clientId = normalize(appProperties.social().naverClientId());
        if (!StringUtils.hasText(clientId)) {
            throw new NaverAuthConfigurationException();
        }
        return clientId;
    }

    private String requireClientSecret() {
        String clientSecret = normalize(appProperties.social().naverClientSecret());
        if (!StringUtils.hasText(clientSecret)) {
            throw new NaverAuthConfigurationException();
        }
        return clientSecret;
    }

    private String generateState() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private void requireSession(HttpSession session) {
        if (session == null) {
            throw new IllegalArgumentException("Session is required");
        }
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }

    private String formEncode(String key, String value) {
        return urlEncode(key) + "=" + urlEncode(value);
    }

    private String urlEncode(String value) {
        return URLEncoder.encode(value == null ? "" : value, StandardCharsets.UTF_8);
    }

    private record NaverProfile(String providerAccountId, String email, String name, String mobile, String gender) {
    }
}
