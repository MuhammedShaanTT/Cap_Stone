package com.capstone.platform.repository;

import com.capstone.platform.model.SecurityFinding;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SecurityFindingRepository extends MongoRepository<SecurityFinding, String> {
    Page<SecurityFinding> findByScanId(String scanId, Pageable pageable);
    List<SecurityFinding> findByScanId(String scanId);
    List<SecurityFinding> findByScanIdAndSeverity(String scanId, String severity);
    long countByScanIdAndSeverity(String scanId, String severity);
    List<SecurityFinding> findByDeduplicationKey(String deduplicationKey);
}
