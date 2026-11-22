package com.capstone.platform.service;

import com.capstone.platform.dto.project.CreateProjectRequest;
import com.capstone.platform.dto.project.ProjectResponse;
import com.capstone.platform.exception.ResourceNotFoundException;
import com.capstone.platform.model.Project;
import com.capstone.platform.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Stream;

/**
 * Project service — CRUD and access control for projects.
 */
@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public ProjectResponse createProject(CreateProjectRequest request, String ownerId) {
        Project project = Project.builder()
                .name(request.name())
                .description(request.description())
                .ownerId(ownerId)
                .members(List.of(
                        Project.ProjectMember.builder()
                                .userId(ownerId)
                                .role("OWNER")
                                .build()
                ))
                .build();

        project = projectRepository.save(project);
        return toResponse(project);
    }

    public List<ProjectResponse> getUserProjects(String userId) {
        List<Project> owned = projectRepository.findByOwnerId(userId);
        List<Project> member = projectRepository.findByMembersUserId(userId);

        // Merge and deduplicate
        return Stream.concat(owned.stream(), member.stream())
                .distinct()
                .map(this::toResponse)
                .toList();
    }

    public ProjectResponse getProject(String projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", projectId));
        return toResponse(project);
    }

    public void deleteProject(String projectId, String userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", projectId));

        if (!project.getOwnerId().equals(userId)) {
            throw new com.capstone.platform.exception.AccessDeniedException(
                    "Only the project owner can delete this project");
        }

        projectRepository.delete(project);
    }

    private ProjectResponse toResponse(Project project) {
        List<ProjectResponse.MemberInfo> members = project.getMembers() == null
                ? List.of()
                : project.getMembers().stream()
                    .map(m -> new ProjectResponse.MemberInfo(m.getUserId(), m.getRole()))
                    .toList();

        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getOwnerId(),
                members,
                project.getCreatedAt()
        );
    }
}
