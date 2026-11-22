package com.capstone.platform.dto.project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request payload for creating a project.
 */
public record CreateProjectRequest(
        @NotBlank(message = "Project name is required")
        @Size(min = 2, max = 200, message = "Name must be 2-200 characters")
        String name,

        @Size(max = 1000, message = "Description must be under 1000 characters")
        String description
) {}
