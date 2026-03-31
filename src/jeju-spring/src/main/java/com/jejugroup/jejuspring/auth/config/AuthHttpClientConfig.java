package com.jejugroup.jejuspring.auth.config;

import java.net.http.HttpClient;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AuthHttpClientConfig {
    @Bean
    public HttpClient naverAuthHttpClient() {
        return HttpClient.newHttpClient();
    }
}
