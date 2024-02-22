package com.wdc.ascent.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;
import java.util.Objects;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "quiz_detail")
public class QuizDetail {
    //quiz_detail_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    //    quiz_id INT NOT NULL,
    //    question_id INT NOT NULL,

    //variables

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "quiz_detail_id")
    private int quizDetailId;

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private QuizQuestion quizQuestion;



    //getters and setters

    public int getQuizDetailId() {
        return quizDetailId;
    }

    public void setQuizDetailId(int quizDetailId) {
        this.quizDetailId = quizDetailId;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }

    public QuizQuestion getQuizQuestion() {
        return quizQuestion;
    }

    public void setQuizQuestion(QuizQuestion quizQuestion) {
        this.quizQuestion = quizQuestion;
    }

    //Object Definition
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof QuizDetail that)) return false;
        return getQuizDetailId() == that.getQuizDetailId() && Objects.equals(getQuiz(), that.getQuiz()) && Objects.equals(getQuizQuestion(), that.getQuizQuestion());
    }

    //hashcode
    @Override
    public int hashCode() {
        return Objects.hash(getQuizDetailId(), getQuiz(), getQuizQuestion());
    }
}//end class
