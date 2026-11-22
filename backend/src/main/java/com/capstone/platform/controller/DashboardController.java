package com.capstone.platform.controller;

import com.capstone.platform.dto.dashboard.DashboardResponse;
import com.capstone.platform.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

/**
 * Dashboard endpoints — aggregated platform metrics and summary stats.
 */
@RestController
@Tag(name = "Dashboard", description = "Aggregated quality, test and security analytics")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/api/v1/projects/{projectId}/dashboard")
    @Operation(summary = "Get aggregated metrics and dashboard stats for a project")
    public ResponseEntity<DashboardResponse> getDashboard(@PathVariable String projectId) {
        return ResponseEntity.ok(dashboardService.getDashboard(projectId));
    }
}
