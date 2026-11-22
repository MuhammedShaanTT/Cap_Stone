package com.capstone.platform.dto.project;

import java.time.Instant;
import java.util.List;

/**
 * Project response DTO — safe view without internal details.
 */
public record ProjectResponse(
        String id,
        String name,
        String description,
        String ownerId,
        List<MemberInfo> members,
        Instant createdAt
) {
    public record MemberInfo(
            String userId,
            String role
    ) {}
}
