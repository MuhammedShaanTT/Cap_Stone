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
 * Artifact — metadata reference to stored binary files.
 * Actual files (APKs, screenshots, logs, reports) are kept in object/file storage.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "artifacts")
public class Artifact {

    @Id
    private String id;

    @Indexed
    private String projectId;

    private String type;              // APK, SCREENSHOT, LOG, REPORT, PATCH

    private String storageUri;
    private String checksum;
    private Long sizeBytes;
    private String mimeType;
    private String originalFilename;

    private Instant retentionUntil;

    @CreatedDate
    private Instant createdAt;
}
