package com.jejugroup.jejuspring.weather;

import java.net.URI;
import java.time.Duration;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jejugroup.jejuspring.config.AppProperties;

@Service
public class WeatherService {
    private static final URI OPENWEATHER_CURRENT_URI = URI.create("https://api.openweathermap.org/data/2.5/weather");
    private static final URI OPENWEATHER_AIR_POLLUTION_URI = URI.create("https://api.openweathermap.org/data/2.5/air_pollution");
    private static final String DEFAULT_UNITS = "metric";
    private static final String DEFAULT_LANG = "kr";

    private final AppProperties appProperties;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    @Autowired
    public WeatherService(AppProperties appProperties, ObjectMapper objectMapper) {
        this(appProperties, objectMapper, createRestTemplate());
    }

    WeatherService(AppProperties appProperties, ObjectMapper objectMapper, RestTemplate restTemplate) {
        this.appProperties = appProperties;
        this.objectMapper = objectMapper;
        this.restTemplate = restTemplate;
    }

    public boolean isConfigured() {
        return StringUtils.hasText(resolveApiKey());
    }

    public String forward(String type, String lat, String lon, String q) {
        String apiKey = resolveApiKey();
        if (!StringUtils.hasText(apiKey)) {
            throw new WeatherUnavailableException();
        }

        String normalizedType = normalize(type);
        return switch (normalizedType) {
            case "current" -> forwardCurrent(apiKey, lat, lon);
            case "pollution" -> forwardPollution(apiKey, lat, lon);
            case "search" -> forwardSearch(apiKey, q);
            default -> throw new WeatherRequestException();
        };
    }

    private String forwardCurrent(String apiKey, String lat, String lon) {
        double latitude = parseCoordinate(lat);
        double longitude = parseCoordinate(lon);
        URI uri = uriBuilder(OPENWEATHER_CURRENT_URI)
            .queryParam("lat", latitude)
            .queryParam("lon", longitude)
            .queryParam("appid", apiKey)
            .queryParam("units", DEFAULT_UNITS)
            .queryParam("lang", DEFAULT_LANG)
            .encode()
            .build()
            .toUri();
        return fetchRawJson(uri);
    }

    private String forwardPollution(String apiKey, String lat, String lon) {
        double latitude = parseCoordinate(lat);
        double longitude = parseCoordinate(lon);
        URI uri = uriBuilder(OPENWEATHER_AIR_POLLUTION_URI)
            .queryParam("lat", latitude)
            .queryParam("lon", longitude)
            .queryParam("appid", apiKey)
            .encode()
            .build()
            .toUri();
        return fetchRawJson(uri);
    }

    private String forwardSearch(String apiKey, String q) {
        if (!StringUtils.hasText(q)) {
            throw new WeatherRequestException();
        }

        URI uri = uriBuilder(OPENWEATHER_CURRENT_URI)
            .queryParam("q", q.trim())
            .queryParam("appid", apiKey)
            .queryParam("units", DEFAULT_UNITS)
            .queryParam("lang", DEFAULT_LANG)
            .encode()
            .build()
            .toUri();
        return fetchRawJson(uri);
    }

    private String fetchRawJson(URI uri) {
        ResponseEntity<String> response;
        try {
            response = restTemplate.getForEntity(uri, String.class);
        } catch (RestClientException exception) {
            throw new WeatherUpstreamException();
        }

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new WeatherUpstreamException();
        }

        String body = response.getBody();
        if (!StringUtils.hasText(body)) {
            throw new WeatherUpstreamException();
        }

        try {
            objectMapper.readTree(body);
            return body;
        } catch (Exception exception) {
            throw new WeatherUpstreamException();
        }
    }

    private String resolveApiKey() {
        String configuredKey = normalizeApiKey(appProperties.external().openweatherApiKey());
        if (StringUtils.hasText(configuredKey)) {
            return configuredKey;
        }

        String envKey = normalizeApiKey(System.getenv("OPENWEATHER_API_KEY"));
        if (StringUtils.hasText(envKey)) {
            return envKey;
        }

        return normalizeApiKey(System.getProperty("OPENWEATHER_API_KEY"));
    }

    private String normalizeApiKey(String value) {
        return value == null ? "" : value.trim();
    }

    private static String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }

    private static double parseCoordinate(String value) {
        if (!StringUtils.hasText(value)) {
            throw new WeatherRequestException();
        }

        try {
            return Double.parseDouble(value.trim());
        } catch (NumberFormatException exception) {
            throw new WeatherRequestException();
        }
    }

    private static UriComponentsBuilder uriBuilder(URI uri) {
        return UriComponentsBuilder.fromUri(uri);
    }

    private static RestTemplate createRestTemplate() {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofSeconds(5));
        requestFactory.setReadTimeout(Duration.ofSeconds(15));
        return new RestTemplate(requestFactory);
    }
}
