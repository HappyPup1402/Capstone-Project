package com.wdc.ascent.controller;

import com.wdc.ascent.model.*;
import com.wdc.ascent.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

@RestController
//api for quiz
@RequestMapping("/api/QuizCreation")
@CrossOrigin(origins = "http://localhost:3000")
public class QuizController {
    private final QuizRepository quizRepository;
    private final QuizDetailRepository quizDetailRepository;
    private final QuizQuestionRepository quizQuestionRepository;

    private final TrainingContentRepository trainingContentRepository;

    private final ContentQuizMapRepository contentQuizMapRepository;

    @Autowired
    public QuizController(QuizRepository quizRepository, QuizDetailRepository quizDetailRepository, QuizQuestionRepository quizQuestionRepository, TrainingContentRepository trainingContentRepository, ContentQuizMapRepository contentQuizMapRepository) {
        this.quizRepository = quizRepository;
        this.quizDetailRepository = quizDetailRepository;
        this.quizQuestionRepository = quizQuestionRepository;
        this.trainingContentRepository = trainingContentRepository;
        this.contentQuizMapRepository = contentQuizMapRepository;
    }

    //create a quiz function for new quizzes
    @PostMapping("/CreateQuiz")
    @Transactional
    public ResponseEntity<String> createQuiz(@RequestBody Map<String, Object> createNewQuiz) {
        Map<String, Object> quizData = (Map<String, Object>) createNewQuiz.get("quiz");
        List<Map<String, Object>> questionDataList = (List<Map<String, Object>>) createNewQuiz.get("questions");

        //creates quiz
        Quiz quiz = new Quiz();
        quiz.setName((String) quizData.get("name"));
        quiz.setDescription("N/A");
        quiz.setStatus(1);
        quiz.setCreateBy((String) quizData.get("createBy"));
        quiz.setCreateDate(Date.from(Instant.parse((String) quizData.get("createDate"))));
        quiz.setDifficulty((String) quizData.get("difficulty"));
        quiz.setPassingGrade((int) quizData.get("passingGrade"));

        if(quizRepository.findByName(quiz.getName()) != null){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Quiz already exist");
        }
        quizRepository.save(quiz);

        //Link quizzes and training content to quiz map
        ContentQuizMap contentQuizMap = new ContentQuizMap();
        int quizIdForMapping = quiz.getQuizId();
        contentQuizMap.setQuizId(quizIdForMapping);
        //linkedCourse is the trainingcontent ID
        int linkedCourseVar = (int) quizData.get("linkedCourse");
        contentQuizMap.setContentId(linkedCourseVar);
        try{
        contentQuizMapRepository.save(contentQuizMap);
        } catch (Exception e) {
            e.printStackTrace();
            // Log the exception for further analysis
        }//end try catch

        //Map the Quiz questions together
        for (Map<String, Object> questionData : questionDataList) {
            QuizQuestion quizQuestion = new QuizQuestion();
            quizQuestion.setQuestion((String) questionData.get("question"));
            quizQuestion.setSelections((String) questionData.get("selections"));
            quizQuestion.setAnswerKey((String) questionData.get("answerKey"));
            quizQuestion.setQuestionType((String) questionData.get("questionType"));
            quizQuestion.setIsRemoved(0); // 0 by default
            quizQuestionRepository.save(quizQuestion); // Save the quiz_question object

            //Store quiz id in quiz detail
            QuizDetail quizDetail = new QuizDetail();
            quizDetail.setQuiz(quiz);
            quizDetail.setQuizQuestion(quizQuestion); //Save question ids to quiz detail
            quizDetailRepository.save(quizDetail);

        }//end for

        // Return a response or status as needed
        return ResponseEntity.ok("Quiz and associated questions created successfully");

    }//end


    //returns all quizzes in database
    @GetMapping("/GetAllQuizzes")
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    @GetMapping("/GetAllQuestions")
    public List<QuizQuestion> getAllQuestions() {
        return quizQuestionRepository.findAll();
    }

    @GetMapping("/GetQuizDetail")
    public List<QuizDetail> getAllQuizDetail() {
        return quizDetailRepository.findAll();
    }

    @GetMapping("/GetContentQuizMap")
        public List<ContentQuizMap> getAllContentQuizMap() {
           // return quizRepository.findAll()
        return contentQuizMapRepository.findAll();
    }//end getAllQuizzes

    @GetMapping("/GetQuizById/{quizId}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable int quizId) {
        Optional<Quiz> quizOptional = quizRepository.findById(quizId);

        if (quizOptional.isPresent()) {
            Quiz quiz = quizOptional.get();
            return ResponseEntity.ok(quiz);
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }//end getQuizById

    //update quiz object
    //doesn't change questions
    //only the name description stuff
    @PutMapping("/updateQuiz/{id}")
    public ResponseEntity<String> updateQuiz(@RequestBody Quiz quiz){
        quizRepository.save(quiz);
        return ResponseEntity.ok("Training plan was updated");
    }//end updateTrainingPlan

}//end class

