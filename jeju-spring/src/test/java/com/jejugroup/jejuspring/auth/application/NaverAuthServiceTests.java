package com.jejugroup.jejuspring.auth.application;

import java.io.IOException;
import java.net.Authenticator;
import java.net.CookieHandler;
import java.net.ProxySelector;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpClient.Redirect;
import java.net.http.HttpHeaders;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpClient.Version;
import java.time.Duration;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;

import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLParameters;
import jakarta.servlet.http.HttpSession;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpSession;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jejugroup.jejuspring.auth.model.SessionUser;
import com.jejugroup.jejuspring.config.AppProperties;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class NaverAuthServiceTests {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void createAuthorizationUriStoresStateInSession() {
        MockHttpSession session = new MockHttpSession();
        NaverAuthService service = createService(new FakeNaverAuthAccountRepository(), mock(AuthSessionService.class));

        URI authorizationUri = service.createAuthorizationUri(session);
        String state = (String) session.getAttribute(stateKey());

        assertThat(authorizationUri.toString()).contains("client_id=naver-client-id");
        assertThat(authorizationUri.toString()).contains("redirect_uri=");
        assertThat(state).isNotBlank();
        assertThat(authorizationUri.toString()).contains("state=" + state);
    }

    @Test
    void completeLoginUsesExistingUserLinkAndCreatesSession() throws Exception {
        MockHttpSession session = new MockHttpSession();
        FakeNaverAuthAccountRepository repository = new FakeNaverAuthAccountRepository();
        SessionUser resolvedUser = new SessionUser("naver-user", "네이버 회원", "naver@example.com", "010-1234-5678", "USER");
        repository.nextResolvedUser = resolvedUser;

        AuthSessionService authSessionService = mock(AuthSessionService.class);
        when(authSessionService.establishSession(any(SessionUser.class), any(HttpSession.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

        StubHttpClient httpClient = new StubHttpClient();
        httpClient.enqueue(mockResponse(200, """
            {"access_token":"access-token-1","token_type":"Bearer","expires_in":3600}
            """));
        httpClient.enqueue(mockResponse(200, """
            {"resultcode":"00","message":"success","response":{"id":"naver-account-1","email":"naver@example.com","name":"네이버","mobile":"010-1234-5678","gender":"M"}}
            """));

        NaverAuthService service = createService(repository, authSessionService, httpClient);
        String state = (String) session.getAttribute(stateKey());
        if (state == null) {
            state = "naver-state-1";
            session.setAttribute(stateKey(), state);
        }

        SessionUser user = service.completeLogin("authorization-code-1", state, session);

        assertThat(user).isEqualTo(resolvedUser);
        assertThat(repository.lastProviderAccountId).isEqualTo("naver-account-1");
        assertThat(repository.lastProviderEmail).isEqualTo("naver@example.com");
        assertThat(httpClient.requests).hasSize(2);
        verify(authSessionService).establishSession(resolvedUser, session);
    }

    @Test
    void completeLoginRejectsStateMismatchBeforeCallingNaver() {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute(stateKey(), "expected-state");
        NaverAuthService service = createService(new FakeNaverAuthAccountRepository(), mock(AuthSessionService.class));

        assertThatThrownBy(() -> service.completeLogin("authorization-code-1", "wrong-state", session))
            .isInstanceOf(NaverAuthStateMismatchException.class);
    }

    private NaverAuthService createService(NaverAuthAccountRepository repository, AuthSessionService authSessionService) {
        return createService(repository, authSessionService, new StubHttpClient());
    }

    private NaverAuthService createService(
        NaverAuthAccountRepository repository,
        AuthSessionService authSessionService,
        HttpClient httpClient
    ) {
        return new NaverAuthService(
            new AppProperties(null, null, null, null, new AppProperties.Social("naver-client-id", "naver-client-secret", ""), null, null),
            repository,
            authSessionService,
            httpClient,
            objectMapper
        );
    }

    private HttpResponse<String> mockResponse(int statusCode, String body) {
        HttpResponse<String> response = mock(HttpResponse.class);
        when(response.statusCode()).thenReturn(statusCode);
        when(response.body()).thenReturn(body);
        return response;
    }

    private String stateKey() {
        return NaverAuthService.class.getName() + ".STATE";
    }

    private static final class FakeNaverAuthAccountRepository implements NaverAuthAccountRepository {
        private String lastProviderAccountId;
        private String lastProviderEmail;
        private SessionUser nextResolvedUser;

        @Override
        public SessionUser resolveOrLinkExistingUser(String providerAccountId, String providerEmail) {
            lastProviderAccountId = providerAccountId;
            lastProviderEmail = providerEmail;
            return nextResolvedUser;
        }
    }

    private static final class StubHttpClient extends HttpClient {
        private final Queue<HttpResponse<String>> responses = new ArrayDeque<>();
        private final List<HttpRequest> requests = new ArrayList<>();

        void enqueue(HttpResponse<String> response) {
            responses.add(response);
        }

        @Override
        public <T> HttpResponse<T> send(HttpRequest request, HttpResponse.BodyHandler<T> responseBodyHandler) throws IOException, InterruptedException {
            requests.add(request);
            HttpResponse<String> response = responses.poll();
            if (response == null) {
                throw new IOException("No queued response");
            }
            @SuppressWarnings("unchecked")
            HttpResponse<T> castResponse = (HttpResponse<T>) response;
            return castResponse;
        }

        @Override
        public <T> CompletableFuture<HttpResponse<T>> sendAsync(HttpRequest request, HttpResponse.BodyHandler<T> responseBodyHandler) {
            throw new UnsupportedOperationException();
        }

        @Override
        public <T> CompletableFuture<HttpResponse<T>> sendAsync(
            HttpRequest request,
            HttpResponse.BodyHandler<T> responseBodyHandler,
            HttpResponse.PushPromiseHandler<T> pushPromiseHandler
        ) {
            throw new UnsupportedOperationException();
        }

        @Override
        public Optional<CookieHandler> cookieHandler() {
            return Optional.empty();
        }

        @Override
        public Optional<Duration> connectTimeout() {
            return Optional.empty();
        }

        @Override
        public Redirect followRedirects() {
            return Redirect.NEVER;
        }

        @Override
        public Optional<ProxySelector> proxy() {
            return Optional.empty();
        }

        @Override
        public SSLContext sslContext() {
            return null;
        }

        @Override
        public SSLParameters sslParameters() {
            return new SSLParameters();
        }

        @Override
        public Optional<Executor> executor() {
            return Optional.empty();
        }

        @Override
        public Version version() {
            return Version.HTTP_1_1;
        }

        @Override
        public Optional<Authenticator> authenticator() {
            return Optional.empty();
        }
    }
}
