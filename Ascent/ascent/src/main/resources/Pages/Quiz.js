import MainNavbar from "../Components/MainNavbar";
import Footer from "../Components/Footer";
import "../Styles/Quiz.css"
import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom"; // Import useParams


function Quiz() {

    const {quizId} = useParams(); // Get quizId from route parameters
    const quizIdInt = parseInt(quizId, 10);
    const [showQuizContent, setShowQuizContent] = useState(false);
    const [contentQuizMap, setContentQuizMap] = useState([]);
    const [quizDetail, setQuizDetail] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [userScore, setUserScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(""); // State to track the selected answer


    useEffect(() => {
        if (quizId) {
            fetch(`http://localhost:8080/api/QuizCreation/GetQuizById/${quizId}`) // Adjust the API endpoint
                .then((response) => {
                    if (!response.ok) {
                        throw Error(`Request failed with status ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => setQuizzes([data])) // Set the fetched quiz as an array
                .catch((error) => console.error("Error fetching data:", error));
        }
    }, [quizId]);

    useEffect(() => {
        fetch('http://localhost:8080/api/QuizCreation/GetContentQuizMap')
            .then(response => {
                if (!response.ok) {
                    throw Error(`Request failed with status ${response.status}`);
                }
                return response.json();
            })
            .then(data => setContentQuizMap(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        // Fetch the courses and set them in the state
        fetch('http://localhost:8080/api/trainingcontent/GetAllCourses')
            .then(response => {
                if (!response.ok) {
                    throw Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setCourses(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        // Fetch the courses and set them in the state
        fetch('http://localhost:8080/api/QuizCreation/GetQuizDetail')
            .then(response => {
                if (!response.ok) {
                    throw Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setQuizDetail(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // Used for finding the linked course on the top right of the quiz card
    function findLinkedCourse(quizId) {
        const mapEntry = contentQuizMap.find(entry => entry.quizId === quizId);
        if (mapEntry) {
            // Assuming you have an array of courses with course IDs
            const linkedCourse = courses.find(course => course.id === mapEntry.contentId);
            if (linkedCourse) {
                return linkedCourse.title;
            }
        }
        return "";
    }

    // Used to calculate the number of questions a quiz has
    function getNumberOfQuestions(quizId) {
        const questionsForQuiz = quizDetail.filter((detail) => detail.quiz.quizId === quizId);
        return questionsForQuiz.length;
    }

    // Use the filter function to get all quizDetail objects with the specified quizId
    const quizDetailsForQuiz = quizDetail.filter(detail => detail.quiz.quizId === quizIdInt);

    // Map through the filtered quizDetails to obtain each quizQuestion
    const quizQuestions = quizDetailsForQuiz.map(detail => detail.quizQuestion);

    // Updates your answers while taking the quiz
    const handleAnswerChange = (answer) => {
        const updatedAnswers = [...userAnswers];
        updatedAnswers[currentQuestion] = answer;
        setUserAnswers(updatedAnswers);
        setSelectedAnswer(answer);
    };

    // Starts your quiz
    const handleBeginClick = () => {
        // Start the quiz
        setShowQuizContent(true);
        setCurrentQuestion(0); // Reset current question index
        setUserScore(0); // Reset user score for the new quiz
    };

    // Displays next question and generates your score
    const handleNextQuestion = () => {

        const passingPercentageDetail = quizDetailsForQuiz
        if (currentQuestion < quizQuestions.length - 1) {
            // Submit the answer and calculate the score
            if (userAnswers[currentQuestion]) {
                const isCorrect = userAnswers[currentQuestion] === quizQuestions[currentQuestion].answerKey;
                console.log(userAnswers[currentQuestion])
                console.log(quizQuestions[currentQuestion].answerKey)
                if (isCorrect) {
                    setUserScore(userScore + 1);

                }
            }

            // Move to the next question
            setCurrentQuestion(currentQuestion + 1);

            // Reset the selected answer for the next question
            setSelectedAnswer("");
        } else {
            // Last question, calculate the final score
            if (userAnswers[currentQuestion]) {
                const isCorrect = userAnswers[currentQuestion] === quizQuestions[currentQuestion].answerKey;

                if (isCorrect) {
                    setUserScore(prevScore => prevScore + 1);
                }
            }

            // Quiz is completed
            setQuizCompleted(true);
        }
    };

    // Updating the quiz_result if quiz is passed ============================

    useEffect(() => {
        // Load assignmentId you want to update if quiz is passed
        const currentAssignmentId = localStorage.getItem('currentAssignmentId');
        // Convert assignmentId to an int
        let currentAssignmentIdAsInt = parseInt(currentAssignmentId)
        if (currentAssignmentId != null) {
            // Fetch existing quiz status for the assignment
            fetch(`http://localhost:8080/api/PlanAssignment/GetQuizStatus?assignmentId=${currentAssignmentId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // Data should contain the existing quiz status string
                    const existingQuizStatusString = data.quizStatus;

                    // Convert the existing string to an object
                    const existingQuizStatusObject = JSON.parse(existingQuizStatusString);
                    // console.log('Existing Quiz Status Object:', existingQuizStatusObject);

                    if (quizCompleted) {
                        if (quizzes.length > 0) {
                            // If the quiz is passed, update quiz_result
                            if ((userScore / getNumberOfQuestions(quizIdInt)) * 100 >= quizzes[0].passingGrade) {
                                console.log("You Passed")
                                console.log(existingQuizStatusObject)
                                console.log(quizId)

                                // Modify specific quizId in quiz_result
                                // Check if quizIdInt matches any key in the object
                                if (existingQuizStatusObject.hasOwnProperty(quizId)) {
                                    console.log("Hi")
                                    // Update the value from "N/A" to "passed"
                                    existingQuizStatusObject[quizId] = "Passed";

                                    // Convert the object back to a string
                                    const updatedQuizStatusString = JSON.stringify(existingQuizStatusObject);
                                    console.log(updatedQuizStatusString)

                                    // Make a POST request to send quizStatusString to the backend
                                    fetch('http://localhost:8080/api/PlanAssignment/UpdateQuizResults', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            assignmentId: currentAssignmentIdAsInt,
                                            quizStatus: updatedQuizStatusString,
                                        }),
                                    })
                                        .then(response => {
                                            if (!response.ok) {
                                                throw new Error('Network response was not ok');
                                            }
                                            return response.json();
                                        })
                                        .then(data => {
                                            console.log('Quiz results updated successfully:', data);
                                        })
                                        .catch(error => console.error('Error updating quiz results:', error));
                                }

                            }
                            // Quiz Failed
                            else {
                                // Do Nothing
                                // console.log("You Failed")
                            }
                        }
                    }
                })
                .catch(error => console.error('Error fetching existing quiz status:', error));
        }



    }, [quizCompleted]);


    return (
        quizzes.map(quiz => (
            <div className="quizContainerNew" key={quiz.quizId}>
                <MainNavbar/>
                <div className="quizBackground">
                    <div className="quizIntroBox">
                        {showQuizContent ? (
                            // User is taking the quiz
                            <div>
                                {quizCompleted ? (
                                    // Quiz is completed, display the score
                                    <div className="quizIntroBoxInitial">
                                        <div className="quizIntroBoxHeader">
                                            <h1>{quiz.name}</h1>
                                            <h1>{findLinkedCourse(quiz.quizId)}</h1>
                                        </div>
                                        <h1 className="quizYourQuizScoreLabel">Your Quiz Score</h1>
                                        {(userScore / getNumberOfQuestions(quiz.quizId)) * 100 >= quiz.passingGrade ? (
                                            <p className="quizCompletionStatus">You passed!</p>
                                        ) : (
                                            <p className="quizCompletionStatus">You failed!</p>
                                        )}
                                        <p className="quizScoreAnalysis">You got {userScore} out
                                            of {quizQuestions.length} questions correct!</p>
                                        <p className="quizPercentage">{(userScore / getNumberOfQuestions(quiz.quizId)) * 100}%</p>
                                        <div className="quizIntroBoxBegin">
                                            <input
                                                type="button"
                                                value="Go Back"
                                                onClick={() => window.history.back()}
                                            />
                                            <input
                                                type="submit"
                                                value="Retry"
                                                onClick={() => window.location.reload()}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    // Display questions
                                    <div className="quizIntroBoxInitial">
                                        <div className="quizIntroBoxHeader">
                                            <h1>{quiz.name}</h1>
                                            <h1>{findLinkedCourse(quiz.quizId)}</h1>
                                        </div>
                                        <div className="quizQuestionLabel">
                                            <h1>Question {currentQuestion + 1}</h1>
                                        </div>
                                        <div className="quizQuestion">
                                            <p>{quizQuestions[currentQuestion].question}</p>
                                        </div>
                                        <div className="quizQuestionOptions">
                                            <ul>
                                                {quizQuestions[currentQuestion].selections.split(', ').map((option, index) => (
                                                    <li key={index}>
                                                        <label>
                                                            <input
                                                                type="radio"
                                                                name={`question${currentQuestion}`}
                                                                value={option}
                                                                checked={selectedAnswer === option} // Check if this option is selected
                                                                onChange={(e) => handleAnswerChange(e.target.value)}
                                                            />
                                                            {option}
                                                        </label>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="quizIntroBoxBegin">
                                            <input
                                                type="submit"
                                                value="Next"
                                                onClick={handleNextQuestion} // Add the click event handler
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Initial content
                            <div className="quizIntroBoxInitial">
                                <div className="quizIntroBoxHeader">
                                    <h1 className="quizIntroBoxHeaderName">{quiz.name}</h1>
                                    <h1>{findLinkedCourse(quiz.quizId)}</h1>
                                </div>
                                <div className="quizIntroBoxDescription">
                                    <p>
                                        You will now be tested on the material covered in the
                                        "{findLinkedCourse(quiz.quizId)}" training.
                                    </p>
                                    <p>Please make sure you try your best!</p>
                                </div>
                                <div className="quizIntroBoxInfo">
                                    <p>Number of Q's: {getNumberOfQuestions(quiz.quizId)}</p>
                                    <p>Passing Percentage = {quiz.passingGrade}%</p>
                                </div>
                                <div className="quizIntroBoxBegin">
                                    <input
                                        type="button"
                                        value="Go Back"
                                        onClick={() => window.history.back()}
                                    />
                                    <input
                                        type="submit"
                                        value="Begin"
                                        onClick={handleBeginClick} // Add the click event handler
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <Footer/>
            </div>
        ))
    )
}

export default Quiz;