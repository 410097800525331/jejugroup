package com.jejugroup.jejuspring;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

public abstract class IntegrationTestDatabaseProperties {
    private static final String DEFAULT_DB_URL =
        "jdbc:mysql://localhost:3306/jejugroup_db?characterEncoding=UTF-8&serverTimezone=Asia/Seoul&useSSL=false&allowPublicKeyRetrieval=true";
    private static final Map<String, String> LOCAL_ENV = loadLocalEnv();

    @DynamicPropertySource
    static void registerDatabaseProperties(DynamicPropertyRegistry registry) {
        // Test-only overrides win first; otherwise fall back to the local DB file, then localhost.
        String dbUrl = firstNonBlank(env("JEJU_SPRING_TEST_DB_URL"), localEnv("DB_URL"), DEFAULT_DB_URL);
        String dbUser = firstNonBlank(env("JEJU_SPRING_TEST_DB_USER"), localEnv("DB_USER"), "jejugroup");
        String dbPassword = firstNonBlank(env("JEJU_SPRING_TEST_DB_PASSWORD"), localEnv("DB_PASSWORD"), "");

        registry.add("spring.datasource.url", () -> dbUrl);
        registry.add("spring.datasource.username", () -> dbUser);
        registry.add("spring.datasource.password", () -> dbPassword);
        registry.add("spring.flyway.url", () -> dbUrl);
        registry.add("spring.flyway.user", () -> dbUser);
        registry.add("spring.flyway.password", () -> dbPassword);
        registry.add("app.alwaysdata.db-url", () -> dbUrl);
        registry.add("app.alwaysdata.db-user", () -> dbUser);
        registry.add("app.alwaysdata.db-password", () -> dbPassword);
    }

    private static String env(String name) {
        String value = System.getenv(name);
        return value == null ? "" : value.trim();
    }

    private static String localEnv(String name) {
        return LOCAL_ENV.getOrDefault(name, "");
    }

    private static Map<String, String> loadLocalEnv() {
        for (Path candidate : List.of(Path.of("jeju-spring/.env"), Path.of(".env"))) {
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
                return values;
            } catch (IOException exception) {
                return Map.of();
            }
        }

        return Map.of();
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
