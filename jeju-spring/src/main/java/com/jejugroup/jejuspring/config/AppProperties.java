package com.jejugroup.jejuspring.config;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(
    Migration migration,
    Database database,
    Alwaysdata alwaysdata,
    External external,
    Social social,
    MyPage mypage,
    Banner banner
) {
    public AppProperties {
        migration = migration == null
            ? new Migration(
                "./.env",
                List.of("Spring datasource auto-config now targets the local MySQL baseline while AuthService keeps the legacy users-table contract.")
            )
            : migration;
        database = database == null ? new Database("", "", "") : database;
        alwaysdata = alwaysdata == null ? new Alwaysdata("", "", "", "", "", "") : alwaysdata;
        external = external == null ? new External("", "") : external;
        social = social == null ? new Social("", "", "") : social;
        mypage = mypage == null ? new MyPage("./.tmp/mypage-avatars") : mypage;
        banner = banner == null ? new Banner("./.tmp/banner-assets") : banner;
    }

    public record Migration(String sharedEnvPath, List<String> notes) {
        public Migration {
            sharedEnvPath = normalize(sharedEnvPath);
            notes = notes == null ? List.of() : List.copyOf(notes);
        }
    }

    public record Database(
        String dbUrl,
        String dbUser,
        String dbPassword
    ) {
        public Database {
            dbUrl = normalize(dbUrl);
            dbUser = normalize(dbUser);
            dbPassword = normalize(dbPassword);
        }
    }

    public record Alwaysdata(
        String sshHost,
        String sshUser,
        String sshPassword,
        String adminEmail,
        String adminPassword,
        String remoteDeployPath
    ) {
        public Alwaysdata {
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

    public record MyPage(String avatarUploadRoot) {
        public MyPage {
            avatarUploadRoot = normalize(avatarUploadRoot);
        }
    }

    public record Banner(String uploadRoot) {
        public Banner {
            uploadRoot = normalize(uploadRoot);
        }
    }

    private static String normalize(String value) {
        return value == null ? "" : value.strip();
    }
}
