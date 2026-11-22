package com.capstone.platform.dto.auth;

/**
 * Authentication response with JWT tokens and user info.
 */
public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        UserInfo user
) {
    public AuthResponse(String accessToken, String refreshToken, UserInfo user) {
        this(accessToken, refreshToken, "Bearer", user);
    }

    public record UserInfo(
            String id,
            String email,
            String displayName,
            String role
    ) {}
}
