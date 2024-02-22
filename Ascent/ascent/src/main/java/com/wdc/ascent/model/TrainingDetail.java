package com.wdc.ascent.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.Objects;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "training_detail")
public class TrainingDetail {
    //how it appears in database
    //detail_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    //    plan_id INT,
    //    content_id INT

    //variables
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detail_id")
    private int id;

    @OneToOne
    @JoinColumn(name = "plan_id")
    private TrainingPlan trainingPlan;

    @OneToOne
    @JoinColumn(name = "content_id")
    private TrainingContent trainingContent;

    //getters and setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public TrainingPlan getTrainingPlan() {
        return trainingPlan;
    }

    public void setTrainingPlan(TrainingPlan trainingPlan) {
        this.trainingPlan = trainingPlan;
    }

    public TrainingContent getTrainingContent() {
        return trainingContent;
    }

    public void setTrainingContent(TrainingContent trainingContent) {
        this.trainingContent = trainingContent;
    }


    //object definition


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TrainingDetail that)) return false;
        return getId() == that.getId() && Objects.equals(getTrainingPlan(), that.getTrainingPlan()) && Objects.equals(getTrainingContent(), that.getTrainingContent());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getTrainingPlan(), getTrainingContent());
    }
}//end class
