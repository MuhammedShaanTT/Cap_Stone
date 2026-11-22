package com.capstone.platform.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Registration request payload.
 */
public record RegisterRequest(
        @NotBlank(message = "Email is required")
        @Email(message = "Must be a valid email")
        String email,

        @NotBlank(message = "Display name is required")
        @Size(min = 2, max = 100, message = "Display name must be 2-100 characters")
        String displayName,

        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 128, message = "Password must be 8-128 characters")
        String password
) {}
