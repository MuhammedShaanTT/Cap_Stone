package com.capstone.platform.repository;

import com.capstone.platform.model.RepairVerification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepairVerificationRepository extends MongoRepository<RepairVerification, String> {
    List<RepairVerification> findByProposalId(String proposalId);
}
