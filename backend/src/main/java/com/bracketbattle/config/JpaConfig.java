package com.bracketbattle.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.client.RestTemplate;

@Configuration
@EnableJpaAuditing
@EnableJpaRepositories(
    basePackages = "com.bracketbattle.modules"
)
public class JpaConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

}