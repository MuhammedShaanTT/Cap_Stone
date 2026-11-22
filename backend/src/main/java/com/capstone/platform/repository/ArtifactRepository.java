package com.capstone.platform.repository;

import com.capstone.platform.model.Artifact;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArtifactRepository extends MongoRepository<Artifact, String> {
    List<Artifact> findByProjectId(String projectId);
    List<Artifact> findByProjectIdAndType(String projectId, String type);
}
