package com.capstone.platform.controller;

import com.capstone.platform.dto.testrun.CreateTestRunRequest;
import com.capstone.platform.dto.testrun.TestRunResponse;
import com.capstone.platform.service.TestRunService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Test run endpoints — trigger and inspect test execution runs.
 */
@RestController
@Tag(name = "Test Runs", description = "Mobile test execution and status tracking")
@SecurityRequirement(name = "bearerAuth")
public class TestRunController {

    private final TestRunService testRunService;

    public TestRunController(TestRunService testRunService) {
        this.testRunService = testRunService;
    }

    @PostMapping("/api/v1/test-cases/{testCaseId}/test-runs")
    @Operation(summary = "Queue a test execution run for a test case")
    public ResponseEntity<TestRunResponse> createTestRun(
            @PathVariable String testCaseId,
            @Valid @RequestBody CreateTestRunRequest request) {
        TestRunResponse response = testRunService.createTestRun(testCaseId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/v1/test-cases/{testCaseId}/test-runs")
    @Operation(summary = "List test runs for a test case")
    public ResponseEntity<List<TestRunResponse>> getTestRunsByTestCase(@PathVariable String testCaseId) {
        return ResponseEntity.ok(testRunService.getTestRunsByTestCase(testCaseId));
    }

    @GetMapping("/api/v1/test-runs/{testRunId}")
    @Operation(summary = "Get test run details and status by ID")
    public ResponseEntity<TestRunResponse> getTestRun(@PathVariable String testRunId) {
        return ResponseEntity.ok(testRunService.getTestRun(testRunId));
    }
}
