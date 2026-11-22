package com.capstone.platform.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;

import java.time.Instant;

/**
 * Security finding — normalized finding from any scanner.
 * Deduplication and validation status tracked per finding.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "security_findings")
@CompoundIndex(name = "scan_severity", def = "{'scanId': 1, 'severity': 1}")
public class SecurityFinding {

    @Id
    private String id;

    @Indexed
    private String scanId;

    private String ruleId;
    private String title;
    private String description;

    private String severity;          // CRITICAL, HIGH, MEDIUM, LOW, INFO
    private String category;          // CRYPTO, NETWORK, STORAGE, AUTH, CODE_QUALITY

    private String evidenceRef;
    private String location;          // File path, method, or URL
    private Integer lineNumber;

    private double confidence;        // Scanner confidence score

    @Builder.Default
    private String validationStatus = "UNVALIDATED"; // UNVALIDATED, TRUE_POSITIVE, FALSE_POSITIVE, NEEDS_REVIEW

    private String remediation;
    private String cweId;
    private String owasp;             // MASVS category reference

    private String deduplicationKey;  // For cross-scan dedup

    @CreatedDate
    private Instant createdAt;
}
