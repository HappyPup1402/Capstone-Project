package com.wdc.ascent.repository;

import com.wdc.ascent.model.TrainingContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface TrainingContentRepository extends JpaRepository<TrainingContent, Integer> {
    TrainingContent findByTitle(String title);
}
