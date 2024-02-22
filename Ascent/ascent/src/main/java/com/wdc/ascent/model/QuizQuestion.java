package com.wdc.ascent.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.Objects;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "quiz_question")
public class QuizQuestion {
    //question_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    //    question VARCHAR(45) NOT NULL,
    //    selections VARCHAR(45),
    //    answer_key VARCHAR(45) NOT NULL,
    //    question_type VARCHAR(45),
    //    is_removed INT

    //variables
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id")
    private int id;

    @NotBlank(message = "cant have whitespace characters and be null")
    @Size(max = 45, message = "must be 45 characters or less")
    private String question;

    @Size(max = 45, message = "must be 45 characters or less")
    private String selections;

    @NotBlank(message = "cant have whitespace characters and be null")
    @Size(max = 45, message = "must be 45 characters or less")
    @Column(name = "answer_key")
    private String answerKey;

    @Size(max = 45, message = "must be 45 characters or less")
    @Column(name = "question_type")
    private String questionType;

    @Column(name = "is_removed")
    private int isRemoved;

    //getters and setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getSelections() {
        return selections;
    }

    public void setSelections(String selections) {
        this.selections = selections;
    }

    public String getAnswerKey() {
        return answerKey;
    }

    public void setAnswerKey(String answerKey) {
        this.answerKey = answerKey;
    }

    public String getQuestionType() {
        return questionType;
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }

    public int getIsRemoved() {
        return isRemoved;
    }

    public void setIsRemoved(int isRemoved) {
        this.isRemoved = isRemoved;
    }

    //object definition

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof QuizQuestion that)) return false;
        return getId() == that.getId() && getIsRemoved() == that.getIsRemoved() && Objects.equals(getQuestion(), that.getQuestion()) && Objects.equals(getSelections(), that.getSelections()) && Objects.equals(getAnswerKey(), that.getAnswerKey()) && Objects.equals(getQuestionType(), that.getQuestionType());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getQuestion(), getSelections(), getAnswerKey(), getQuestionType(), getIsRemoved());
    }


    //hashcode

}//end class
