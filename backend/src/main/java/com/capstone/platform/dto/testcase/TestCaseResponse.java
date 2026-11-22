package com.capstone.platform.dto.testcase;

import java.time.Instant;
import java.util.List;

/**
 * Test case response DTO.
 */
public record TestCaseResponse(
        String id,
        String projectId,
        String appVersionId,
        String name,
        String category,
        List<String> preconditions,
        List<StepInfo> steps,
        List<String> expectedResults,
        String priority,
        String generatedBy,
        String status,
        Instant createdAt
) {
    public record StepInfo(
            int order,
            String action,
            String target,
            String value,
            String description
    ) {}
}
