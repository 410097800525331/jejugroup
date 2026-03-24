package com.jejugroup.jejuspring.travel.web;

import java.util.Set;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.jejugroup.jejuspring.travel.application.TravelActivitiesFactory;
import com.jejugroup.jejuspring.travel.view.TravelStaticPageView;

@Controller
public class TravelController {
    private static final Set<String> SUPPORTED_SHELLS = Set.of("main", "stay", "air");

    private final TravelActivitiesFactory travelActivitiesFactory;

    public TravelController(TravelActivitiesFactory travelActivitiesFactory) {
        this.travelActivitiesFactory = travelActivitiesFactory;
    }

    @GetMapping({ "/travel/activities", "/jejustay/pages/travel/activities.html" })
    public String activities(
        @RequestParam(name = "shell", required = false) String shell,
        Model model
    ) {
        String resolvedShell = normalizeShell(shell);
        model.addAttribute("page", travelActivitiesFactory.build(resolvedShell));
        return "travel/activities";
    }

    @GetMapping({ "/travel/esim", "/jejustay/pages/travel/esim.html" })
    public String esim(
        @RequestParam(name = "shell", required = false) String shell,
        Model model
    ) {
        model.addAttribute("page", staticPage(normalizeShell(shell)));
        return "travel/esim";
    }

    @GetMapping({ "/travel/guide", "/jejustay/pages/travel/travel_guide.html" })
    public String guide(
        @RequestParam(name = "shell", required = false) String shell,
        Model model
    ) {
        model.addAttribute("page", staticPage(normalizeShell(shell)));
        return "travel/guide";
    }

    @GetMapping({ "/travel/tips", "/jejustay/pages/travel/travel_tips.html" })
    public String tips(
        @RequestParam(name = "shell", required = false) String shell,
        Model model
    ) {
        model.addAttribute("page", staticPage(normalizeShell(shell)));
        return "travel/tips";
    }

    private TravelStaticPageView staticPage(String shell) {
        return new TravelStaticPageView(
            shell,
            "/auth/login?shell=%s".formatted(shell),
            "/auth/pass?shell=%s".formatted(shell),
            "/migration"
        );
    }

    private String normalizeShell(String shell) {
        if (shell == null) {
            return "stay";
        }

        String normalized = shell.trim().toLowerCase();
        return SUPPORTED_SHELLS.contains(normalized) ? normalized : "stay";
    }
}
