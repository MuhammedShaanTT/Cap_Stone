package com.capstone.platform.repository;

import com.capstone.platform.model.SecurityScan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SecurityScanRepository extends MongoRepository<SecurityScan, String> {
    List<SecurityScan> findByProjectId(String projectId);
    List<SecurityScan> findByAppVersionId(String appVersionId);
    List<SecurityScan> findByAppVersionIdAndScanner(String appVersionId, String scanner);
}
