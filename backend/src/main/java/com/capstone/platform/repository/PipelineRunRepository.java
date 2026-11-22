package com.capstone.platform.repository;

import com.capstone.platform.model.PipelineRun;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PipelineRunRepository extends MongoRepository<PipelineRun, String> {
    List<PipelineRun> findByProjectId(String projectId);
    List<PipelineRun> findByProjectIdAndStatus(String projectId, String status);
}
