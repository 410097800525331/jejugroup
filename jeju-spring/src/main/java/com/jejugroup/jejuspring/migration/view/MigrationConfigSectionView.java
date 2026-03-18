package com.jejugroup.jejuspring.migration.view;

import java.util.List;

public record MigrationConfigSectionView(String title, List<MigrationConfigItemView> items, int readyCount) {
}
