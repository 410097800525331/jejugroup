package com.jejugroup.jejuspring.stay.application;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

@Service
public class StayHotelListQueryService {
    private static final Set<String> SUPPORTED_SHELLS = Set.of("main", "stay", "air");

    public StayHotelListPageRequest normalize(
        String shell,
        String region,
        String keyword,
        String checkIn,
        String checkOut,
        int adults,
        int children,
        int rooms,
        List<String> filters
    ) {
        return new StayHotelListPageRequest(
            normalizeShell(shell),
            new StayHotelListQuery(
                region,
                keyword,
                checkIn,
                checkOut,
                Math.max(1, adults),
                Math.max(0, children),
                Math.max(1, rooms),
                filters
            )
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
