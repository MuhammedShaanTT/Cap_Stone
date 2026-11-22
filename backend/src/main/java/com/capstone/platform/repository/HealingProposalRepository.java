package com.capstone.platform.repository;

import com.capstone.platform.model.HealingProposal;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealingProposalRepository extends MongoRepository<HealingProposal, String> {
    List<HealingProposal> findByAnalysisId(String analysisId);
    List<HealingProposal> findByTestCaseId(String testCaseId);
    List<HealingProposal> findByStatus(String status);
}
