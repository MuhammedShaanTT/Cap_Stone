package com.capstone.platform.dto.aiplan;

import com.capstone.platform.dto.testcase.TestCaseResponse;

import java.time.Instant;
import java.util.List;

/**
 * Aggregated response containing the AI-generated mobile test plan,
 * structured candidate test cases (persisted in MongoDB),
 * and architectural / security / UX improvements.
 */
public record AiTestPlanResponse(
        String projectId,
        String appVersionId,
        String appName,
        String packageName,
        String version,
        TestPlanDetails testPlan,
        List<TestCaseResponse> generatedTestCases,
        AppImprovements applicationImprovements,
        String modelUsed,
        Instant generatedAt,
        int persistedTestCasesCount
) {
    public record TestPlanDetails(
            String title,
            String executiveSummary,
            ScopeDetails scope,
            List<String> deviceMatrix,
            List<TestingPhase> testingPhases,
            List<String> exitCriteria
    ) {}

    public record ScopeDetails(
            List<String> inScope,
            List<String> outOfScope
    ) {}

    public record TestingPhase(
            String phase,
            String description
    ) {}

    public record AppImprovements(
            List<String> security,
            List<String> performance,
            List<String> uiUx,
            List<String> architecture
    ) {}
}
