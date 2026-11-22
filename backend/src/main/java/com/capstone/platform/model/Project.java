package com.capstone.platform.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.Instant;
import java.util.List;

/**
 * Project entity — top-level container for app versions, test cases, scans and pipeline runs.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "projects")
public class Project {

    @Id
    private String id;

    private String name;

    private String description;

    @Indexed
    private String ownerId;

    @Builder.Default
    private List<ProjectMember> members = List.of();

    @CreatedDate
    private Instant createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProjectMember {
        private String userId;
        private String role;  // OWNER, MAINTAINER, MEMBER, VIEWER
    }
}
