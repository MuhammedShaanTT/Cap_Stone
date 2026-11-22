package com.capstone.platform.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.Instant;
import java.util.List;

/**
 * Failure analysis — AI-generated diagnosis of a failed test run.
 * Hypotheses are proposals, not confirmed causes.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "failure_analyses")
public class FailureAnalysis {

    @Id
    private String id;

    @Indexed
    private String testRunId;

    private String category;          // LOCATOR_CHANGE, LOGIC_ERROR, ENVIRONMENT, FLAKY, UNKNOWN

    @Builder.Default
    private List<String> evidenceRefs = List.of();

    @Builder.Default
    private List<Hypothesis> hypotheses = List.of();

    private String modelId;
    private String promptVersion;
    private Long latencyMs;
    private Integer tokenUsage;

    @CreatedDate
    private Instant createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Hypothesis {
        private String description;
        private double confidence;    // 0.0 to 1.0, routing signal only
        private String evidence;
        private String suggestedAction;
    }
}
