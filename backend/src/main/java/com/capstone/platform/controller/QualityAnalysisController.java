package com.capstone.platform.controller;

import com.capstone.platform.dto.quality.QualityAnalysisResponse;
import com.capstone.platform.service.QualityAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for automated defect detection, failure analysis, and self-healing verification.
 */
@RestController
@RequestMapping("/api/v1/projects/{projectId}")
@Tag(name = "Automated Quality & Defect Analysis", description = "Autonomous mobile vulnerability detection, failure diagnosis, and self-healing engine")
@SecurityRequirement(name = "bearerAuth")
public class QualityAnalysisController {

    private final QualityAnalysisService qualityAnalysisService;

    public QualityAnalysisController(QualityAnalysisService qualityAnalysisService) {
        this.qualityAnalysisService = qualityAnalysisService;
    }

    @PostMapping("/run-quality-analysis")
    @Operation(summary = "Trigger automated end-to-end defect detection, AI failure diagnosis, and self-healing analysis")
    public ResponseEntity<QualityAnalysisResponse> runQualityAnalysis(
            @PathVariable String projectId,
            @RequestParam(required = false) String appVersionId) {
        QualityAnalysisResponse response = qualityAnalysisService.runAutomatedAnalysis(projectId, appVersionId);
        return ResponseEntity.ok(response);
    }
}
