package com.jejugroup.jejuspring.weather;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.test.web.client.ExpectedCount;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jejugroup.jejuspring.config.AppProperties;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class WeatherServiceTests {
    @Test
    void forwardCurrentProxiesOpenWeatherCurrentJson() {
        RestTemplate restTemplate = new RestTemplate(new SimpleClientHttpRequestFactory());
        MockRestServiceServer server = MockRestServiceServer.bindTo(restTemplate).build();

        WeatherService weatherService = new WeatherService(
            new AppProperties(null, null, null, new AppProperties.External("test-openweather-key", ""), null, null, null),
            new ObjectMapper(),
            restTemplate
        );

        server.expect(ExpectedCount.once(), requestTo("https://api.openweathermap.org/data/2.5/weather?lat=33.5&lon=126.5&appid=test-openweather-key&units=metric&lang=kr"))
            .andExpect(method(org.springframework.http.HttpMethod.GET))
            .andRespond(withSuccess("""
                {"name":"Jeju","coord":{"lon":126.5,"lat":33.5},"main":{"temp":19.1,"feels_like":18.3,"humidity":67},"weather":[{"icon":"03d","description":"구름많음"}],"wind":{"speed":4.1}}
                """, MediaType.APPLICATION_JSON));

        String result = weatherService.forward("current", "33.5", "126.5", null);

        assertThat(result).contains("\"name\":\"Jeju\"");
        server.verify();
    }

    @Test
    void forwardPollutionProxiesOpenWeatherAirPollutionJson() {
        RestTemplate restTemplate = new RestTemplate(new SimpleClientHttpRequestFactory());
        MockRestServiceServer server = MockRestServiceServer.bindTo(restTemplate).build();

        WeatherService weatherService = new WeatherService(
            new AppProperties(null, null, null, new AppProperties.External("test-openweather-key", ""), null, null, null),
            new ObjectMapper(),
            restTemplate
        );

        server.expect(ExpectedCount.once(), requestTo("https://api.openweathermap.org/data/2.5/air_pollution?lat=33.5&lon=126.5&appid=test-openweather-key"))
            .andExpect(method(org.springframework.http.HttpMethod.GET))
            .andRespond(withSuccess("""
                {"list":[{"main":{"aqi":2}}]}
                """, MediaType.APPLICATION_JSON));

        String result = weatherService.forward("pollution", "33.5", "126.5", null);

        assertThat(result).contains("\"aqi\":2");
        server.verify();
    }

    @Test
    void forwardSearchProxiesOpenWeatherCurrentJsonByCityName() {
        RestTemplate restTemplate = new RestTemplate(new SimpleClientHttpRequestFactory());
        MockRestServiceServer server = MockRestServiceServer.bindTo(restTemplate).build();

        WeatherService weatherService = new WeatherService(
            new AppProperties(null, null, null, new AppProperties.External("test-openweather-key", ""), null, null, null),
            new ObjectMapper(),
            restTemplate
        );

        server.expect(ExpectedCount.once(), requestTo("https://api.openweathermap.org/data/2.5/weather?q=Jeju&appid=test-openweather-key&units=metric&lang=kr"))
            .andExpect(method(org.springframework.http.HttpMethod.GET))
            .andRespond(withSuccess("""
                {"name":"Jeju","coord":{"lon":126.5,"lat":33.5},"main":{"temp":20.0,"feels_like":19.0,"humidity":60},"weather":[{"icon":"01d","description":"맑음"}],"wind":{"speed":3.2}}
                """, MediaType.APPLICATION_JSON));

        String result = weatherService.forward("search", null, null, "Jeju");

        assertThat(result).contains("\"coord\"");
        server.verify();
    }

    @Test
    void forwardRejectsMissingApiKeySafely() {
        RestTemplate restTemplate = new RestTemplate(new SimpleClientHttpRequestFactory());
        WeatherService weatherService = new WeatherService(
            new AppProperties(null, null, null, new AppProperties.External("", ""), null, null, null),
            new ObjectMapper(),
            restTemplate
        );

        assertThat(weatherService.isConfigured()).isFalse();
        assertThatThrownBy(() -> weatherService.forward("current", "33.5", "126.5", null))
            .isInstanceOf(WeatherUnavailableException.class);
    }
}
