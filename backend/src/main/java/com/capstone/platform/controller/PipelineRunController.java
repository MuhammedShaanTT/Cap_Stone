package com.capstone.platform.controller;

import com.capstone.platform.dto.pipelinerun.CreatePipelineRunRequest;
import com.capstone.platform.dto.pipelinerun.PipelineRunResponse;
import com.capstone.platform.service.PipelineRunService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CI/CD Pipeline run endpoints — trigger and monitor automated pipelines.
 */
@RestController
@Tag(name = "Pipeline Runs", description = "CI/CD pipeline runs and execution history")
@SecurityRequirement(name = "bearerAuth")
public class PipelineRunController {

    private final PipelineRunService pipelineRunService;

    public PipelineRunController(PipelineRunService pipelineRunService) {
        this.pipelineRunService = pipelineRunService;
    }

    @PostMapping("/api/v1/projects/{projectId}/pipeline-runs")
    @Operation(summary = "Trigger a new CI/CD pipeline run")
    public ResponseEntity<PipelineRunResponse> createPipelineRun(
            @PathVariable String projectId,
            @Valid @RequestBody CreatePipelineRunRequest request) {
        PipelineRunResponse response = pipelineRunService.createPipelineRun(projectId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/v1/projects/{projectId}/pipeline-runs")
    @Operation(summary = "List all pipeline runs for a project")
    public ResponseEntity<List<PipelineRunResponse>> getPipelineRunsByProject(@PathVariable String projectId) {
        return ResponseEntity.ok(pipelineRunService.getPipelineRunsByProject(projectId));
    }

    @GetMapping("/api/v1/pipeline-runs/{pipelineRunId}")
    @Operation(summary = "Get pipeline run details by ID")
    public ResponseEntity<PipelineRunResponse> getPipelineRun(@PathVariable String pipelineRunId) {
        return ResponseEntity.ok(pipelineRunService.getPipelineRun(pipelineRunId));
    }
}
