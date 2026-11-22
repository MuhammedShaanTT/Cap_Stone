package com.capstone.platform.service;

import com.capstone.platform.dto.dashboard.DashboardResponse;
import com.capstone.platform.exception.ResourceNotFoundException;
import com.capstone.platform.repository.*;
import org.springframework.stereotype.Service;

/**
 * Dashboard service — aggregated counts for a project.
 */
@Service
public class DashboardService {

    private final ProjectRepository projectRepository;
    private final AppVersionRepository appVersionRepository;
    private final TestCaseRepository testCaseRepository;
    private final TestRunRepository testRunRepository;
    private final PipelineRunRepository pipelineRunRepository;
    private final SecurityScanRepository securityScanRepository;

    public DashboardService(ProjectRepository projectRepository,
                            AppVersionRepository appVersionRepository,
                            TestCaseRepository testCaseRepository,
                            TestRunRepository testRunRepository,
                            PipelineRunRepository pipelineRunRepository,
                            SecurityScanRepository securityScanRepository) {
        this.projectRepository = projectRepository;
        this.appVersionRepository = appVersionRepository;
        this.testCaseRepository = testCaseRepository;
        this.testRunRepository = testRunRepository;
        this.pipelineRunRepository = pipelineRunRepository;
        this.securityScanRepository = securityScanRepository;
    }

    public DashboardResponse getDashboard(String projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project", projectId);
        }

        long appVersionCount = appVersionRepository.findByProjectId(projectId).size();
        long testCaseCount = testCaseRepository.findByProjectId(projectId).size();

        // Collect all test runs for test cases in this project
        var testCases = testCaseRepository.findByProjectId(projectId);
        long testRunCount = 0;
        long testRunPassedCount = 0;
        long testRunFailedCount = 0;

        for (var tc : testCases) {
            var runs = testRunRepository.findByTestCaseId(tc.getId());
            testRunCount += runs.size();
            testRunPassedCount += runs.stream().filter(r -> "PASSED".equals(r.getStatus())).count();
            testRunFailedCount += runs.stream().filter(r -> "FAILED".equals(r.getStatus())).count();
        }

        long pipelineRunCount = pipelineRunRepository.findByProjectId(projectId).size();
        long securityScanCount = securityScanRepository.findByProjectId(projectId).size();

        return new DashboardResponse(
                projectId,
                appVersionCount,
                testCaseCount,
                testRunCount,
                testRunPassedCount,
                testRunFailedCount,
                pipelineRunCount,
                securityScanCount
        );
    }
}
