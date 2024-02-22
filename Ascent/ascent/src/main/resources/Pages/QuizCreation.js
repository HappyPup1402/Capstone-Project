import "../Styles/QuizCreation.css"
import MainNavbar from "../Components/MainNavbar";
import Footer from "../Components/Footer";
import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import QuizQuestion from "../Components/QuizQuestion";


function QuizCreation() {

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const email = localStorage.getItem('email');
    const currentDate = new Date();  // Create a new Date object representing the current date and time
    const [courses, setCourses] = useState([]);

    const [createNewQuiz, setCreateNewQuiz] = useState({
        quiz: {
            name: "",
            createBy: email,
            createDate: currentDate,
            difficulty: "",
            passingGrade: "",
            linkedCourse: ""
        },
        questions: [
            {
                question: "", // Default question text
                answerKey: "",
                questionType: "",
                selections: "",

                // Add other question properties as needed
            },
        ],
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCreateNewQuiz((prevCreateNewQuiz) => ({
            ...prevCreateNewQuiz,
            quiz: {
                ...prevCreateNewQuiz.quiz,
                [name]: value,
            },
        }));
    };

    const handleAddQuestion = () => {
        if (createNewQuiz.questions.length < 50) {
            const newQuestionNumber = createNewQuiz.questions.length + 1;
            const newQuestion = {
                question: "",
                // Add other question properties as needed
            };

            setCreateNewQuiz((prevCreateNewQuiz) => ({
                ...prevCreateNewQuiz,
                questions: [...prevCreateNewQuiz.questions, newQuestion],
            }));
        }
    };

    const handleDeleteQuestion = () => {
        if (createNewQuiz.questions.length > 1) {
            setCreateNewQuiz((prevCreateNewQuiz) => {
                const updatedQuestions = [...prevCreateNewQuiz.questions];
                updatedQuestions.pop();
                return {
                    ...prevCreateNewQuiz,
                    questions: updatedQuestions,
                };
            });
        }
    };

    const addQuestionToQuiz = (questionData) => {
        setCreateNewQuiz((prevCreateNewQuiz) => {
            const updatedQuestions = [...prevCreateNewQuiz.questions];
            updatedQuestions[questionData.questionNumber - 1] = questionData;
            return {
                ...prevCreateNewQuiz,
                questions: updatedQuestions,
            };
        });
    };

    // const validateFields = () => {
    //     if (
    //         createNewQuiz.title.trim() === '' ||
    //         createNewQuiz.contentType.trim() === '' ||
    //         createNewQuiz.hasQuiz.trim() === '' ||
    //         // createNewCourse.contentLink.trim() === '' ||
    //         createNewQuiz.description.trim() === ''
    //     ) {
    //         setErrorMessage('All fields are required.');
    //         console.error("User did not fill all required fields.")
    //         return false;
    //     }
    //
    //     return true;
    // };
    const handleNewQuiz = () => {
        const passingGradeAsInt = parseInt(createNewQuiz.quiz.passingGrade, 10);
        const linkedCourseAsInt = parseInt(createNewQuiz.quiz.linkedCourse, 10);

        // Send the formData to the Spring backend here
        fetch("http://localhost:8080/api/QuizCreation/CreateQuiz", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Origin: "http://localhost:3000",
            },
            body: JSON.stringify({
                ...createNewQuiz,
                quiz: {
                    ...createNewQuiz.quiz,
                    passingGrade: passingGradeAsInt,  // Send it as an integer
                    linkedCourse: linkedCourseAsInt,  // Send it as an integer
                },
            }),
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log("Successfully created a Quiz!");
                    console.log(createNewQuiz);
                    navigate('/QuizContent')
                } else if (response.status === 409) {
                    setErrorMessage("Quiz not created");
                    console.log(createNewQuiz);
                    throw new Error("Quiz Creation Error!");
                } else {
                    // Handle login failure (e.g., display an error message)
                    setErrorMessage("Quiz Creation Error!");
                    console.log(createNewQuiz);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

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


    return <div className="newQuizContainer">
        <MainNavbar/>
        <div className="newQuizContent">
            <div className="createNewQuizBox">
                <div className="createNewQuizBoxTopRow">
                    <h1>Create Quiz</h1>
                </div>
                <div className="createNewQuizBoxRow">
                    <p>Quiz Name: </p>
                    <input
                        type="text"
                        className="newQuizName"
                        name="name"
                        value={createNewQuiz.quiz.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="createNewQuizBoxRow">
                    <p>Attached Course: </p>
                    <select name="linkedCourse"
                            className="newQuizAttachedCourse"
                            value={createNewQuiz.quiz.linkedCourse} // Use the state value here
                            onChange={handleInputChange}
                    >
                        <option value="" disabled selected></option>
                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="createNewQuizBoxRow">
                    <p>Difficulty: </p>
                    <select name="difficulty" className="newQuizDifficulty"
                            onChange={handleInputChange}>
                        <option value="" disabled selected></option>
                        <option value="Easy">Easy</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>
                <div className="createNewQuizBoxRow">
                    <p>Passing %: </p>
                    <input
                        type="number"
                        className="newQuizPassingPercentage"
                        name="passingGrade"
                        min="0"
                        max="100"
                        step="5"
                        value={createNewQuiz.quiz.passingGrade}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="createNewQuizBoxRowQuestions">
                    <h1>Questions:</h1>
                </div>
                <div>
                    {createNewQuiz.questions.map((question, index) => (
                        <div key={index}>
                            <QuizQuestion
                                questionNumber={index + 1}
                                addQuestionToQuiz={addQuestionToQuiz} // Pass the callback function
                            />
                        </div>
                    ))}
                </div>
                <div className="createNewQuizAddDeleteRow">
                    <input
                        type="button"
                        value={`Add Question (${createNewQuiz.questions.length})`}
                        className="addQuestion"
                        onClick={handleAddQuestion}
                    />
                    <input
                        type="button"
                        value={`Delete Question (${createNewQuiz.questions.length})`}
                        className="deleteQuestion"
                        onClick={handleDeleteQuestion}
                    />
                </div>
                <div className="createNewQuizBoxBottomRow">
                    <input
                        type="button"
                        value="Create"
                        className="newQuizSubmit"
                        onClick={handleNewQuiz}
                    />
                    {errorMessage && (
                        <div className="error-message">{errorMessage}</div>
                    )}
                </div>

            </div>
        </div>
        <Footer/>
    </div>
}

    export default QuizCreation;