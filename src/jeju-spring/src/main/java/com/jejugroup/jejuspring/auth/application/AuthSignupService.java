package com.jejugroup.jejuspring.auth.application;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.DateTimeException;
import java.time.LocalDate;
import java.util.regex.Pattern;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.jejugroup.jejuspring.auth.model.SignupRequest;

@Service
public class AuthSignupService {
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    private final AuthService authService;
    private final AuthVerificationService authVerificationService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthSignupService(AuthService authService, AuthVerificationService authVerificationService) {
        this.authService = authService;
        this.authVerificationService = authVerificationService;
    }

    public void signup(SignupRequest request) throws SQLException {
        validateRequiredFields(request);

        if (!EMAIL_PATTERN.matcher(request.email().trim()).matches()) {
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

        String trimmedId = request.id().trim();
        String trimmedPhone = request.phone().trim();
        String trimmedEmail = request.email().trim();

        if (authVerificationService.checkIdExists(trimmedId)) {
            throw new IllegalStateException("ID already exists");
        }

        if (authVerificationService.checkPhoneExists(trimmedPhone)) {
            throw new IllegalStateException("Phone already exists");
        }

        if (authService.checkEmailExists(trimmedEmail)) {
            throw new IllegalStateException("Email already exists");
        }

        String query = """
            INSERT INTO users (id, pw, name, phone, email, birth_date, gender, provider, role)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'USER')
            """;

        try (Connection connection = authService.openConnection();
             PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, trimmedId);
            statement.setString(2, passwordEncoder.encode(request.pw().trim()));
            statement.setString(3, request.name().trim());
            statement.setString(4, trimmedPhone);
            statement.setString(5, trimmedEmail);
            statement.setString(6, normalizedBirthDate);
            statement.setString(7, deriveGenderByRrnFirstDigit(rrnDigit));
            statement.setString(8, isBlank(request.provider()) ? "PASS" : request.provider().trim());
            statement.executeUpdate();
        }
    }

    private void validateRequiredFields(SignupRequest request) {
        if (isBlank(request.phone()) || isBlank(request.name()) || isBlank(request.id()) || isBlank(request.pw())
            || isBlank(request.email()) || isBlank(request.birthDate()) || isBlank(request.rrnBackFirstDigit())) {
            throw new IllegalArgumentException("Required fields missing");
        }
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
}
