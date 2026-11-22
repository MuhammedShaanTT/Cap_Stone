package com.capstone.platform.dto.pipelinerun;

import java.time.Instant;

/**
 * Pipeline run response DTO.
 */
public record PipelineRunResponse(
        String id,
        String projectId,
        String commitSha,
        String branch,
        String triggerType,
        String status,
        Integer testRunCount,
        Integer testPassCount,
        Integer scanCount,
        Integer criticalFindings,
        Instant startedAt,
        Instant completedAt,
        Long durationMs
) {}
