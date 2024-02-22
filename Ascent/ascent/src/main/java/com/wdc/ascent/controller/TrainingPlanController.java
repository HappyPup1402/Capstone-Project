package com.wdc.ascent.controller;

import aj.org.objectweb.asm.TypeReference;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wdc.ascent.model.*;
import com.wdc.ascent.repository.*;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@RestController
////api for training plans
@RequestMapping("/api/PlanAssignment")
@CrossOrigin(origins = "http://localhost:3000")
public class TrainingPlanController {
    //Calls to relevant repositories
    private final TrainingPlanRepository trainingPlanRepository;
    private final UsersRepository usersRepository;
    private final TrainingDetailRepository trainingDetailRepository;
    private final TrainingContentRepository trainingContentRepository;
    private final TrainingPlanAssignmentRepository trainingPlanAssignmentRepository;
    private final ContentQuizMapRepository contentQuizMapRepository;
    private final QuizRepository quizRepository;



    @Autowired
    public TrainingPlanController(TrainingPlanRepository trainingPlanRepository, UsersRepository usersRepository, TrainingDetailRepository trainingDetailRepository, TrainingContentRepository trainingContentRepository, TrainingPlanAssignmentRepository trainingPlanAssignmentRepository, ContentQuizMapRepository contentQuizMapRepository, QuizRepository quizRepository){
        this.trainingPlanRepository = trainingPlanRepository;
        this.usersRepository = usersRepository;
        this.trainingDetailRepository = trainingDetailRepository;
        this.trainingContentRepository = trainingContentRepository;
        this.trainingPlanAssignmentRepository = trainingPlanAssignmentRepository;
        this.contentQuizMapRepository = contentQuizMapRepository;
        this.quizRepository = quizRepository;
    }//end constructor

//    //training plan detail connects the training plan and associated content
//    //content link content type training area are all from training o
//
    //add a check for if the plan name already exists


//    //Create new training plans
@PostMapping("/CreateTrainingPlan")
public ResponseEntity<String> createTrainingPlan(@RequestBody Map<String, Object> createNewPlan) {
    Map<String, Object> trainingPlanData = (Map<String, Object>) createNewPlan.get("trainingPlan");
    Map<String, Object> trainingPlanAssignmentData = (Map<String, Object>) createNewPlan.get("trainingPlanAssignment");
    List<Integer> trainingContentList = (List<Integer>) createNewPlan.get("trainingContent");
    List<Integer> userIds = (List<Integer>) trainingPlanAssignmentData.get("userId");

    //check if training plan already exists
    String trainingPlanName = (String) trainingPlanData.get("name");
    Optional<TrainingPlan> existingTrainingPlan = Optional.ofNullable(trainingPlanRepository.findByName(trainingPlanName));
    if (existingTrainingPlan.isPresent()) {
        // Training plan with the same name already exists, return an error response
        return ResponseEntity.badRequest().body("Training plan with name " + trainingPlanName + " already exists");
    }

    //Create Training Plan and save
    TrainingPlan trainingPlan = new TrainingPlan();
    trainingPlan.setName((String) trainingPlanData.get("name"));
    trainingPlan.setDescription((String) trainingPlanData.get("description"));
    trainingPlan.setCreateBy((String) trainingPlanData.get("createBy"));
    trainingPlan.setCreateDate(Date.from(Instant.parse((String) trainingPlanData.get("createDate"))));
    trainingPlan.setTrainingArea((String)trainingPlanData.get("trainingArea"));
    trainingPlan.setModifyDate(0);
    trainingPlanRepository.save(trainingPlan);

    Map<Integer, String> quizResultsMap = new HashMap<>();
    //Map the training contents to the plan
    for (Integer trainingContentId : trainingContentList) {

        //trainingPlanDetail connects training content and training plans
        TrainingDetail trainingDetail = new TrainingDetail();
        trainingDetail.setTrainingPlan(trainingPlan); //plan id

        //get training content ids
        Optional<TrainingContent> trainingContentOptional = trainingContentRepository.findById(trainingContentId);
        TrainingContent trainingContent = trainingContentOptional.get();
        trainingDetail.setTrainingContent(trainingContent);

        quizResultsMap.put(trainingContentId, "N/A"); //n/a is default quiz result value
        //one quiz result per trainingcontent id
        //assuming each trainingContentId has a quiz assigned to it
        //currently each trainingContent has a quiz assigned / unable to handle without right now

        //save to training detail
        try{
            trainingDetailRepository.save(trainingDetail);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }//end for

    //convert quiz result to json object
    ObjectMapper objectMapper = new ObjectMapper();
    String quizResultsJson;
    try {
        quizResultsJson = objectMapper.writeValueAsString(quizResultsMap);
    } catch (JsonProcessingException e) {
        e.printStackTrace();
        quizResultsJson = "{}";
    }//end try catch

    //assign training plan to user by id
    for(Integer Id : userIds){
        //parse training plan assignment fields
        TrainingPlanAssignment trainingPlanAssignment = new TrainingPlanAssignment();
        trainingPlanAssignment.setPlanId(trainingPlan.getId());
        trainingPlanAssignment.setAssignedDate(Date.from(Instant.parse((String) trainingPlanAssignmentData.get("assignedDate"))));
        trainingPlanAssignment.setCompletedDate(null);
        trainingPlanAssignment.setDueDate(Date.from(Instant.parse((String) trainingPlanAssignmentData.get("dueDate"))));
        trainingPlanAssignment.setStatus("Incomplete");
        trainingPlanAssignment.setIsRequired("Yes");
        trainingPlanAssignment.setTrainingPurpose((String)trainingPlanData.get("trainingArea"));
        trainingPlanAssignment.setUserId(Id);
        trainingPlanAssignment.setIsCanceled(0);

        //save quiz result json so each training content has a quiz result
        trainingPlanAssignment.setQuizResult(quizResultsJson);


        //trainingPlanAssignment.setQuizResult("N/A");
        try {
            trainingPlanAssignmentRepository.save(trainingPlanAssignment);
        }catch(Exception e) {
            e.printStackTrace();
        }//end try catch
    }//end for


    //200 code
    return ResponseEntity.ok("Training Plan created successfully");
}//end createTrainingPlan

    //assign training plan function
    @PostMapping("/AssignTrainingPlan")
    public ResponseEntity<String> assignTrainingPlan(@RequestBody Map<String, Object> assignTrainingPlan) {
        Map<String, Object> trainingPlanData = (Map<String, Object>) assignTrainingPlan.get("trainingPlan");
        List<Integer> userData = (List<Integer>) assignTrainingPlan.get("users");
        List<Users> users = usersRepository.findAll();
        List<TrainingPlan> trainingPlan = trainingPlanRepository.findAll(); //added

        //Get user Ids for assigned users
        for (Users user : users) {
            int userId = user.getId();

            //Assign training plan to user id
            if (userData.contains(userId)) {
                TrainingPlanAssignment planAssignment = new TrainingPlanAssignment();
                planAssignment.setUserId(userId);
                //for content id in training plan detail
                //only for the plan id being used in training plan
                //for()
                //planId set by default

                // Save the TrainingPlanAssignment object to the repository
                try {
                    trainingPlanAssignmentRepository.save(planAssignment);
                    return ResponseEntity.ok("Training Plan successfully assigned");

                } catch (Exception e) {
                    return (ResponseEntity<String>) ResponseEntity.badRequest();
                }//end tryCatch
            }//end if
        }//end for
        return ResponseEntity.ok("Training Plan successfully assigned");
    }//end assignTrainingPlan

    //display all training plans created
    @GetMapping("/GetAllTrainingPlans")
   public List<TrainingPlan> getAllTrainingPlans() {
        return trainingPlanRepository.findAll();
    }//end getAllPlans

    // display all training details created
    @GetMapping("/GetAllTrainingDetails")
    public List<TrainingDetail> getAllTrainingDetails() {
        return (List<TrainingDetail>) trainingDetailRepository.findAll();
    }//end getAllTrainingDetails

    // display all assigned plans created
    @GetMapping("/GetAllAssignedPlans")
    public List<TrainingPlanAssignment> getAllAssignedPlans() {
        return (List<TrainingPlanAssignment>) trainingPlanAssignmentRepository.findAll();
    }//end getAllAssignedPlans

    @GetMapping("/GetQuizStatus")
    public ResponseEntity<Map<String, String>> getQuizStatus(@RequestParam int assignmentId) {
        Optional<TrainingPlanAssignment> planAssignmentOptional = trainingPlanAssignmentRepository.findById(assignmentId);

        if (planAssignmentOptional.isPresent()) {
            TrainingPlanAssignment planAssignment = planAssignmentOptional.get();
            String quizStatus = planAssignment.getQuizResult();

            // Prepare a map to send the quiz status string
            Map<String, String> response = new HashMap<>();
            response.put("quizStatus", quizStatus);

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/UpdateQuizResults")
    public ResponseEntity<String> updateQuizResults(@RequestBody Map<String, Object> quizData) {
        int assignmentId = (int) quizData.get("assignmentId"); // Change planId to assignmentId
        String quizStatus = (String) quizData.get("quizStatus");

        // Retrieve the training plan assignment
        Optional<TrainingPlanAssignment> planAssignmentOptional = trainingPlanAssignmentRepository.findById(assignmentId);

        if (planAssignmentOptional.isPresent()) {
            TrainingPlanAssignment planAssignment = planAssignmentOptional.get();

            // Update the quiz result for the training plan assignment
            planAssignment.setQuizResult(quizStatus);
            trainingPlanAssignmentRepository.save(planAssignment);

            return ResponseEntity.ok("Quiz results updated successfully");
        }//end if
         else {
            return ResponseEntity.notFound().build();
        }//end else
    }//end updateQuizResults

    @PutMapping("/UpdateStatus")
    public ResponseEntity<String> updateStatus(@RequestParam int assignmentId, @RequestBody Map<String, Object> statusData) {
        String status = (String) statusData.get("status");
        String completedDate = (String) statusData.get("completedDate");

        Optional<TrainingPlanAssignment> planAssignmentOptional = trainingPlanAssignmentRepository.findById(assignmentId);

        if (planAssignmentOptional.isPresent()) {
            TrainingPlanAssignment planAssignment = planAssignmentOptional.get();

            // Update the status and completed date for the training plan assignment
            planAssignment.setStatus(status);
            planAssignment.setCompletedDate(completedDate != null ? Date.from(Instant.parse(completedDate)) : null);
            trainingPlanAssignmentRepository.save(planAssignment);

            return ResponseEntity.ok("Status updated successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    //Updating information in training plan
    //Doesn't change the training content inside it/quizzes
    //Change name or description of plan
    @PutMapping("/updateTrainingPlan/{id}")
    public ResponseEntity<String> updateTrainingPlan(@RequestBody TrainingPlan trainingPlan){
        //Optional<TrainingPlan> trainingPlanToUpdate = trainingPlanRepository.findById(assignmentId);

        trainingPlanRepository.save(trainingPlan);

        return ResponseEntity.ok("Training plan was updated");
    }//end updateTrainingPlan

}//end class
