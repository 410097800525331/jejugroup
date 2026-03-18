package com.jejugroup.jejuspring.migration.view;

import java.util.List;

public record MigrationDashboardView(
    String sharedEnvPath,
    List<String> notes,
    String remoteDeployPath,
    String healthPath,
    int configuredCount,
    int totalConfigCount,
    List<MigrationConfigSectionView> configSections,
    List<MigrationRouteView> routes
) {
}
