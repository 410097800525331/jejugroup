package com.jejugroup.jejuspring.migration.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jejugroup.jejuspring.migration.application.MigrationDashboardFactory;
import com.jejugroup.jejuspring.migration.view.MigrationDashboardView;
import com.jejugroup.jejuspring.migration.view.MigrationReadinessView;

@Controller
public class MigrationController {
    private final MigrationDashboardFactory migrationDashboardFactory;

    public MigrationController(MigrationDashboardFactory migrationDashboardFactory) {
        this.migrationDashboardFactory = migrationDashboardFactory;
    }

    @GetMapping("/migration")
    public String dashboard(Model model) {
        MigrationDashboardView dashboard = migrationDashboardFactory.buildDashboard();
        model.addAttribute("dashboard", dashboard);
        return "migration/dashboard";
    }

    @ResponseBody
    @GetMapping("/migration/readiness")
    public MigrationReadinessView readiness() {
        return migrationDashboardFactory.buildReadiness();
    }
}
