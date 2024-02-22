package com.wdc.ascent.repository;

import com.wdc.ascent.model.QuizDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizDetailRepository extends JpaRepository<QuizDetail, Integer> {
}
