package com.capstone.platform.service;

import com.capstone.platform.dto.pipelinerun.CreatePipelineRunRequest;
import com.capstone.platform.dto.pipelinerun.PipelineRunResponse;
import com.capstone.platform.exception.ResourceNotFoundException;
import com.capstone.platform.model.PipelineRun;
import com.capstone.platform.repository.PipelineRunRepository;
import com.capstone.platform.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

/**
 * PipelineRun service — create and list pipeline runs under a project.
 */
@Service
public class PipelineRunService {

    private final PipelineRunRepository pipelineRunRepository;
    private final ProjectRepository projectRepository;

    public PipelineRunService(PipelineRunRepository pipelineRunRepository,
                              ProjectRepository projectRepository) {
        this.pipelineRunRepository = pipelineRunRepository;
        this.projectRepository = projectRepository;
    }

    public PipelineRunResponse createPipelineRun(String projectId, CreatePipelineRunRequest request) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project", projectId);
        }

        PipelineRun pipelineRun = PipelineRun.builder()
                .projectId(projectId)
                .commitSha(request.commitSha())
                .branch(request.branch())
                .triggerType(request.triggerType() != null ? request.triggerType() : "MANUAL")
                .status("PENDING")
                .startedAt(Instant.now())
                .build();

        pipelineRun = pipelineRunRepository.save(pipelineRun);
        return toResponse(pipelineRun);
    }

    public List<PipelineRunResponse> getPipelineRunsByProject(String projectId) {
        return pipelineRunRepository.findByProjectId(projectId).stream()
                .map(this::toResponse)
                .toList();
    }

    public PipelineRunResponse getPipelineRun(String pipelineRunId) {
        PipelineRun pr = pipelineRunRepository.findById(pipelineRunId)
                .orElseThrow(() -> new ResourceNotFoundException("PipelineRun", pipelineRunId));
        return toResponse(pr);
    }

    private PipelineRunResponse toResponse(PipelineRun pr) {
        return new PipelineRunResponse(
                pr.getId(),
                pr.getProjectId(),
                pr.getCommitSha(),
                pr.getBranch(),
                pr.getTriggerType(),
                pr.getStatus(),
                pr.getTestRunCount(),
                pr.getTestPassCount(),
                pr.getScanCount(),
                pr.getCriticalFindings(),
                pr.getStartedAt(),
                pr.getCompletedAt(),
                pr.getDurationMs()
        );
    }
}
