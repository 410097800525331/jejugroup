package com.jejugroup.jejuspring.weather.web;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.jejugroup.jejuspring.weather.WeatherRequestException;
import com.jejugroup.jejuspring.weather.WeatherService;
import com.jejugroup.jejuspring.weather.WeatherUnavailableException;
import com.jejugroup.jejuspring.weather.WeatherUpstreamException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(WeatherApiController.class)
class WeatherApiControllerTests {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private WeatherService weatherService;

    @Test
    void currentReturnsRawUpstreamPayloadOnSuccess() throws Exception {
        when(weatherService.forward(any(), any(), any(), any())).thenReturn("""
            {"name":"Jeju","coord":{"lon":126.5,"lat":33.5},"main":{"temp":19.1,"feels_like":18.3,"humidity":67},"weather":[{"icon":"03d","description":"구름많음"}],"wind":{"speed":4.1}}
            """);

        mockMvc.perform(get("/api/weather")
                .param("type", "current")
                .param("lat", "33.5")
                .param("lon", "126.5"))
            .andExpect(status().isOk())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(content().json("""
                {"name":"Jeju","coord":{"lon":126.5,"lat":33.5},"main":{"temp":19.1,"feels_like":18.3,"humidity":67},"weather":[{"icon":"03d","description":"구름많음"}],"wind":{"speed":4.1}}
                """));
    }

    @Test
    void searchReturnsBadRequestWhenRequestIsInvalid() throws Exception {
        when(weatherService.forward(any(), any(), any(), any()))
            .thenThrow(new WeatherRequestException());

        mockMvc.perform(get("/api/weather")
                .param("type", "search"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("날씨 서비스를 사용할 수 없습니다."));
    }

    @Test
    void statusReturnsServiceUnavailableWhenApiKeyIsMissing() throws Exception {
        when(weatherService.forward(any(), any(), any(), any()))
            .thenThrow(new WeatherUnavailableException());

        mockMvc.perform(get("/api/weather")
                .param("type", "current")
                .param("lat", "33.5")
                .param("lon", "126.5"))
            .andExpect(status().isServiceUnavailable())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("날씨 서비스를 사용할 수 없습니다."));
    }

    @Test
    void upstreamErrorsStayOpaque() throws Exception {
        when(weatherService.forward(any(), any(), any(), any()))
            .thenThrow(new WeatherUpstreamException());

        mockMvc.perform(get("/api/weather")
                .param("type", "pollution")
                .param("lat", "33.5")
                .param("lon", "126.5"))
            .andExpect(status().isBadGateway())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.message").value("날씨 서비스를 사용할 수 없습니다."));
    }
}
