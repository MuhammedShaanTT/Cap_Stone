package com.capstone.platform.repository;

import com.capstone.platform.model.TestCase;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestCaseRepository extends MongoRepository<TestCase, String> {
    List<TestCase> findByProjectId(String projectId);
    List<TestCase> findByAppVersionId(String appVersionId);
    List<TestCase> findByProjectIdAndStatus(String projectId, String status);
    List<TestCase> findByProjectIdAndCategory(String projectId, String category);
}
