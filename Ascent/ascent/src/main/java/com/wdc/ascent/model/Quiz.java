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
@Table(name = "Quiz")
public class Quiz {
    //how it appears in database
    //quiz_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    //    name VARCHAR(20) NOT NULL,
    //    description TEXT NOT NULL, -- Use TEXT for large text fields
    //    status INT,
    //    create_by INT,
    //    create_date DATETIME NOT NULL,
    //    modify_by INT,
    //    modify_date DATETIME,
    //    difficulty VARCHAR(20) NOT NULL,
    //passing_grade int

    //variables
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "quiz_id")
    private int quizId;

    @NotBlank(message = "cant have whitespace characters and be null")
    @Column(name = "name")
    @Size(max = 45, message = "must be 45 characters or less")
    private String name;

    //is a text in the dbeaver but not making errors atm
    @NotBlank(message = "cant have whitespace characters and be null")
    @Column(name = "description")
    @Size(max = 45, message = "must be 45 characters or less")
    private String description;

    @NotBlank(message = "cant have whitespace characters and be null")
    @Column(name = "status")
    @Size(max = 45, message = "must be 45 characters or less")
    private int status;

    @Column(name = "create_by")
    private String createBy;

    @Column(name = "create_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createDate;

    @Column(name = "modify_by")
    private int modifyBy;

    @Column(name = "modify_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date modifyDate;

    @NotBlank(message = "cant have whitespace characters and be null")
    @Column(name = "difficulty")
    @Size(max = 20, message = "must be 45 characters or less")
    private String difficulty;

    @Column(name = "passing_grade")
    private int passingGrade;

    //getters and setters

    public int getQuizId() {
        return quizId;
    }

    public void setQuizId(int quizId) {
        this.quizId = quizId;
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

    public int getModifyBy() {
        return modifyBy;
    }

    public void setModifyBy(int modifyBy) {
        this.modifyBy = modifyBy;
    }

    public Date getModifyDate() {
        return modifyDate;
    }

    public void setModifyDate(Date modifyDate) {
        this.modifyDate = modifyDate;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public int getPassingGrade() {
        return passingGrade;
    }

    public void setPassingGrade(int passingGrade) {
        this.passingGrade = passingGrade;
    }


    //object definition

    //hashcode

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Quiz quiz)) return false;
        return getQuizId() == quiz.getQuizId() && getStatus() == quiz.getStatus() && getModifyBy() == quiz.getModifyBy() && getPassingGrade() == quiz.getPassingGrade() && Objects.equals(getName(), quiz.getName()) && Objects.equals(getDescription(), quiz.getDescription()) && Objects.equals(getCreateBy(), quiz.getCreateBy()) && Objects.equals(getCreateDate(), quiz.getCreateDate()) && Objects.equals(getModifyDate(), quiz.getModifyDate()) && Objects.equals(getDifficulty(), quiz.getDifficulty());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getQuizId(), getName(), getDescription(), getStatus(), getCreateBy(), getCreateDate(), getModifyBy(), getModifyDate(), getDifficulty(), getPassingGrade());
    }
}//end class
