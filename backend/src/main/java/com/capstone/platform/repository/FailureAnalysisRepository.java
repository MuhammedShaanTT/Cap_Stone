package com.capstone.platform.repository;

import com.capstone.platform.model.FailureAnalysis;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FailureAnalysisRepository extends MongoRepository<FailureAnalysis, String> {
    List<FailureAnalysis> findByTestRunId(String testRunId);
}
