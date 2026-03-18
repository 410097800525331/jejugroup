package com.jejugroup.jejuspring.web;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;

import com.jejugroup.jejuspring.config.AppProperties;
import com.jejugroup.jejuspring.web.view.ConfigItemView;
import com.jejugroup.jejuspring.web.view.ConfigSectionView;

@Controller
public class HomeController {
    private final AppProperties appProperties;

    public HomeController(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    @GetMapping({ "/", "/migration" })
    public String dashboard(Model model) {
        model.addAttribute("configSections", buildConfigSections());
        model.addAttribute("sharedEnvPath", appProperties.migration().sharedEnvPath());
        model.addAttribute("notes", appProperties.migration().notes());
        model.addAttribute("remoteDeployPath", appProperties.alwaysdata().remoteDeployPath());
        model.addAttribute("healthPath", "/actuator/health");
        return "migration/dashboard";
    }

    private List<ConfigSectionView> buildConfigSections() {
        AppProperties.Alwaysdata alwaysdata = appProperties.alwaysdata();
        AppProperties.External external = appProperties.external();
        AppProperties.Social social = appProperties.social();

        return List.of(
            new ConfigSectionView(
                "Alwaysdata deploy",
                List.of(
                    item("DB URL", "ALWAYSDATA_DB_URL", alwaysdata.dbUrl()),
                    item("DB user", "ALWAYSDATA_DB_USER", alwaysdata.dbUser()),
                    item("SSH host", "ALWAYSDATA_SSH_HOST / SSH_HOST", alwaysdata.sshHost()),
                    item("SSH user", "ALWAYSDATA_SSH_USER / SSH_USER", alwaysdata.sshUser()),
                    item("Remote deploy path", "REMOTE_DEPLOY_PATH", alwaysdata.remoteDeployPath())
                )
            ),
            new ConfigSectionView(
                "Admin and runtime",
                List.of(
                    item("Admin email", "ALWAYSDATA_ADMIN_EMAIL / ADMIN_EMAIL", alwaysdata.adminEmail()),
                    item("Admin password", "ALWAYSDATA_ADMIN_PASSWORD / ADMIN_PASSWORD", alwaysdata.adminPassword()),
                    item("OpenWeather key", "OPENWEATHER_API_KEY", external.openweatherApiKey()),
                    item("OpenAI key", "OPENAI_API_KEY", external.openaiApiKey())
                )
            ),
            new ConfigSectionView(
                "Social login",
                List.of(
                    item("Naver client id", "NAVER_CLIENT_ID", social.naverClientId()),
                    item("Naver client secret", "NAVER_CLIENT_SECRET", social.naverClientSecret()),
                    item("Kakao JS key", "KAKAO_JS_KEY", social.kakaoJsKey())
                )
            )
        );
    }

    private ConfigItemView item(String label, String sourceKey, String value) {
        return new ConfigItemView(label, sourceKey, StringUtils.hasText(value));
    }
}
