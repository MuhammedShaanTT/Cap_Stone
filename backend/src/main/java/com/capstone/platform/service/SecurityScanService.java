package com.capstone.platform.service;

import com.capstone.platform.dto.securityscan.CreateSecurityScanRequest;
import com.capstone.platform.dto.securityscan.SecurityFindingResponse;
import com.capstone.platform.dto.securityscan.SecurityScanResponse;
import com.capstone.platform.exception.ResourceNotFoundException;
import com.capstone.platform.model.SecurityFinding;
import com.capstone.platform.model.SecurityScan;
import com.capstone.platform.repository.ProjectRepository;
import com.capstone.platform.repository.SecurityFindingRepository;
import com.capstone.platform.repository.SecurityScanRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

/**
 * SecurityScan service — create and list security scans under a project.
 */
@Service
public class SecurityScanService {

    private final SecurityScanRepository securityScanRepository;
    private final SecurityFindingRepository securityFindingRepository;
    private final ProjectRepository projectRepository;

    public SecurityScanService(SecurityScanRepository securityScanRepository,
                               SecurityFindingRepository securityFindingRepository,
                               ProjectRepository projectRepository) {
        this.securityScanRepository = securityScanRepository;
        this.securityFindingRepository = securityFindingRepository;
        this.projectRepository = projectRepository;
    }

    public SecurityScanResponse createSecurityScan(String projectId, CreateSecurityScanRequest request) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project", projectId);
        }

        SecurityScan scan = SecurityScan.builder()
                .projectId(projectId)
                .appVersionId(request.appVersionId())
                .scanner(request.scanner())
                .scannerVersion(request.scannerVersion())
                .profile(request.profile() != null ? request.profile() : "QUICK")
                .status("QUEUED")
                .startedAt(Instant.now())
                .build();

        scan = securityScanRepository.save(scan);
        return toResponse(scan);
    }

    public List<SecurityScanResponse> getSecurityScansByProject(String projectId) {
        return securityScanRepository.findByProjectId(projectId).stream()
                .map(this::toResponse)
                .toList();
    }

    public SecurityScanResponse getSecurityScan(String scanId) {
        SecurityScan scan = securityScanRepository.findById(scanId)
                .orElseThrow(() -> new ResourceNotFoundException("SecurityScan", scanId));
        return toResponse(scan);
    }

    public List<SecurityFindingResponse> getFindingsByScan(String scanId) {
        if (!securityScanRepository.existsById(scanId)) {
            throw new ResourceNotFoundException("SecurityScan", scanId);
        }
        return securityFindingRepository.findByScanId(scanId).stream()
                .map(this::toFindingResponse)
                .toList();
    }

    private SecurityFindingResponse toFindingResponse(SecurityFinding f) {
        return new SecurityFindingResponse(
                f.getId(),
                f.getScanId(),
                f.getRuleId(),
                f.getTitle(),
                f.getDescription(),
                f.getSeverity(),
                f.getCategory(),
                f.getEvidenceRef(),
                f.getLocation(),
                f.getLineNumber(),
                f.getConfidence(),
                f.getValidationStatus(),
                f.getRemediation(),
                f.getCweId(),
                f.getOwasp(),
                f.getCreatedAt()
        );
    }

    private SecurityScanResponse toResponse(SecurityScan s) {
        return new SecurityScanResponse(
                s.getId(),
                s.getProjectId(),
                s.getAppVersionId(),
                s.getScanner(),
                s.getScannerVersion(),
                s.getProfile(),
                s.getStatus(),
                s.getReportRef(),
                s.getFindingsCount(),
                s.getCriticalCount(),
                s.getHighCount(),
                s.getStartedAt(),
                s.getCompletedAt(),
                s.getDurationMs(),
                s.getCreatedAt()
        );
    }
}
