package com.jejugroup.jejuspring.migration.application;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.jejugroup.jejuspring.config.AppProperties;
import com.jejugroup.jejuspring.migration.view.MigrationConfigItemView;
import com.jejugroup.jejuspring.migration.view.MigrationConfigSectionView;
import com.jejugroup.jejuspring.migration.view.MigrationDashboardView;
import com.jejugroup.jejuspring.migration.view.MigrationReadinessView;
import com.jejugroup.jejuspring.migration.view.MigrationRouteView;
import com.jejugroup.jejuspring.migration.view.MigrationSectionStatusView;

@Service
public class MigrationDashboardFactory {
    public static final String HEALTH_PATH = "/actuator/health";

    private final AppProperties appProperties;

    public MigrationDashboardFactory(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    public MigrationDashboardView buildDashboard() {
        List<MigrationConfigSectionView> configSections = buildConfigSections();
        int totalConfigCount = countTotal(configSections);
        int configuredCount = countConfigured(configSections);

        return new MigrationDashboardView(
            appProperties.migration().sharedEnvPath(),
            appProperties.migration().notes(),
            appProperties.alwaysdata().remoteDeployPath(),
            HEALTH_PATH,
            configuredCount,
            totalConfigCount,
            configSections,
            buildRoutes()
        );
    }

    public MigrationReadinessView buildReadiness() {
        List<MigrationConfigSectionView> configSections = buildConfigSections();
        int totalConfigCount = countTotal(configSections);
        int configuredCount = countConfigured(configSections);

        List<MigrationSectionStatusView> sectionStatuses = configSections.stream()
            .map(section -> new MigrationSectionStatusView(
                section.title(),
                section.readyCount(),
                section.items().size()
            ))
            .toList();

        return new MigrationReadinessView(
            appProperties.migration().sharedEnvPath(),
            appProperties.alwaysdata().remoteDeployPath(),
            HEALTH_PATH,
            appProperties.migration().notes(),
            configuredCount,
            totalConfigCount,
            sectionStatuses
        );
    }

    private List<MigrationConfigSectionView> buildConfigSections() {
        AppProperties.Database database = appProperties.database();
        AppProperties.Alwaysdata alwaysdata = appProperties.alwaysdata();
        AppProperties.External external = appProperties.external();
        AppProperties.Social social = appProperties.social();

        return List.of(
            section(
                "Database and deploy",
                List.of(
                    item("DB URL", "DB_URL / ALWAYSDATA_DB_URL", database.dbUrl()),
                    item("DB user", "DB_USER / ALWAYSDATA_DB_USER", database.dbUser()),
                    item("SSH host", "ALWAYSDATA_SSH_HOST / SSH_HOST", alwaysdata.sshHost()),
                    item("SSH user", "ALWAYSDATA_SSH_USER / SSH_USER", alwaysdata.sshUser()),
                    item("Remote deploy path", "REMOTE_DEPLOY_PATH", alwaysdata.remoteDeployPath())
                )
            ),
            section(
                "Admin and runtime",
                List.of(
                    item("Admin email", "ALWAYSDATA_ADMIN_EMAIL / ADMIN_EMAIL", alwaysdata.adminEmail()),
                    item("Admin password", "ALWAYSDATA_ADMIN_PASSWORD / ADMIN_PASSWORD", alwaysdata.adminPassword()),
                    item("OpenWeather key", "OPENWEATHER_API_KEY", external.openweatherApiKey()),
                    item("OpenAI key", "OPENAI_API_KEY", external.openaiApiKey())
                )
            ),
            section(
                "Social login",
                List.of(
                    item("Naver client id", "NAVER_CLIENT_ID", social.naverClientId()),
                    item("Naver client secret", "NAVER_CLIENT_SECRET", social.naverClientSecret()),
                    item("Kakao JS key", "KAKAO_JS_KEY", social.kakaoJsKey())
                )
            )
        );
    }

    private List<MigrationRouteView> buildRoutes() {
        return List.of(
            new MigrationRouteView("Dashboard", "/", "Spring migration shell landing page"),
            new MigrationRouteView("Migration view", "/migration", "Primary Thymeleaf entry for migration status"),
            new MigrationRouteView("Auth login", "/auth/login", "Redirect alias to the canonical front-mirror login page"),
            new MigrationRouteView("Legacy-compatible login", "/pages/auth/login.html", "Canonical front-mirror auth route"),
            new MigrationRouteView("Auth signup", "/auth/signup", "Redirect alias to the canonical front-mirror signup page"),
            new MigrationRouteView("Legacy-compatible signup", "/pages/auth/signup.html", "Canonical front-mirror auth route"),
            new MigrationRouteView("Auth pass", "/auth/pass", "Redirect alias to the canonical front-mirror PASS auth page"),
            new MigrationRouteView("Legacy-compatible pass", "/pages/auth/pass_auth.html", "Canonical front-mirror auth route"),
            new MigrationRouteView("MyPage dashboard", "/mypage/dashboard", "Spring session-based mypage dashboard"),
            new MigrationRouteView("Legacy-compatible mypage", "/pages/mypage/dashboard.html", "Legacy route mapped to Spring mypage dashboard"),
            new MigrationRouteView("Travel activities", "/travel/activities", "First manually migrated jejustay travel page"),
            new MigrationRouteView("Legacy-compatible activities", "/jejustay/pages/travel/activities.html", "Legacy route mapped to Spring travel activities view"),
            new MigrationRouteView("Travel eSIM", "/travel/esim", "Static eSIM product landing migrated to Spring"),
            new MigrationRouteView("Legacy-compatible eSIM", "/jejustay/pages/travel/esim.html", "Legacy route mapped to Spring eSIM view"),
            new MigrationRouteView("Travel guide", "/travel/guide", "Static travel guide landing migrated to Spring"),
            new MigrationRouteView("Legacy-compatible guide", "/jejustay/pages/travel/travel_guide.html", "Legacy route mapped to Spring travel guide view"),
            new MigrationRouteView("Travel tips", "/travel/tips", "Static travel tips landing migrated to Spring"),
            new MigrationRouteView("Legacy-compatible tips", "/jejustay/pages/travel/travel_tips.html", "Legacy route mapped to Spring travel tips view"),
            new MigrationRouteView("Stay hotel list", "/stay/hotel-list", "Static hotel result list migrated to Spring"),
            new MigrationRouteView("Legacy-compatible hotel list", "/jejustay/pages/hotel/hotel-list.html", "Legacy route mapped to Spring hotel list view"),
            new MigrationRouteView("Deals main", "/deals", "Static deals landing migrated to Spring"),
            new MigrationRouteView("Legacy-compatible deals", "/jejustay/pages/deals/deals.html", "Legacy route mapped to Spring deals landing"),
            new MigrationRouteView("Deals member", "/deals/member", "Static member benefit page migrated to Spring"),
            new MigrationRouteView("Legacy-compatible deals member", "/jejustay/pages/deals/deals_member.html", "Legacy route mapped to Spring member deals"),
            new MigrationRouteView("Deals partner", "/deals/partner", "Static partner benefit page migrated to Spring"),
            new MigrationRouteView("Legacy-compatible deals partner", "/jejustay/pages/deals/deals_partner.html", "Legacy route mapped to Spring partner deals"),
            new MigrationRouteView("Readiness API", "/migration/readiness", "JSON summary for env and deployment readiness"),
            new MigrationRouteView("Actuator health", HEALTH_PATH, "Health probe for runtime and deployment checks")
        );
    }

    private MigrationConfigSectionView section(String title, List<MigrationConfigItemView> items) {
        int readyCount = (int) items.stream()
            .filter(MigrationConfigItemView::configured)
            .count();

        return new MigrationConfigSectionView(title, items, readyCount);
    }

    private MigrationConfigItemView item(String label, String sourceKey, String value) {
        return new MigrationConfigItemView(label, sourceKey, StringUtils.hasText(value));
    }

    private int countConfigured(List<MigrationConfigSectionView> sections) {
        return sections.stream()
            .mapToInt(MigrationConfigSectionView::readyCount)
            .sum();
    }

    private int countTotal(List<MigrationConfigSectionView> sections) {
        return sections.stream()
            .mapToInt(section -> section.items().size())
            .sum();
    }
}
