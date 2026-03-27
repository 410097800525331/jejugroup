package com.jejugroup.jejuspring.mypage.application;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class MyPageItineraryService {
    public List<MyPageDashboardRepository.MyPageItinerarySnapshot> buildItinerary(
        String userId,
        List<MyPageDashboardRepository.MyPageTravelEventSnapshot> travelEvents
    ) {
        Map<String, List<MyPageDashboardRepository.MyPageTravelEventSnapshot>> groupedByDay = new LinkedHashMap<>();
        for (MyPageDashboardRepository.MyPageTravelEventSnapshot travelEvent : travelEvents) {
            String key = StringUtils.hasText(travelEvent.dayId()) ? travelEvent.dayId() : travelEvent.date() + "|" + travelEvent.time();
            groupedByDay.computeIfAbsent(key, ignored -> new ArrayList<>()).add(travelEvent);
        }

        List<MyPageDashboardRepository.MyPageItinerarySnapshot> itinerary = new ArrayList<>();
        for (List<MyPageDashboardRepository.MyPageTravelEventSnapshot> dayEvents : groupedByDay.values()) {
            if (dayEvents.isEmpty()) {
                continue;
            }

            MyPageDashboardRepository.MyPageTravelEventSnapshot first = dayEvents.getFirst();
            List<MyPageDashboardRepository.MyPageItineraryActivitySnapshot> activities = dayEvents.stream()
                .map(event -> new MyPageDashboardRepository.MyPageItineraryActivitySnapshot(
                    event.id(),
                    event.activityLabel(),
                    isCompletedTravelEvent(event.status()),
                    event.ownerId(),
                    event.ownerName(),
                    event.status(),
                    event.type()
                ))
                .toList();

            Map<String, MyPageDashboardRepository.MyPageItineraryCompanionSnapshot> companions = new LinkedHashMap<>();
            for (MyPageDashboardRepository.MyPageTravelEventSnapshot event : dayEvents) {
                if (!StringUtils.hasText(event.ownerId()) || userId.equals(event.ownerId())) {
                    continue;
                }

                if (!companions.containsKey(event.ownerId())) {
                    companions.put(
                        event.ownerId(),
                        new MyPageDashboardRepository.MyPageItineraryCompanionSnapshot(
                            event.ownerId(),
                            displayCompanionName(event.ownerName(), event.ownerId()),
                            true
                        )
                    );
                }
            }

            itinerary.add(new MyPageDashboardRepository.MyPageItinerarySnapshot(
                first.dayId().isBlank() ? first.id() : first.dayId(),
                first.date(),
                first.time().isBlank() ? "종일" : first.time(),
                first.title(),
                first.googleMapUrl(),
                activities,
                List.copyOf(companions.values())
            ));
        }

        return itinerary;
    }

    private boolean isCompletedTravelEvent(String status) {
        String normalized = normalizeTravelEventStatus(status);
        return "used".equals(normalized) || "cancelled".equals(normalized) || "missed".equals(normalized);
    }

    private String displayCompanionName(String ownerName, String ownerId) {
        if (StringUtils.hasText(ownerName)) {
            return ownerName;
        }
        return StringUtils.hasText(ownerId) ? ownerId : "동행자";
    }

    private String normalizeTravelEventStatus(String status) {
        if (!StringUtils.hasText(status)) {
            return "reserved";
        }
        return status.trim().toLowerCase(Locale.KOREA);
    }
}
