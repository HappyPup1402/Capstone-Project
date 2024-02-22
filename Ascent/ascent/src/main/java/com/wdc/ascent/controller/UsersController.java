package com.wdc.ascent.controller;

import com.wdc.ascent.model.TrainingContent;
import com.wdc.ascent.model.TrainingPlan;
import com.wdc.ascent.model.Users;
import com.wdc.ascent.repository.TrainingContentRepository;
//import com.wdc.ascent.repository.TrainingPlanAssignmentRepository;
import com.wdc.ascent.repository.TrainingPlanRepository;
import com.wdc.ascent.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
//api for users table
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UsersController {

    @Autowired
    UsersRepository usersRepository;
    TrainingContentRepository trainingContentCatalogRepository;

    TrainingPlanRepository trainingPlanRepository;

    //CREATE USER IS SETTING NULL FOR FIRST NAME, LAST NAME, ROLE, MANAGER_EMAIL
    //declare the uri for create account page
    //status code 201
    @PostMapping("/CreateAccount")
    public ResponseEntity<String> createUser(@RequestBody Users user){
        String email = user.getEmail();
        //check if user exists
        Users userExists = usersRepository.findByEmail(email);

        if (userExists != null) {
            // A user with the same email already exists
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User with this email already exists");
        } //end if
        else {
            //save user if it doesn't exist
            //new user
            usersRepository.save(user);
            return ResponseEntity.status(HttpStatus.CREATED).body("User created successfully");
        }//end else
    }//end createUser

    //uri for login page
    //might need to change frontend uri to below
    @PostMapping ("/Login")
    public ResponseEntity<String> loginUser(@RequestBody Map<String, String> loginData){
        String email = loginData.get("email");
        String password = loginData.get("password");

        Users userExists = usersRepository.findByEmail(email);
        if (userExists != null && userExists.getPassword().equals(password)) {
            //User exists
            //login successful
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Login successful");
        } //end if
        else {
            //user doesn't exist
            //login failed
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User does not exist");
        }//end else
    }//end loginUser

    //bring to course catalog
    @GetMapping("/GetAllCourses")
    public List<TrainingContent> getAllCourses(){
        return trainingContentCatalogRepository.findAll();
    }//end getAllCourses

   //userProfile crud
   //maybe add a change password in here
    @PostMapping("/UserProfile")
    public Users viewUserProfile(@RequestBody Users user) {
        String email = user.getEmail();
        Users userInfo = usersRepository.findByEmail(email);
        return userInfo;
    }//end viewUserProfile

    @GetMapping("/GetAllUsers")
    public List<Users> getAllUsers(){
        return usersRepository.findAll();
    }//end getAllUsers

    //rough myTraining back-end
    //not sure if we will need to grab from my training plan or plan assignment
  
    @PostMapping("/MyTraining")
    public TrainingPlan viewMyTrainings(@RequestBody TrainingPlan myTrainingPlan) {
        int planID = myTrainingPlan.getId();
        TrainingPlan myPlan = trainingPlanRepository.findById(planID).orElse(null);
        return myPlan;
    }

    //return to later 10/3
    //change user's password after login
    @PutMapping("/update_password/{email}")
    public ResponseEntity<String> updatePassword(@PathVariable String email, @RequestBody String password){
        //user exists because logged in
        Users userExists = usersRepository.findByEmail(email);
        userExists.setPassword(password);
        usersRepository.save(userExists);

        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Password successfully changed");
    }//end updatePassword

    @DeleteMapping("/DeleteUser/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable int id){
        usersRepository.deleteById(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("User was deleted");
    }
}//end class