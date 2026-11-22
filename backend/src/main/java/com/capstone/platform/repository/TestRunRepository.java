package com.capstone.platform.repository;

import com.capstone.platform.model.TestRun;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestRunRepository extends MongoRepository<TestRun, String> {
    List<TestRun> findByTestCaseId(String testCaseId);
    List<TestRun> findByAppVersionId(String appVersionId);
    List<TestRun> findByAppVersionIdAndStatus(String appVersionId, String status);
    List<TestRun> findByPipelineRunId(String pipelineRunId);
    long countByAppVersionIdAndStatus(String appVersionId, String status);
}
