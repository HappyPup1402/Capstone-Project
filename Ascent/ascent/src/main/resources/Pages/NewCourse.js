import "../Styles/NewCourse.css"
import MainNavbar from "../Components/MainNavbar";
import Footer from "../Components/Footer";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";


function NewCourse() {

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const email = localStorage.getItem('email');
    const currentDate = new Date();  // Create a new Date object representing the current date and time

    const [createNewCourse, setCreateNewCourse] = useState({
        title: "",
        contentLink: "",
        contentType: "",
        trainingArea: "",
        description: "",
        createdBy: email,
        dateCreated: currentDate,
        hasQuiz: "",
        quizLink: ""
    });

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setCreateNewCourse({
            ...createNewCourse,
            [name]: value,
        });
    }
    // console.log(createNewCourse)
    const validateFields = () => {
        if (
            createNewCourse.title.trim() === '' ||
            createNewCourse.contentType.trim() === '' ||
            createNewCourse.trainingArea.trim() === '' ||
            createNewCourse.contentLink.trim() === '' ||
            createNewCourse.description.trim() === ''
        ) {
            setErrorMessage('All fields are required.');
            console.error("User did not fill all required fields.")
            return false;
        }

        return true;
    };
    const handleNewCourse = () => {

        if (!validateFields()) {
            return;
        }

        // Send the formData to the Spring backend here
        fetch('http://localhost:8080/api/trainingcontent/NewCourse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:3000',
            },
            body: JSON.stringify(createNewCourse),
        })
            .then((response) => {
                if (response.status === 201) {
                    console.log("Successfully created a Course!")
                    // console.log(createNewCourse)
                    navigate('/TrainingContent');
                    // Successful login, you can redirect or perform other actions here

                } else if (response.status === 409) {
                    // console.log(createNewCourse);
                    setErrorMessage('Course not created');
                    throw new Error("Course Creation Error!")

                } else {
                    // Handle login failure (e.g., display an error message)
                    // console.log(createNewCourse);
                    setErrorMessage("Course Creation Error!");

                }
            })
            .catch((error) => {
                console.error(error);
            });

    };


    return <div className="newCourseContainer">
        <MainNavbar/>
        <div className="newCourseContent">
            <div className="createNewCourseBox">
                <div className="createNewCourseBoxLeft">
                    <h1 className="createNewCourseTitle">Create Course</h1>
                </div>
                <div className="createNewCourseBoxMiddle">
                    <div className="createNewCourseBoxMiddleBlank"/>
                    <div className="createNewCourseBoxMiddleRow">
                        <p>Course Name: </p>
                        <input
                            type="text"
                            className="newCourseTitle"
                            name="title"
                            value={createNewCourse.title}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="createNewCourseBoxMiddleRow">
                        <p>Course Type: </p>
                        <select name="contentType" className="newCourseType" value={createNewCourse.contentType}
                                onChange={handleInputChange}>
                            <option value="" disabled selected></option>
                            <option value="Document">Document</option>
                            <option value="Video">Video</option>
                        </select>
                    </div>
                    <div className="createNewCourseBoxMiddleRow">
                        <p>Training Area: </p>
                        <select name="trainingArea" className="newCourseTrainingArea" value={createNewCourse.trainingArea}
                                onChange={handleInputChange}>
                            <option value="" disabled selected></option>
                            <option value="frontEnd">Front-End</option>
                            <option value="backEnd">Back-End</option>
                            <option value="database">Database</option>

                        </select>
                    </div>
                    <div className="createNewCourseBoxMiddleRow">
                        <p>Description: </p>
                        <textarea
                            name="description"
                            className="newCourseDescription"
                            value={createNewCourse.description}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="createNewCourseBoxMiddleRow">
                        <p>Link to Content: </p>
                        <input
                            type="text"
                            className="newCourseContentLink"
                            name="contentLink"
                            value={createNewCourse.contentLink}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="createNewCourseBoxMiddleBlank">
                    </div>
                </div>
                <div className="createNewCourseBoxRight">
                    {errorMessage && (
                        <div className="error-message">{errorMessage}</div>
                    )}
                    <input
                        type="button"
                        value="Create"
                        className="newCourseSubmit"
                        onClick={handleNewCourse}
                    />
                </div>
            </div>
        </div>
        <Footer/>
    </div>
}

export default NewCourse;
