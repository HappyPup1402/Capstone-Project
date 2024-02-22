package com.wdc.ascent.model;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.Date;
import java.util.Objects;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "training_plan")
public class TrainingPlan {
    //how it appears in database
    // plan_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    //    plan_name VARCHAR(45) NOT NULL,
    //    description VARCHAR(45) NOT NULL,
    //    status INT,
    //    create_by INT,
    //    create_date DATETIME NOT NULL,
    //    modify_by INT,
    //    modify_date INT
    //training_area

    //variables
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "plan_id")
    private int id;

    @NotBlank(message = "cant have whitespace characters and be null")
    @Size(max = 45, message = "must be 45 characters or less")
    @Column(name = "plan_name")
    private String name;

    @NotBlank(message = "cant have whitespace characters and be null")
    @Size(max = 45, message = "must be 45 characters or less")
    private String description;

    private int status;

    @Column(name = "create_by")
    private String createBy;

    @NotBlank(message = "cant have whitespace characters and be null")
    @Column(name = "create_date")
    private Date createDate;

    @Column(name = "modify_by")
    private String modifyBy;

    @Column(name = "modify_date")
    private int modifyDate;

    @Column(name= "training_area")
    private String trainingArea;

    //getters and setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getCreateBy() {
        return createBy;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public String getModifyBy() {
        return modifyBy;
    }

    public void setModifyBy(String modifyBy) {
        this.modifyBy = modifyBy;
    }

    public int getModifyDate() {
        return modifyDate;
    }

    public void setModifyDate(int modifyDate) {
        this.modifyDate = modifyDate;
    }

    public String getTrainingArea() {
        return trainingArea;
    }

    public void setTrainingArea(String trainingArea) {
        this.trainingArea = trainingArea;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TrainingPlan that = (TrainingPlan) o;
        return getId() == that.getId() && getStatus() == that.getStatus() && getModifyDate() == that.getModifyDate() && Objects.equals(getName(), that.getName()) && Objects.equals(getDescription(), that.getDescription()) && Objects.equals(getCreateBy(), that.getCreateBy()) && Objects.equals(getCreateDate(), that.getCreateDate()) && Objects.equals(getModifyBy(), that.getModifyBy()) && Objects.equals(getTrainingArea(), that.getTrainingArea());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getName(), getDescription(), getStatus(), getCreateBy(), getCreateDate(), getModifyBy(), getModifyDate(), getTrainingArea());
    }
}//end class
