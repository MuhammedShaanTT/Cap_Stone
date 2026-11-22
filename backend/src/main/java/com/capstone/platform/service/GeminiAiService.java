package com.capstone.platform.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;

/**
 * Gemini AI Service — integrates with Google Gemini API for intelligent
 * vulnerability remediation suggestions and root cause analysis.
 */
@Service
public class GeminiAiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiAiService.class);

    private final String apiKey;
    private final String modelId;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public GeminiAiService(
            @Value("${app.gemini.api-key:}") String apiKey,
            @Value("${app.gemini.model:gemini-2.0-flash}") String modelId) {
        this.apiKey = apiKey;
        this.modelId = modelId;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(15))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public boolean isAvailable() {
        return apiKey != null && !apiKey.isBlank();
    }

    /**
     * Generate an intelligent remediation suggestion for a security finding.
     */
    public String generateRemediation(String cweId, String title, String description, String location) {
        if (!isAvailable()) {
            return null; // Caller will use fallback
        }

        String prompt = String.format("""
            You are a senior mobile application security engineer. Analyze this vulnerability found in an Android application and provide a specific, actionable remediation.

            **Vulnerability Details:**
            - CWE ID: %s
            - Title: %s
            - Description: %s
            - Location: %s

            Provide a concise remediation (3-5 sentences max) that includes:
            1. What the developer should do to fix it
            2. A brief code snippet or configuration change if applicable
            3. Why this fix prevents the vulnerability

            Be specific to Android/mobile development. Do not include any markdown formatting.
            """, cweId, title, description, location);

        return callGemini(prompt);
    }

    /**
     * Generate an intelligent root cause analysis for a test failure.
     */
    public String generateRootCauseAnalysis(String errorMessage, String errorType, String environment) {
        if (!isAvailable()) {
            return null;
        }

        String prompt = String.format("""
            You are an expert in mobile test automation using Appium and UI Automator.
            Analyze this test failure and provide root cause analysis.

            **Failure Details:**
            - Error Message: %s
            - Error Type: %s
            - Test Environment: %s

            Provide:
            1. Most likely root cause (1-2 sentences)
            2. Recommended fix (2-3 sentences)
            3. How to prevent this in the future (1-2 sentences)

            Be concise and actionable. Do not include any markdown formatting.
            """, errorMessage, errorType, environment);

        return callGemini(prompt);
    }

    /**
     * Generate an overall quality assessment summary for the scan results.
     */
    public String generateQualitySummary(int criticalCount, int highCount, int mediumCount,
                                          boolean hasFailedTests, boolean hasHealingProposal) {
        if (!isAvailable()) {
            return null;
        }

        String prompt = String.format("""
            You are a mobile quality engineering lead reviewing an automated scan report.

            **Scan Results Summary:**
            - Critical vulnerabilities: %d
            - High severity issues: %d
            - Medium severity issues: %d
            - Has failed functional tests: %s
            - Has auto-healing proposals: %s

            Provide a brief executive summary (3-4 sentences) for the engineering team about:
            1. Overall quality assessment
            2. Whether this build is safe to release
            3. Priority actions to take

            Be direct and professional. Do not include any markdown formatting.
            """, criticalCount, highCount, mediumCount,
                hasFailedTests ? "Yes" : "No",
                hasHealingProposal ? "Yes" : "No");

        return callGemini(prompt);
    }

    private String callGemini(String prompt) {
        try {
            String url = String.format(
                    "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                    modelId, apiKey);

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(Map.of("text", prompt)))
                    ),
                    "generationConfig", Map.of(
                            "temperature", 0.3,
                            "maxOutputTokens", 500,
                            "topP", 0.8
                    )
            );

            String jsonBody = objectMapper.writeValueAsString(requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .timeout(Duration.ofSeconds(30))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                JsonNode candidates = root.path("candidates");
                if (candidates.isArray() && !candidates.isEmpty()) {
                    JsonNode content = candidates.get(0).path("content").path("parts");
                    if (content.isArray() && !content.isEmpty()) {
                        String text = content.get(0).path("text").asText("");
                        log.info("Gemini AI response received ({} chars)", text.length());
                        return text.trim();
                    }
                }
                log.warn("Gemini API returned 200 but no usable text in response");
            } else {
                log.warn("Gemini API returned status {}: {}", response.statusCode(),
                        response.body().substring(0, Math.min(200, response.body().length())));
            }
        } catch (Exception e) {
            log.warn("Gemini API call failed (will use fallback): {}", e.getMessage());
        }
        return null;
    }
}
