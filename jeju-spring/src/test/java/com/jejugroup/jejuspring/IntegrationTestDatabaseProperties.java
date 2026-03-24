package com.jejugroup.jejuspring;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

public abstract class IntegrationTestDatabaseProperties {
    private static final String DEFAULT_DB_URL =
        "jdbc:mysql://localhost:3306/jejugroup_db?characterEncoding=UTF-8&serverTimezone=Asia/Seoul&useSSL=false&allowPublicKeyRetrieval=true";
    private static final Map<String, String> LOCAL_ENV = loadLocalEnv();

    @DynamicPropertySource
    static void registerDatabaseProperties(DynamicPropertyRegistry registry) {
        // shell override가 local .env보다 먼저 적용되도록 우선순위를 고정한다.
        String dbUrl = firstNonBlank(env("DB_URL"), localEnv("DB_URL"), env("ALWAYSDATA_DB_URL"), DEFAULT_DB_URL);
        String dbUser = firstNonBlank(env("DB_USER"), localEnv("DB_USER"), env("ALWAYSDATA_DB_USER"), "jejugroup");
        String dbPassword = firstNonBlank(env("DB_PASSWORD"), localEnv("DB_PASSWORD"), env("ALWAYSDATA_DB_PASSWORD"), "");

        registry.add("spring.datasource.url", () -> dbUrl);
        registry.add("spring.datasource.username", () -> dbUser);
        registry.add("spring.datasource.password", () -> dbPassword);
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
                return Files.readAllLines(candidate, StandardCharsets.UTF_8).stream()
                    .map(String::trim)
                    .filter(line -> !line.isEmpty() && !line.startsWith("#") && line.contains("="))
                    .map(line -> line.split("=", 2))
                    .collect(Collectors.toMap(parts -> parts[0].trim(), parts -> parts[1].trim(), (left, right) -> left));
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
