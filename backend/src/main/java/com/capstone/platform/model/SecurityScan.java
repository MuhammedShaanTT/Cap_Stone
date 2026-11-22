package com.capstone.platform.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.Instant;

/**
 * Security scan — tracks a single scan execution across one or more scanners.
 * Original scanner report is preserved as an artifact.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "security_scans")
public class SecurityScan {

    @Id
    private String id;

    @Indexed
    private String projectId;

    @Indexed
    private String appVersionId;

    private String scanner;           // MOBSF, SEMGREP, ZAP, TRIVY
    private String scannerVersion;
    private String profile;           // QUICK, FULL, CUSTOM

    @Builder.Default
    private String status = "QUEUED"; // QUEUED, RUNNING, COMPLETED, FAILED, CANCELLED

    private String reportRef;         // Artifact reference to raw report
    private Integer findingsCount;
    private Integer criticalCount;
    private Integer highCount;

    private Instant startedAt;
    private Instant completedAt;
    private Long durationMs;

    @CreatedDate
    private Instant createdAt;
}
