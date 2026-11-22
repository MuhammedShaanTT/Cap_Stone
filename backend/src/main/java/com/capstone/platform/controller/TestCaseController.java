package com.capstone.platform.controller;

import com.capstone.platform.dto.testcase.CreateTestCaseRequest;
import com.capstone.platform.dto.testcase.TestCaseResponse;
import com.capstone.platform.service.TestCaseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Test case endpoints — create, list and retrieve test cases.
 */
@RestController
@Tag(name = "Test Cases", description = "Mobile test case authoring and management")
@SecurityRequirement(name = "bearerAuth")
public class TestCaseController {

    private final TestCaseService testCaseService;

    public TestCaseController(TestCaseService testCaseService) {
        this.testCaseService = testCaseService;
    }

    @PostMapping("/api/v1/projects/{projectId}/test-cases")
    @Operation(summary = "Create a new test case under a project")
    public ResponseEntity<TestCaseResponse> createTestCase(
            @PathVariable String projectId,
            @Valid @RequestBody CreateTestCaseRequest request) {
        TestCaseResponse response = testCaseService.createTestCase(projectId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/v1/projects/{projectId}/test-cases")
    @Operation(summary = "List all test cases for a project")
    public ResponseEntity<List<TestCaseResponse>> getTestCasesByProject(@PathVariable String projectId) {
        return ResponseEntity.ok(testCaseService.getTestCasesByProject(projectId));
    }

    @GetMapping("/api/v1/test-cases/{testCaseId}")
    @Operation(summary = "Get a test case by ID")
    public ResponseEntity<TestCaseResponse> getTestCase(@PathVariable String testCaseId) {
        return ResponseEntity.ok(testCaseService.getTestCase(testCaseId));
    }
}
