package com.wdc.ascent.repository;

import com.wdc.ascent.model.ContentQuizMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContentQuizMapRepository extends JpaRepository<ContentQuizMap, Integer> {
}
