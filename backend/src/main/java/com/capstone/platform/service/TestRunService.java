package com.capstone.platform.service;

import com.capstone.platform.dto.testrun.CreateTestRunRequest;
import com.capstone.platform.dto.testrun.TestRunResponse;
import com.capstone.platform.exception.ResourceNotFoundException;
import com.capstone.platform.model.TestRun;
import com.capstone.platform.repository.TestCaseRepository;
import com.capstone.platform.repository.TestRunRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

/**
 * TestRun service — create and list test runs under a test case.
 */
@Service
public class TestRunService {

    private final TestRunRepository testRunRepository;
    private final TestCaseRepository testCaseRepository;

    public TestRunService(TestRunRepository testRunRepository,
                          TestCaseRepository testCaseRepository) {
        this.testRunRepository = testRunRepository;
        this.testCaseRepository = testCaseRepository;
    }

    public TestRunResponse createTestRun(String testCaseId, CreateTestRunRequest request) {
        if (!testCaseRepository.existsById(testCaseId)) {
            throw new ResourceNotFoundException("TestCase", testCaseId);
        }

        TestRun testRun = TestRun.builder()
                .testCaseId(testCaseId)
                .appVersionId(request.appVersionId())
                .pipelineRunId(request.pipelineRunId())
                .status("QUEUED")
                .startedAt(Instant.now())
                .executedBy(request.executedBy())
                .environment(request.environment())
                .build();

        testRun = testRunRepository.save(testRun);
        return toResponse(testRun);
    }

    public List<TestRunResponse> getTestRunsByTestCase(String testCaseId) {
        return testRunRepository.findByTestCaseId(testCaseId).stream()
                .map(this::toResponse)
                .toList();
    }

    public TestRunResponse getTestRun(String testRunId) {
        TestRun testRun = testRunRepository.findById(testRunId)
                .orElseThrow(() -> new ResourceNotFoundException("TestRun", testRunId));
        return toResponse(testRun);
    }

    private TestRunResponse toResponse(TestRun tr) {
        return new TestRunResponse(
                tr.getId(),
                tr.getTestCaseId(),
                tr.getAppVersionId(),
                tr.getPipelineRunId(),
                tr.getStatus(),
                tr.getStartedAt(),
                tr.getCompletedAt(),
                tr.getDurationMs(),
                tr.getErrorMessage(),
                tr.getErrorType(),
                tr.getArtifactRefs(),
                tr.getExecutedBy(),
                tr.getEnvironment()
        );
    }
}
