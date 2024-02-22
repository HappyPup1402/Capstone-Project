import "../Styles/NewTrainingPlan.css"
import MainNavbar from "../Components/MainNavbar";
import Footer from "../Components/Footer";
import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';

function NewTrainingPlan() {


    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const email = localStorage.getItem('email');
    const currentDate = new Date();  // Create a new Date object representing the current date and time

    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);


    const [createNewPlan, setCreateNewPlan] = useState({
        trainingPlan: {
            name: "",
            description: "",
            createBy: email,
            createDate: currentDate,
            trainingArea: "",
        },
        trainingPlanAssignment: {
            assignedDate: currentDate,
            dueDate: "",
            userId: ""
        },
        trainingContent: "",

    });


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCreateNewPlan((prevCreateNewPlan) => ({
            ...prevCreateNewPlan,
            trainingPlan: {
                ...prevCreateNewPlan.trainingPlan,
                [name]: value,
            },
        }));
    };

    const handleTrainingAreaChange = (selectedOptions) => {
        const selectedValues = selectedOptions.map((option) => option.value);
        const trainingAreaString = selectedValues.join(','); // Convert the array to a comma-separated string
        setCreateNewPlan((prevCreateNewPlan) => ({
            ...prevCreateNewPlan,
            trainingPlan: {
                ...prevCreateNewPlan.trainingPlan,
                trainingArea: trainingAreaString, // Update the trainingArea in trainingPlan
            },
        }));
    };
    const handleTrainingContentChange = (selectedOptions) => {
        const selectedValues = selectedOptions.map((option) => parseInt(option.value, 10));
        setCreateNewPlan({
            ...createNewPlan,
            trainingContent: selectedValues, // Update trainingContent in createNewPlan
        });
    };

    const handleEmployeeChange = (selectedOptions) => {
        const selectedValues = selectedOptions.map((option) => option.value);
        setCreateNewPlan((prevCreateNewPlan) => ({
            ...prevCreateNewPlan,
            trainingPlanAssignment: {
                ...prevCreateNewPlan.trainingPlanAssignment,
                userId: selectedValues,
            },
        }));
        console.log(selectedValues)
    };


    const handleDateChange = (date) => {
        setCreateNewPlan((prevCreateNewPlan) => ({
            ...prevCreateNewPlan,
            trainingPlanAssignment: {
                ...prevCreateNewPlan.trainingPlanAssignment,
                dueDate: date,
            },
        }));
    };

    useEffect(() => {
        fetch('http://localhost:8080/api/users/GetAllUsers')
            .then(response => {
                if (!response.ok) {
                    throw Error(`Request failed with status ${response.status}`);
                }
                return response.json();
            })
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const employeeOptions = users.map((user) => ({
        value: user.id, // Use the user ID as the value
        label: `${user.firstName} ${user.lastName}`, // Use the user's name as the label
    }));

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

    const courseOptions = courses.map((course) => ({
        value: course.id, // Use the course ID as the value
        label: course.title, // Use the course title as the label
    }));

    // const validateFields = () => {
    //     if (
    //         createNewPlan.title.trim() === '' ||
    //         createNewPlan.contentType.trim() === '' ||
    //         createNewPlan.trainingArea.trim() === '' ||
    //         createNewPlan.description.trim() === '' ||
    //         createNewPlan.assignee.trim() === ''||
    //         createNewPlan.dueDate.trim() === ''||
    //         createNewPlan.reminder.trim() === ''
    //
    //
    //     ) {
    //         setErrorMessage('All fields are required.');
    //         console.error("User did not fill all required fields.")
    //         return false;
    //     }
    //
    //     return true;
    // };
    const handleNewPlan = () => {

        // if (!validateFields()) {
        //     return;
        // }

        console.log(createNewPlan)


        // Send the formData to the Spring backend here
        fetch('http://localhost:8080/api/PlanAssignment/CreateTrainingPlan', { /*Select URL from back-end */
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:3000',
            },
            body: JSON.stringify(createNewPlan),
        })
            .then((response) => {
                if (response.status === 200) {
                    // navigate('/TrainingContents');
                    console.log("Successfully created a Plan!")
                    console.log(createNewPlan)
                    // navigate('/TrainingPlan');
                    // Successful login, you can redirect or perform other actions here

                } else if (response.status === 409) {
                    setErrorMessage('Plan not created');
                    throw new Error("Plan Creation Error!")
                } else {
                    // Handle login failure (e.g., display an error message)
                    setErrorMessage("Plan Creation Error!");
                }
            })
            .catch((error) => {
                console.error(error);
            });

    };


    return <div className="newPlanContainer">
        <MainNavbar/>
        <div className="newPlanContent">
            <div className="createNewPlanBox">
                <div className="createNewPlanBoxLeft">
                    <h1 className="createNewPlanTitle">New Training Plan</h1>
                </div>
                <div className="createNewPlanBoxMiddle flex-container">
                    <div className="createNewPlanBoxMiddleBlank"/>
                    <div className="createNewPlanBoxMiddleRow">
                        <p>Plan Name: </p>
                        <input
                            type="text"
                            className="newTrainingPlanTitle"
                            name="name"
                            value={createNewPlan.trainingPlan.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="createNewPlanBoxMiddleRow">
                        <p>Training Area: </p>
                        <Select
                            isMulti
                            name="trainingArea"
                            options={[
                                { value: 'Front-End', label: 'Front-End'},
                                { value: 'Back-End', label: 'Back-End'},
                                { value: 'Databases', label: 'Databases'},
                            ]}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={handleTrainingAreaChange}
                        />
                    </div>
                    <div className="createNewPlanBoxMiddleRow">
                        <p>Training Content: </p>
                        <Select
                            isMulti
                            name="trainingContent"
                            options={courseOptions}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={handleTrainingContentChange}
                        />
                    </div>
                    <div className="createNewPlanBoxMiddleRow">
                        <p>Assignee: </p>
                        <Select
                            isMulti
                            name="assignee"
                            options={employeeOptions}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={handleEmployeeChange}
                        />
                    </div>
                    <div className="createNewPlanBoxMiddleRow">
                        <p>Description: </p>
                        <textarea
                            name="description"
                            className="newTrainingPlanDescription"
                            value={createNewPlan.trainingPlan.description}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="createNewPlanBoxMiddleRow">
                        <p>Due Date: </p>
                        <DatePicker
                            selected={createNewPlan.trainingPlanAssignment.dueDate} // Use createNewPlan.dueDate here
                            onChange={handleDateChange} // Add this onChange handler
                        />
                    </div>
                    {/*<div className="createNewPlanBoxMiddleRow">*/}
                    {/*    <p>Reminder Frequency: </p>*/}
                    {/*    <select name="reminder" className="newTrainingPlanReminder" value={createNewPlan.reminder}*/}
                    {/*            onChange={handleInputChange}>*/}
                    {/*        <option value="" disabled selected></option>*/}
                    {/*        <option value="Once a day">Once a day</option>*/}
                    {/*        <option value="Twice a day">Twice a day</option>*/}

                    {/*    </select>*/}

                    {/*</div>*/}
                    <div className="createNewPlanBoxMiddleBlank"></div>
                </div>
                <div className="createNewPlanBoxRight">
                    {errorMessage && (
                        <div className="error-message">{errorMessage}</div>
                    )}
                    <input
                        type="button"
                        value="Create"
                        className="newPlanSubmit"
                        onClick={handleNewPlan}
                    />
                </div>
            </div>
        </div>
        <Footer/>
    </div>
}

export default NewTrainingPlan;
