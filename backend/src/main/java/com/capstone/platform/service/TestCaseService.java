package com.capstone.platform.service;

import com.capstone.platform.dto.testcase.CreateTestCaseRequest;
import com.capstone.platform.dto.testcase.TestCaseResponse;
import com.capstone.platform.exception.ResourceNotFoundException;
import com.capstone.platform.model.TestCase;
import com.capstone.platform.repository.ProjectRepository;
import com.capstone.platform.repository.TestCaseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * TestCase service — create and list test cases under a project.
 */
@Service
public class TestCaseService {

    private final TestCaseRepository testCaseRepository;
    private final ProjectRepository projectRepository;

    public TestCaseService(TestCaseRepository testCaseRepository,
                           ProjectRepository projectRepository) {
        this.testCaseRepository = testCaseRepository;
        this.projectRepository = projectRepository;
    }

    public TestCaseResponse createTestCase(String projectId, CreateTestCaseRequest request) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project", projectId);
        }

        List<TestCase.TestStep> steps = request.steps() == null
                ? List.of()
                : request.steps().stream()
                    .map(s -> TestCase.TestStep.builder()
                            .order(s.order())
                            .action(s.action())
                            .target(s.target())
                            .value(s.value())
                            .description(s.description())
                            .build())
                    .toList();

        TestCase testCase = TestCase.builder()
                .projectId(projectId)
                .appVersionId(request.appVersionId())
                .name(request.name())
                .category(request.category())
                .preconditions(request.preconditions() != null ? request.preconditions() : List.of())
                .steps(steps)
                .expectedResults(request.expectedResults() != null ? request.expectedResults() : List.of())
                .priority(request.priority())
                .generatedBy(request.generatedBy())
                .build();

        testCase = testCaseRepository.save(testCase);
        return toResponse(testCase);
    }

    public List<TestCaseResponse> getTestCasesByProject(String projectId) {
        return testCaseRepository.findByProjectId(projectId).stream()
                .map(this::toResponse)
                .toList();
    }

    public TestCaseResponse getTestCase(String testCaseId) {
        TestCase testCase = testCaseRepository.findById(testCaseId)
                .orElseThrow(() -> new ResourceNotFoundException("TestCase", testCaseId));
        return toResponse(testCase);
    }

    private TestCaseResponse toResponse(TestCase tc) {
        List<TestCaseResponse.StepInfo> steps = tc.getSteps() == null
                ? List.of()
                : tc.getSteps().stream()
                    .map(s -> new TestCaseResponse.StepInfo(
                            s.getOrder(), s.getAction(), s.getTarget(),
                            s.getValue(), s.getDescription()))
                    .toList();

        return new TestCaseResponse(
                tc.getId(),
                tc.getProjectId(),
                tc.getAppVersionId(),
                tc.getName(),
                tc.getCategory(),
                tc.getPreconditions(),
                steps,
                tc.getExpectedResults(),
                tc.getPriority(),
                tc.getGeneratedBy(),
                tc.getStatus(),
                tc.getCreatedAt()
        );
    }
}
