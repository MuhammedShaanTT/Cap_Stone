package com.capstone.platform.dto.pipelinerun;

import jakarta.validation.constraints.NotBlank;

/**
 * Request payload for creating a pipeline run.
 */
public record CreatePipelineRunRequest(
        String commitSha,

        String branch,

        String triggerType
) {}
