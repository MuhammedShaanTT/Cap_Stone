package com.capstone.platform.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.Instant;
import java.util.List;

/**
 * Repair verification — records of test re-execution after applying a healing proposal.
 * Success = test passes AND regression checks pass.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "repair_verifications")
public class RepairVerification {

    @Id
    private String id;

    @Indexed
    private String proposalId;

    @Builder.Default
    private List<String> verificationRunIds = List.of();

    @Builder.Default
    private List<String> regressionRunIds = List.of();

    private String result;            // PASSED, FAILED, PARTIAL, ERROR

    private boolean regressionPassed;
    private String notes;

    private Instant verifiedAt;
}
