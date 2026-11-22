package com.capstone.platform.dto.quality;

import java.util.List;

/**
 * Aggregated response representing the outcome of automated defect and quality analysis.
 * Includes optional Gemini AI enhancements (executive summary and intelligent remediation).
 */
public record QualityAnalysisResponse(
        String projectId,
        String appVersionId,
        String scanId,
        String analysisId,
        String proposalId,
        double riskScore,
        String riskLevel,
        String recommendation,
        List<FindingSummary> securityFindings,
        FailureSummary failureAnalysis,
        HealingSummary healingProposal,
        String aiQualitySummary,
        boolean aiPowered
) {
    public QualityAnalysisResponse(
            String projectId,
            String appVersionId,
            String scanId,
            String analysisId,
            String proposalId,
            double riskScore,
            String riskLevel,
            String recommendation,
            List<FindingSummary> securityFindings,
            FailureSummary failureAnalysis,
            HealingSummary healingProposal
    ) {
        this(projectId, appVersionId, scanId, analysisId, proposalId,
             riskScore, riskLevel, recommendation,
             securityFindings, failureAnalysis, healingProposal, null, false);
    }

    public record FindingSummary(
            String id,
            String ruleId,
            String title,
            String severity,
            String cweId,
            String location,
            String description,
            String remediation
    ) {}

    public record FailureSummary(
            String id,
            String testRunId,
            String category,
            String hypothesis,
            String modelId,
            double confidence
    ) {}

    public record HealingSummary(
            String id,
            String oldLocator,
            String proposedLocator,
            double confidence,
            String status,
            String patchDiff
    ) {}
}
