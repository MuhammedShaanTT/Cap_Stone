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
 * Release assessment — explainable risk score based on verified evidence.
 * Score factors are transparent; policy version is recorded.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "release_assessments")
public class ReleaseAssessment {

    @Id
    private String id;

    @Indexed
    private String pipelineRunId;

    private double riskScore;         // 0.0 (safe) to 1.0 (high risk)

    private String riskLevel;         // LOW, MEDIUM, HIGH, CRITICAL

    @Builder.Default
    private List<RiskFactor> factors = List.of();

    private String recommendation;    // RELEASE, HOLD, REJECT
    private String policyVersion;

    private String approvedBy;
    private Instant decidedAt;
    private String decision;          // APPROVED, REJECTED, DEFERRED

    @CreatedDate
    private Instant createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RiskFactor {
        private String name;
        private double weight;
        private double value;
        private String description;
    }
}
