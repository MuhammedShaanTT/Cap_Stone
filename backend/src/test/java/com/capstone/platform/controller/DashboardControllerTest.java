package com.capstone.platform.controller;

import com.capstone.platform.dto.dashboard.DashboardResponse;
import com.capstone.platform.service.DashboardService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

class DashboardControllerTest {

    @Mock
    private DashboardService dashboardService;

    @InjectMocks
    private DashboardController dashboardController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getDashboard_shouldReturnAggregatedStats() {
        String projectId = "proj-123";
        DashboardResponse mockResponse = new DashboardResponse(
                projectId, 2L, 5L, 10L, 8L, 2L, 3L, 1L
        );

        when(dashboardService.getDashboard(projectId)).thenReturn(mockResponse);

        ResponseEntity<DashboardResponse> response = dashboardController.getDashboard(projectId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(projectId, response.getBody().projectId());
        assertEquals(2L, response.getBody().appVersionCount());
        assertEquals(5L, response.getBody().testCaseCount());
        assertEquals(8L, response.getBody().testRunPassedCount());
    }
}
