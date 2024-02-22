package com.wdc.ascent.controller;

import com.wdc.ascent.model.TrainingContent;
import com.wdc.ascent.repository.TrainingContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
//api for training content
@RequestMapping("/api/trainingcontent")
@CrossOrigin(origins = "http://localhost:3000")
public class TrainingContentController {

    @Autowired
    TrainingContentRepository trainingContentRepository;


    //check training content by seeing if the same title is used
    //if not then add a new course
    @PostMapping("/NewCourse")
    public ResponseEntity<String> createNewCourse(@RequestBody TrainingContent trainingContent) {
        String title = trainingContent.getTitle();
        TrainingContent existingContent = trainingContentRepository.findByTitle(title);
        if (existingContent != null) {
            // this title is already in training content
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Content link already exists in a training content");
        } //end if
        else {
            //save new content
            trainingContentRepository.save(trainingContent);
            return ResponseEntity.status(HttpStatus.CREATED).body("content was created");
        }//end else
    }//end createNewCourse



    //course catalog
    @GetMapping("/GetAllCourses")
    public List<TrainingContent> getAllCourses(){
        return trainingContentRepository.findAll();
    }//end getAllCourses


    //update Training Content
    @PutMapping ("/UpdateCourse/{id}")
    public ResponseEntity<String> updateCourse(@RequestBody TrainingContent trainingContent){
        trainingContentRepository.save(trainingContent);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("course was updated");
    }


}//end controller



