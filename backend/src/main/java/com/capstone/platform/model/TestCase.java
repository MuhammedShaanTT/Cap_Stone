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
 * Test case — structured test definition (manual or AI-generated).
 * Steps are embedded as a bounded array rather than arbitrary scripts.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "test_cases")
public class TestCase {

    @Id
    private String id;

    @Indexed
    private String projectId;

    @Indexed
    private String appVersionId;

    private String name;

    private String category;          // SMOKE, REGRESSION, FUNCTIONAL, SECURITY

    @Builder.Default
    private List<String> preconditions = List.of();

    @Builder.Default
    private List<TestStep> steps = List.of();

    @Builder.Default
    private List<String> expectedResults = List.of();

    private String priority;          // CRITICAL, HIGH, MEDIUM, LOW

    private String generatedBy;       // MANUAL, AI_GENERATED, HYBRID

    private String modelId;           // LLM model used for generation
    private String promptVersion;     // Prompt template version

    @Builder.Default
    private String status = "CANDIDATE"; // CANDIDATE, APPROVED, ARCHIVED

    @CreatedDate
    private Instant createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TestStep {
        private int order;
        private String action;        // CLICK, TYPE, SWIPE, ASSERT, WAIT
        private String target;        // Locator strategy + value
        private String value;         // Input value if applicable
        private String description;
    }
}
