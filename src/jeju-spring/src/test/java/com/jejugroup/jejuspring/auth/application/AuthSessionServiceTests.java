package com.jejugroup.jejuspring.auth.application;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpSession;

import com.jejugroup.jejuspring.auth.model.SessionUser;
import com.jejugroup.jejuspring.config.AppProperties;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

class AuthSessionServiceTests {
    @Test
    void establishSessionStoresUserAndTouchesPresence() {
        ActiveUserPresenceService activeUserPresenceService = mock(ActiveUserPresenceService.class);
        AuthSessionService authSessionService = new AuthSessionService(
            new AppProperties(null, null, null, null, null, null, null),
            activeUserPresenceService
        );
        MockHttpSession session = new MockHttpSession();
        SessionUser user = new SessionUser("naver-user", "네이버 회원", "naver@example.com", "010-1234-5678", "USER");

        SessionUser resolvedUser = authSessionService.establishSession(user, session);

        assertThat(resolvedUser).isEqualTo(user);
        assertThat(session.getAttribute("user")).isEqualTo(user);
        assertThat(session.getMaxInactiveInterval()).isEqualTo(60 * 60 * 24 * 7);
        verify(activeUserPresenceService).touch(session.getId(), user);
    }
}
