package com.capstone.platform.dto.securityscan;

import jakarta.validation.constraints.NotBlank;

/**
 * Request payload for creating a security scan.
 */
public record CreateSecurityScanRequest(
        @NotBlank(message = "App version ID is required")
        String appVersionId,

        @NotBlank(message = "Scanner is required")
        String scanner,

        String scannerVersion,

        String profile
) {}
