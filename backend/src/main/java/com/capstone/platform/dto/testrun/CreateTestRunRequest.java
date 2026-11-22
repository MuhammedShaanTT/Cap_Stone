package com.capstone.platform.dto.testrun;

import jakarta.validation.constraints.NotBlank;

/**
 * Request payload for creating a test run.
 */
public record CreateTestRunRequest(
        @NotBlank(message = "App version ID is required")
        String appVersionId,

        String pipelineRunId,

        String executedBy,

        String environment
) {}
