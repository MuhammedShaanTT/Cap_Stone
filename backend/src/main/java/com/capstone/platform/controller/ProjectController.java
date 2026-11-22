package com.capstone.platform.controller;

import com.capstone.platform.dto.project.CreateProjectRequest;
import com.capstone.platform.dto.project.ProjectResponse;
import com.capstone.platform.security.UserPrincipal;
import com.capstone.platform.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Project CRUD endpoints — requires authentication.
 */
@RestController
@RequestMapping("/api/v1/projects")
@Tag(name = "Projects", description = "Project management")
@SecurityRequirement(name = "bearerAuth")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    @Operation(summary = "Create a new project")
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody CreateProjectRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        ProjectResponse response = projectService.createProject(request, principal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "List current user's projects")
    public ResponseEntity<List<ProjectResponse>> getMyProjects(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(projectService.getUserProjects(principal.getId()));
    }

    @GetMapping("/{projectId}")
    @Operation(summary = "Get project by ID")
    public ResponseEntity<ProjectResponse> getProject(@PathVariable String projectId) {
        return ResponseEntity.ok(projectService.getProject(projectId));
    }

    @DeleteMapping("/{projectId}")
    @Operation(summary = "Delete a project (owner only)")
    public ResponseEntity<Void> deleteProject(
            @PathVariable String projectId,
            @AuthenticationPrincipal UserPrincipal principal) {
        projectService.deleteProject(projectId, principal.getId());
        return ResponseEntity.noContent().build();
    }
}
