package com.jejugroup.jejuspring.config;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(
    Migration migration,
    Alwaysdata alwaysdata,
    External external,
    Social social
) {
    public AppProperties {
        migration = migration == null ? new Migration("../jeju-web/.env", List.of()) : migration;
        alwaysdata = alwaysdata == null ? new Alwaysdata("", "", "", "", "", "", "", "", "") : alwaysdata;
        external = external == null ? new External("", "") : external;
        social = social == null ? new Social("", "", "") : social;
    }

    public record Migration(String sharedEnvPath, List<String> notes) {
        public Migration {
            sharedEnvPath = normalize(sharedEnvPath);
            notes = notes == null ? List.of() : List.copyOf(notes);
        }
    }

    public record Alwaysdata(
        String dbUrl,
        String dbUser,
        String dbPassword,
        String sshHost,
        String sshUser,
        String sshPassword,
        String adminEmail,
        String adminPassword,
        String remoteDeployPath
    ) {
        public Alwaysdata {
            dbUrl = normalize(dbUrl);
            dbUser = normalize(dbUser);
            dbPassword = normalize(dbPassword);
            sshHost = normalize(sshHost);
            sshUser = normalize(sshUser);
            sshPassword = normalize(sshPassword);
            adminEmail = normalize(adminEmail);
            adminPassword = normalize(adminPassword);
            remoteDeployPath = normalize(remoteDeployPath);
        }
    }

    public record External(String openweatherApiKey, String openaiApiKey) {
        public External {
            openweatherApiKey = normalize(openweatherApiKey);
            openaiApiKey = normalize(openaiApiKey);
        }
    }

    public record Social(String naverClientId, String naverClientSecret, String kakaoJsKey) {
        public Social {
            naverClientId = normalize(naverClientId);
            naverClientSecret = normalize(naverClientSecret);
            kakaoJsKey = normalize(kakaoJsKey);
        }
    }

    private static String normalize(String value) {
        return value == null ? "" : value.strip();
    }
}
