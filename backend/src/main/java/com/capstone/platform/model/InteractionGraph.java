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
 * Interaction graph — models screen transitions and navigation paths.
 * Version snapshots allow diffing between app versions.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "interaction_graphs")
public class InteractionGraph {

    @Id
    private String id;

    @Indexed
    private String appVersionId;

    @Builder.Default
    private List<GraphNode> nodes = List.of();

    @Builder.Default
    private List<GraphEdge> edges = List.of();

    private String analyzerVersion;

    @CreatedDate
    private Instant createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GraphNode {
        private String screenKey;
        private String activityName;
        private int componentCount;
        private boolean visited;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GraphEdge {
        private String fromScreen;
        private String toScreen;
        private String action;       // click, swipe, back, etc.
        private String targetElement;
    }
}
