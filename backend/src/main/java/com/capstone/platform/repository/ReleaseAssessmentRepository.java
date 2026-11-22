package com.capstone.platform.repository;

import com.capstone.platform.model.ReleaseAssessment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReleaseAssessmentRepository extends MongoRepository<ReleaseAssessment, String> {
    Optional<ReleaseAssessment> findByPipelineRunId(String pipelineRunId);
}
