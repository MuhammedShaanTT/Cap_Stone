package com.capstone.platform.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI/Swagger configuration — defines the API metadata and JWT security scheme.
 */
@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Mobile AI Quality Platform API",
                version = "0.1.0",
                description = "AI-Driven Autonomous Mobile Application Testing, Vulnerability Assessment, and Self-Healing CI/CD Platform"
        )
)
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class OpenApiConfig {
}
