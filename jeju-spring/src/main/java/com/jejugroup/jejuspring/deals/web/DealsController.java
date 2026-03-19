package com.jejugroup.jejuspring.deals.web;

import java.util.Set;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.jejugroup.jejuspring.deals.application.DealsFactory;

@Controller
public class DealsController {
    private static final Set<String> SUPPORTED_SHELLS = Set.of("main", "stay", "air");

    private final DealsFactory dealsFactory;

    public DealsController(DealsFactory dealsFactory) {
        this.dealsFactory = dealsFactory;
    }

    @GetMapping({ "/deals", "/jejustay/pages/deals/deals.html" })
    public String deals(@RequestParam(name = "shell", required = false) String shell, Model model) {
        model.addAttribute("page", dealsFactory.buildMain(normalizeShell(shell)));
        return "deals/main";
    }

    @GetMapping({ "/deals/member", "/jejustay/pages/deals/deals_member.html" })
    public String member(@RequestParam(name = "shell", required = false) String shell, Model model) {
        model.addAttribute("page", dealsFactory.buildMember(normalizeShell(shell)));
        return "deals/member";
    }

    @GetMapping({ "/deals/partner", "/jejustay/pages/deals/deals_partner.html" })
    public String partner(@RequestParam(name = "shell", required = false) String shell, Model model) {
        model.addAttribute("page", dealsFactory.buildPartner(normalizeShell(shell)));
        return "deals/partner";
    }

    private String normalizeShell(String shell) {
        if (shell == null) {
            return "stay";
        }

        String normalized = shell.trim().toLowerCase();
        return SUPPORTED_SHELLS.contains(normalized) ? normalized : "stay";
    }
}
