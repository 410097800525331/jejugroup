package com.jejugroup.jejuspring.auth.web;

import java.net.URI;

import jakarta.servlet.http.HttpSession;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.jejugroup.jejuspring.auth.application.AuthSessionService;
import com.jejugroup.jejuspring.auth.application.AuthSignupService;
import com.jejugroup.jejuspring.auth.application.AuthVerificationService;
import com.jejugroup.jejuspring.auth.application.NaverAuthService;
import com.jejugroup.jejuspring.auth.application.NaverAuthUpstreamException;
import com.jejugroup.jejuspring.auth.model.SessionUser;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthApiController.class)
class AuthApiControllerNaverTests {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthVerificationService authVerificationService;

    @MockBean
    private AuthSignupService authSignupService;

    @MockBean
    private AuthSessionService authSessionService;

    @MockBean
    private NaverAuthService naverAuthService;

    @Test
    void postStartReturnsAuthorizationUrlJson() throws Exception {
        when(naverAuthService.createAuthorizationUri(any(HttpSession.class)))
            .thenReturn(URI.create("https://nid.naver.com/oauth2.0/authorize?client_id=naver-client-id"));

        mockMvc.perform(post("/api/auth/naver/start")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .param("callbackUrl", "http://129.146.53.253/pages/auth/oauth_callback.html")
                .param("provider", "NAVER")
                .param("flow", "login"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.authorizationUrl").value("https://nid.naver.com/oauth2.0/authorize?client_id=naver-client-id"));
    }

    @Test
    void postInitReturnsAuthorizationUrlJson() throws Exception {
        when(naverAuthService.createAuthorizationUri(any(HttpSession.class)))
            .thenReturn(URI.create("https://nid.naver.com/oauth2.0/authorize?client_id=naver-client-id"));

        mockMvc.perform(post("/api/auth/naver/init")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .param("callbackUrl", "http://129.146.53.253/pages/auth/oauth_callback.html")
                .param("provider", "NAVER")
                .param("flow", "login"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.authorizationUrl").value("https://nid.naver.com/oauth2.0/authorize?client_id=naver-client-id"));
    }

    @Test
    void getStartStillRedirectsForLegacyFlow() throws Exception {
        when(naverAuthService.createAuthorizationUri(any(HttpSession.class)))
            .thenReturn(URI.create("https://nid.naver.com/oauth2.0/authorize?client_id=naver-client-id"));

        mockMvc.perform(get("/api/auth/naver/start"))
            .andExpect(status().isFound())
            .andExpect(header().string("Location", "https://nid.naver.com/oauth2.0/authorize?client_id=naver-client-id"));
    }

    @Test
    void completeNaverLoginReturnsSessionUserOnSuccess() throws Exception {
        SessionUser user = new SessionUser("naver-user", "네이버 회원", "naver@example.com", "010-1234-5678", "USER");
        when(naverAuthService.completeLogin(eq("authorization-code-1"), eq("state-1"), any(HttpSession.class))).thenReturn(user);

        mockMvc.perform(post("/api/auth/naver/callback")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .param("code", "authorization-code-1")
                .param("state", "state-1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.user.id").value("naver-user"))
            .andExpect(jsonPath("$.user.email").value("naver@example.com"));
    }

    @Test
    void completeNaverLoginKeepsUpstreamFailuresOpaque() throws Exception {
        when(naverAuthService.completeLogin(eq("authorization-code-1"), eq("state-1"), any(HttpSession.class)))
            .thenThrow(new NaverAuthUpstreamException());

        mockMvc.perform(post("/api/auth/naver/callback")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .param("code", "authorization-code-1")
                .param("state", "state-1"))
            .andExpect(status().isBadGateway())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("네이버 로그인 처리에 실패했습니다."));
    }
}
