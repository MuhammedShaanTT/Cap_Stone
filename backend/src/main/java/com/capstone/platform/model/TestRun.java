package com.capstone.platform.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;

import java.time.Instant;
import java.util.List;

/**
 * Test run — single execution of a test case against an app version.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "test_runs")
@CompoundIndex(name = "version_status", def = "{'appVersionId': 1, 'status': 1}")
public class TestRun {

    @Id
    private String id;

    @Indexed
    private String testCaseId;

    @Indexed
    private String appVersionId;

    private String pipelineRunId;

    @Builder.Default
    private String status = "QUEUED"; // QUEUED, RUNNING, PASSED, FAILED, ERROR, CANCELLED

    private Instant startedAt;
    private Instant completedAt;
    private Long durationMs;

    private String errorMessage;
    private String errorType;         // LOCATOR_NOT_FOUND, ASSERTION_FAILED, TIMEOUT, CRASH

    @Builder.Default
    private List<String> artifactRefs = List.of(); // screenshots, logs

    private String executedBy;        // Worker/agent identifier
    private String environment;       // Device/emulator info
}
