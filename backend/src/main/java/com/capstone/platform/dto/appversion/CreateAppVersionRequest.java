package com.capstone.platform.dto.appversion;

import jakarta.validation.constraints.NotBlank;

/**
 * Request payload for registering an app version.
 */
public record CreateAppVersionRequest(
        @NotBlank(message = "Version is required")
        String version,

        String platform,

        String packageName,

        String versionCode
) {}
