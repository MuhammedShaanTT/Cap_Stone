package com.capstone.platform.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.Instant;

/**
 * Pipeline run — tracks a CI/CD pipeline execution.
 * No secrets should be stored in metadata.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "pipeline_runs")
public class PipelineRun {

    @Id
    private String id;

    @Indexed
    private String projectId;

    private String commitSha;
    private String branch;
    private String triggerType;       // PUSH, PR, MANUAL, WEBHOOK

    @Builder.Default
    private String status = "PENDING"; // PENDING, RUNNING, SUCCEEDED, FAILED, CANCELLED

    private Integer testRunCount;
    private Integer testPassCount;
    private Integer scanCount;
    private Integer criticalFindings;

    private Instant startedAt;
    private Instant completedAt;
    private Long durationMs;
}
