package com.capstone.platform.controller;

import com.capstone.platform.dto.securityscan.CreateSecurityScanRequest;
import com.capstone.platform.dto.securityscan.SecurityFindingResponse;
import com.capstone.platform.dto.securityscan.SecurityScanResponse;
import com.capstone.platform.service.SecurityScanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Security scan endpoints — initiate scans and review security posture.
 */
@RestController
@Tag(name = "Security Scans", description = "Vulnerability assessment and security scanning")
@SecurityRequirement(name = "bearerAuth")
public class SecurityScanController {

    private final SecurityScanService securityScanService;

    public SecurityScanController(SecurityScanService securityScanService) {
        this.securityScanService = securityScanService;
    }

    @PostMapping("/api/v1/projects/{projectId}/security-scans")
    @Operation(summary = "Start an authorized security scan")
    public ResponseEntity<SecurityScanResponse> createSecurityScan(
            @PathVariable String projectId,
            @Valid @RequestBody CreateSecurityScanRequest request) {
        SecurityScanResponse response = securityScanService.createSecurityScan(projectId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/v1/projects/{projectId}/security-scans")
    @Operation(summary = "List security scans for a project")
    public ResponseEntity<List<SecurityScanResponse>> getSecurityScansByProject(@PathVariable String projectId) {
        return ResponseEntity.ok(securityScanService.getSecurityScansByProject(projectId));
    }

    @GetMapping("/api/v1/security-scans/{scanId}")
    @Operation(summary = "Get security scan details by ID")
    public ResponseEntity<SecurityScanResponse> getSecurityScan(@PathVariable String scanId) {
        return ResponseEntity.ok(securityScanService.getSecurityScan(scanId));
    }
}
