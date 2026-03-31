package com.jejugroup.jejuspring.migration.view;

import java.util.List;

public record MigrationReadinessView(
    String sharedEnvPath,
    String remoteDeployPath,
    String healthPath,
    List<String> notes,
    int configuredCount,
    int totalConfigCount,
    List<MigrationSectionStatusView> sections
) {
}
