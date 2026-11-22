package com.capstone.platform.repository;

import com.capstone.platform.model.AppVersion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppVersionRepository extends MongoRepository<AppVersion, String> {
    List<AppVersion> findByProjectId(String projectId);
    boolean existsByProjectIdAndVersion(String projectId, String version);
}
