package com.wdc.ascent.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "content_quiz_map")
public class ContentQuizMap {

    //how it appears in database:
    // content_quiz_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    //    content_id INT NOT NULL,
    //    quiz_id INT NOT NULL
    //);

    //variables

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "content_quiz_id")
    private int id;


    @Column(name = "content_id")
    private int contentId;


    @Column(name = "quiz_id")
    private int quizId;



    //getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getContentId() {
        return contentId;
    }

    public void setContentId(int contentId) {
        this.contentId = contentId;
    }

    public int getQuizId() {
        return quizId;
    }

    public void setQuizId(int quizId) {
        this.quizId = quizId;
    }


    //object definition
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ContentQuizMap that = (ContentQuizMap) o;
        return id == that.id && contentId == that.contentId && quizId == that.quizId;
    }

    //hash code
    @Override
    public int hashCode() {
        return super.hashCode();
    }
}//end class
