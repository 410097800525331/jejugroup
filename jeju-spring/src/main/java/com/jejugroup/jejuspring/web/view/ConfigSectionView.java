package com.jejugroup.jejuspring.web.view;

import java.util.List;

public record ConfigSectionView(String title, List<ConfigItemView> items) {
}
