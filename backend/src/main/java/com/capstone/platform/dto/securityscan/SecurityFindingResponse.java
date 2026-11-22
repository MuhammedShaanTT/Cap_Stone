package com.capstone.platform.dto.securityscan;

import java.time.Instant;

/**
 * Response payload for an individual security finding discovered in a scan.
 */
public record SecurityFindingResponse(
        String id,
        String scanId,
        String ruleId,
        String title,
        String description,
        String severity,
        String category,
        String evidenceRef,
        String location,
        Integer lineNumber,
        double confidence,
        String validationStatus,
        String remediation,
        String cweId,
        String owasp,
        Instant createdAt
) {}
