package com.jejugroup.jejuspring.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.LocalTime;
import java.time.ZoneId;

@Component
public class HealthCheckScheduler {

    private static final Logger log = LoggerFactory.getLogger(HealthCheckScheduler.class);

    private final RestTemplate restTemplate;
    private final String baseUrl;

    public HealthCheckScheduler(RestTemplate restTemplate, @Value("${BASE_URL}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
    }

    @Scheduled(fixedRate = 14 * 60 * 1000) // 14분 간격
    public void pingSelf() {
        ZoneId seoul = ZoneId.of("Asia/Seoul");
        LocalTime now = LocalTime.now(seoul);

        // 오전 9시부터 오후 6시까지만 실행
        if (now.isBefore(LocalTime.of(9, 0)) || now.isAfter(LocalTime.of(18, 0))) {
            return;
        }

        try {
            String url = baseUrl + "/health-check";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("PING SUCCESS");
            } else {
                log.warn("PING FAIL: HTTP {}", response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("PING FAIL: {}", e.getMessage());
        }
    }
}