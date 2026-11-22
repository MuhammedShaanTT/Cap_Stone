package com.capstone.platform.dto.securityscan;

import java.time.Instant;

/**
 * Security scan response DTO.
 */
public record SecurityScanResponse(
        String id,
        String projectId,
        String appVersionId,
        String scanner,
        String scannerVersion,
        String profile,
        String status,
        String reportRef,
        Integer findingsCount,
        Integer criticalCount,
        Integer highCount,
        Instant startedAt,
        Instant completedAt,
        Long durationMs,
        Instant createdAt
) {}
