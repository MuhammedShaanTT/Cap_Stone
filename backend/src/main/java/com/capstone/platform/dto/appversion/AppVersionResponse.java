package com.capstone.platform.dto.appversion;

import java.time.Instant;

/**
 * App version response DTO.
 * Supports both checksum and sha256Checksum field names.
 */
public record AppVersionResponse(
        String id,
        String projectId,
        String version,
        String platform,
        String artifactRef,
        String checksum,
        String sha256Checksum,
        Long fileSizeBytes,
        String packageName,
        String versionCode,
        Instant createdAt
) {
    public AppVersionResponse(
            String id,
            String projectId,
            String version,
            String platform,
            String artifactRef,
            String checksum,
            Long fileSizeBytes,
            String packageName,
            String versionCode,
            Instant createdAt
    ) {
        this(id, projectId, version, platform, artifactRef, checksum, checksum, fileSizeBytes, packageName, versionCode, createdAt);
    }
}
