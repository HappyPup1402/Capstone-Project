package com.wdc.ascent.repository;

import com.wdc.ascent.model.TrainingPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainingPlanRepository extends JpaRepository<TrainingPlan, Integer> {
    TrainingPlan findByName(String name);
}
