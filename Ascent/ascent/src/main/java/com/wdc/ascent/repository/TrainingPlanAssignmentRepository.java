package com.wdc.ascent.repository;

import com.wdc.ascent.model.TrainingPlanAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainingPlanAssignmentRepository extends JpaRepository<TrainingPlanAssignment, Integer> {
}
