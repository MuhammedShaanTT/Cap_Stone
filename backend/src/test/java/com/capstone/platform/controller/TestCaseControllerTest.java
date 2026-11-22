package com.capstone.platform.controller;

import com.capstone.platform.dto.testcase.CreateTestCaseRequest;
import com.capstone.platform.dto.testcase.TestCaseResponse;
import com.capstone.platform.service.TestCaseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

class TestCaseControllerTest {

    @Mock
    private TestCaseService testCaseService;

    @InjectMocks
    private TestCaseController testCaseController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createTestCase_shouldReturnCreated() {
        String projectId = "proj-1";
        CreateTestCaseRequest request = new CreateTestCaseRequest(
                "Login Flow", "FUNCTIONAL", List.of("App installed"),
                List.of(), List.of("Dashboard shown"), "HIGH", "MANUAL", "v1"
        );
        TestCaseResponse mockResponse = new TestCaseResponse(
                "tc-1", projectId, "v1", "Login Flow", "FUNCTIONAL",
                List.of("App installed"), List.of(), List.of("Dashboard shown"),
                "HIGH", "MANUAL", "APPROVED", Instant.now()
        );

        when(testCaseService.createTestCase(eq(projectId), any(CreateTestCaseRequest.class)))
                .thenReturn(mockResponse);

        ResponseEntity<TestCaseResponse> response = testCaseController.createTestCase(projectId, request);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Login Flow", response.getBody().name());
    }

    @Test
    void getTestCase_shouldReturnOk() {
        String testCaseId = "tc-1";
        TestCaseResponse mockResponse = new TestCaseResponse(
                testCaseId, "proj-1", "v1", "Login Flow", "FUNCTIONAL",
                List.of(), List.of(), List.of(), "HIGH", "MANUAL", "APPROVED", Instant.now()
        );

        when(testCaseService.getTestCase(testCaseId)).thenReturn(mockResponse);

        ResponseEntity<TestCaseResponse> response = testCaseController.getTestCase(testCaseId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(testCaseId, response.getBody().id());
    }
}
