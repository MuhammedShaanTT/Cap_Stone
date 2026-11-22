package com.capstone.platform.dto.dashboard;

/**
 * Dashboard summary response DTO — aggregated counts for a project.
 * Supports both *Count and total* field names for seamless UI integration.
 */
public record DashboardResponse(
        String projectId,
        long appVersionCount,
        long testCaseCount,
        long testRunCount,
        long testRunPassedCount,
        long testRunFailedCount,
        long pipelineRunCount,
        long securityScanCount,
        long totalAppVersions,
        long totalTestCases,
        long totalSecurityScans
) {
    public DashboardResponse(String projectId,
                             long appVersionCount,
                             long testCaseCount,
                             long testRunCount,
                             long testRunPassedCount,
                             long testRunFailedCount,
                             long pipelineRunCount,
                             long securityScanCount) {
        this(projectId,
             appVersionCount,
             testCaseCount,
             testRunCount,
             testRunPassedCount,
             testRunFailedCount,
             pipelineRunCount,
             securityScanCount,
             appVersionCount,
             testCaseCount,
             securityScanCount);
    }
}
