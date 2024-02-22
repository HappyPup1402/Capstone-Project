package com.wdc.ascent.repository;

import com.wdc.ascent.model.TrainingDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainingDetailRepository extends CrudRepository<TrainingDetail, Integer> {

}
