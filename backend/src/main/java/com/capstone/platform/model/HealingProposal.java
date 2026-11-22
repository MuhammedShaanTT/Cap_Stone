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
import java.util.List;

/**
 * Healing proposal — candidate repair for a failed test.
 * Must be approved before verification; all decisions are audited.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "healing_proposals")
public class HealingProposal {

    @Id
    private String id;

    @Indexed
    private String analysisId;

    private String testCaseId;

    private String oldLocator;

    @Builder.Default
    private List<RepairCandidate> candidates = List.of();

    private double confidence;        // Highest candidate confidence

    private String patchRef;          // Diff / patch artifact reference

    @Builder.Default
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED, VERIFIED, FAILED

    private String approvedBy;        // User ID of reviewer
    private Instant approvedAt;
    private String rejectionReason;

    @CreatedDate
    private Instant createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RepairCandidate {
        private String newLocator;
        private String strategy;      // RESOURCE_ID, CONTENT_DESC, XPATH, ACCESSIBILITY_ID
        private double confidence;
        private String rationale;
    }
}
