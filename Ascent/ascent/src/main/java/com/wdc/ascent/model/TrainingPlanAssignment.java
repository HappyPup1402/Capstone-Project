package com.wdc.ascent.model;
//
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
//
import java.util.Date;
import java.util.Objects;
//
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "training_plan_assignment")
public class TrainingPlanAssignment {
//    //how it appears in the database
//    //CREATE TABLE IF NOT EXISTS training_plan_assignment(
//    //	assignment_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
//    //	plan_id INT,
//    //	assigned_date VARCHAR(45),
//    //	completed_date VARCHAR(45),
//    //	due_date VARCHAR(45),
//    //	status VARCHAR(45),
//    //	is_required VARCHAR(45) NOT NULL,
//    //	training_purpose VARCHAR(45),
//    //	user_id INT NOT NULL,
//    //	is_canceled INT,
//    //	quiz_result VARCHAR(45) NOT NULL
//
   @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @NotEmpty
    @Column(name = "assignment_id")
    private int assignmentId;
//
    @Column(name = "plan_id")
    private int planId;
//
//
    @Size(max = 45, message = "must be 45 characters or less")
    @Column(name = "assigned_date")
    private Date assignedDate;
//
    @Size(max = 45, message = "must be 45 characters or less")
    @Column(name = "completed_date")
    private Date completedDate;
//
    @Size(max = 45, message = "must be 45 characters or less")
    @Column(name = "due_date")
    private Date dueDate;
//
    @Size(max = 45, message = "must be 45 characters or less")
    @Column(name = "status")
    private String status;
//
    @Size(max = 45, message = "must be 45 characters or less")
    @NotBlank(message = "cant have whitespace characters and be null")
    @Column(name = "is_required")
    private String isRequired;
//
    @Size(max = 45, message = "must be 45 characters or less")
    @Column(name = "training_purpose")
    private String trainingPurpose;
//
    @NotBlank(message = "cant have whitespace characters and be null")
    @Column(name = "user_id")
    private int userId;
//
    @Column(name = "is_canceled")
    private int isCanceled;
//
    @NotBlank(message = "cant have whitespace characters and be null")
    @Column(name = "quiz_result")
    private String quizResult;
//
//    //getters and setters
//
//
    public int getAssignmentId() {
        return assignmentId;
    }
//
    public void setAssignmentId(int assignmentId) {
        this.assignmentId = assignmentId;
    }
//
    public int getPlanId() {
        return planId;
    }
//
    public void setPlanId(int planId) {
        this.planId = planId;
    }
//

    public Date getAssignedDate() {
        return assignedDate;
    }

    public void setAssignedDate(Date assignedDate) {
        this.assignedDate = assignedDate;
    }

    public Date getCompletedDate() {
        return completedDate;
    }

    public void setCompletedDate(Date completedDate) {
        this.completedDate = completedDate;
    }

    //

    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }

    //
    public String getStatus() {
        return status;
    }
//
    public void setStatus(String status) {
        this.status = status;
    }
//
    public String getIsRequired() {
        return isRequired;
    }
//
    public void setIsRequired(String isRequired) {
        this.isRequired = isRequired;
    }
//
    public String getTrainingPurpose() {
        return trainingPurpose;
    }
//
    public void setTrainingPurpose(String trainingPurpose) {
        this.trainingPurpose = trainingPurpose;
    }
//
    public int getUserId() {
        return userId;
    }
//
    public void setUserId(int userId) {
        this.userId = userId;
    }
//
    public int getIsCanceled() {
        return isCanceled;
    }
//
    public void setIsCanceled(int isCanceled) {
        this.isCanceled = isCanceled;
    }
//
    public String getQuizResult() {
       return quizResult;
    }
//
    public void setQuizResult(String quizResult) {
        this.quizResult = quizResult;
    }
//
//    //object definition

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TrainingPlanAssignment that = (TrainingPlanAssignment) o;
        return getAssignmentId() == that.getAssignmentId() && getPlanId() == that.getPlanId() && getUserId() == that.getUserId() && getIsCanceled() == that.getIsCanceled() && Objects.equals(getAssignedDate(), that.getAssignedDate()) && Objects.equals(getCompletedDate(), that.getCompletedDate()) && Objects.equals(getDueDate(), that.getDueDate()) && Objects.equals(getStatus(), that.getStatus()) && Objects.equals(getIsRequired(), that.getIsRequired()) && Objects.equals(getTrainingPurpose(), that.getTrainingPurpose()) && Objects.equals(getQuizResult(), that.getQuizResult());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getAssignmentId(), getPlanId(), getAssignedDate(), getCompletedDate(), getDueDate(), getStatus(), getIsRequired(), getTrainingPurpose(), getUserId(), getIsCanceled(), getQuizResult());
    }
}//end class
