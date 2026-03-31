package com.jejugroup.jejuspring.weather.web;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jejugroup.jejuspring.weather.WeatherRequestException;
import com.jejugroup.jejuspring.weather.WeatherService;
import com.jejugroup.jejuspring.weather.WeatherUnavailableException;
import com.jejugroup.jejuspring.weather.WeatherUpstreamException;

@RestController
@RequestMapping("/api/weather")
public class WeatherApiController {
    private static final String OPAQUE_ERROR_MESSAGE = "날씨 서비스를 사용할 수 없습니다.";

    private final WeatherService weatherService;

    public WeatherApiController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> weather(
        @RequestParam(value = "type", required = false) String type,
        @RequestParam(value = "lat", required = false) String lat,
        @RequestParam(value = "lon", required = false) String lon,
        @RequestParam(value = "q", required = false) String q
    ) {
        try {
            String body = weatherService.forward(type, lat, lon, q);
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(body);
        } catch (WeatherUnavailableException exception) {
            return error(HttpStatus.SERVICE_UNAVAILABLE);
        } catch (WeatherRequestException exception) {
            return error(HttpStatus.BAD_REQUEST);
        } catch (WeatherUpstreamException exception) {
            return error(HttpStatus.BAD_GATEWAY);
        }
    }

    private ResponseEntity<Map<String, Object>> error(HttpStatus status) {
        return ResponseEntity.status(status).body(Map.of(
            "success", false,
            "message", OPAQUE_ERROR_MESSAGE
        ));
    }
}
