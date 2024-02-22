package com.wdc.ascent.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.Arrays;
import java.util.Date;
import java.util.Objects;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "training_content")
public class TrainingContent {
    //how it appears in the database
    // content_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    //    title VARCHAR(45) NOT NULL,
    //    description VARCHAR(45) NOT NULL,
    //    content_type VARCHAR(45) NOT NULL,
    //    content_link VARCHAR(45) NOT NULL,
    //    status INT,
    //created_by VARCHAR(20) NOT NULL,
    //    date_created DATETIME NOT NULL,
    //    has_quiz VARCHAR(20),
    //    status INT,
    //   training_area VARCHAR(20) NOT NULL



    //variables
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "content_id")
    private int id;

    @NotBlank(message = "cant have whitespace characters and be null")
    @Size(max = 45, message = "must be 45 characters or less")
    private String title;

    @NotBlank(message = "cant have whitespace characters and be null")
    @Size(max = 45, message = "must be 45 characters or less")
    private String description;

    @NotBlank(message = "cant have whitespace characters and be null")
    @Size(max = 45, message = "must be 45 characters or less")
    @Column(name = "content_type")
    private String contentType;

    @NotBlank(message = "cant have whitespace characters and be null")
    @Size(max = 45, message = "must be 45 characters or less")
    @Column(name = "content_link")
    private String contentLink;

    @Column(name = "created_by")
    private String createdBy;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "date_created")
    private Date dateCreated;

    @Column(name = "has_quiz", columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean hasQuiz;

    private int status;

    @NotBlank(message = "cant have whitespace characters and be null")
    @Column(name = "training_area")
    @Size(max = 20, message = "must be 45 characters or less")
    private String trainingArea;


    //getters and setters

    public int getId() {
        return id;
    }

    public void setId(int id) {this.id = id;}

    public String getTitle() {return title;}

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getContentLink() {
        return contentLink;
    }

    public void setContentLink(String contentLink) {
        this.contentLink = contentLink;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public boolean isHasQuiz() {
        return hasQuiz;
    }

    public void setHasQuiz(boolean hasQuiz) {
        this.hasQuiz = hasQuiz;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getTrainingArea() {
        return trainingArea;
    }

    public void setTrainingArea(String trainingArea) {
        this.trainingArea = trainingArea;
    }

    //object definition
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TrainingContent that = (TrainingContent) o;
        return id == that.id && hasQuiz == that.hasQuiz && status == that.status && Objects.equals(title, that.title) && Objects.equals(description, that.description) && Objects.equals(contentType, that.contentType) && Objects.equals(contentLink, that.contentLink) && Objects.equals(createdBy, that.createdBy) && Objects.equals(dateCreated, that.dateCreated) && Objects.equals(trainingArea, that.trainingArea);
    }

    //hashcode
    @Override
    public int hashCode() {
        return Objects.hash(id, title, description, contentType, contentLink, createdBy, dateCreated, hasQuiz, status, trainingArea);
    }
}//end class
