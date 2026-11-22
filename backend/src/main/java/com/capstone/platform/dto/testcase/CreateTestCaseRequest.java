package com.capstone.platform.dto.testcase;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

/**
 * Request payload for creating a test case.
 */
public record CreateTestCaseRequest(
        @NotBlank(message = "Test case name is required")
        String name,

        String category,

        List<String> preconditions,

        List<StepRequest> steps,

        List<String> expectedResults,

        String priority,

        String generatedBy,

        String appVersionId
) {
    public record StepRequest(
            int order,
            String action,
            String target,
            String value,
            String description
    ) {}
}
