package com.jejugroup.jejuspring.auth.application;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import jakarta.servlet.http.HttpSession;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.jejugroup.jejuspring.auth.model.SessionUser;
import com.jejugroup.jejuspring.config.AppProperties;

@Service
public class AuthSessionService {
    private static final int SESSION_MAX_INACTIVE_SECONDS = 60 * 60 * 24 * 7;

    private final AppProperties appProperties;
    private final ActiveUserPresenceService activeUserPresenceService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthSessionService(AppProperties appProperties, ActiveUserPresenceService activeUserPresenceService) {
        this.appProperties = appProperties;
        this.activeUserPresenceService = activeUserPresenceService;
    }

    public SessionUser login(String id, String plainPw, HttpSession session) throws SQLException {
        if (!StringUtils.hasText(id) || !StringUtils.hasText(plainPw)) {
            throw new IllegalArgumentException("아이디와 비밀번호를 입력해주세요.");
        }

        SessionUser user = authenticate(id.trim(), plainPw);
        if (user == null) {
            return null;
        }

        session.setAttribute("user", user);
        session.setMaxInactiveInterval(SESSION_MAX_INACTIVE_SECONDS);
        activeUserPresenceService.touch(session.getId(), user);
        return user;
    }

    public SessionUser resolveSessionUser(HttpSession session) {
        Object sessionUser = session.getAttribute("user");
        if (!(sessionUser instanceof SessionUser user)) {
            return null;
        }

        activeUserPresenceService.touch(session.getId(), user);
        return user;
    }

    public void logout(HttpSession session) {
        String sessionId = session.getId();
        activeUserPresenceService.clear(sessionId);
        session.invalidate();
    }

    private SessionUser authenticate(String id, String plainPw) throws SQLException {
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

    private Connection openConnection() throws SQLException {
        String url = normalize(appProperties.alwaysdata().dbUrl());
        String user = normalize(appProperties.alwaysdata().dbUser());
        String password = normalize(appProperties.alwaysdata().dbPassword());

        if (!StringUtils.hasText(url) || !StringUtils.hasText(user) || !StringUtils.hasText(password)) {
            throw new SQLException("Spring auth DB configuration is missing");
        }

        return DriverManager.getConnection(url, user, password);
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }
}
