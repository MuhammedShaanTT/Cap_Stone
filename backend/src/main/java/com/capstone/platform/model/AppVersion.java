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
 * App version — represents a specific version/build of an Android application.
 * APK binary is stored in artifact storage; only reference is kept here.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "app_versions")
@CompoundIndex(name = "project_version", def = "{'projectId': 1, 'version': 1}")
public class AppVersion {

    @Id
    private String id;

    @Indexed
    private String projectId;

    private String version;

    @Builder.Default
    private String platform = "ANDROID";

    private String artifactRef;      // Storage URI for the APK
    private String checksum;         // SHA-256 hash
    private Long fileSizeBytes;
    private String packageName;
    private String versionCode;

    @CreatedDate
    private Instant createdAt;
}
