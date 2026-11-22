package com.capstone.platform.dto.testrun;

import java.time.Instant;
import java.util.List;

/**
 * Test run response DTO.
 */
public record TestRunResponse(
        String id,
        String testCaseId,
        String appVersionId,
        String pipelineRunId,
        String status,
        Instant startedAt,
        Instant completedAt,
        Long durationMs,
        String errorMessage,
        String errorType,
        List<String> artifactRefs,
        String executedBy,
        String environment
) {}
