import MainNavbar from "../Components/MainNavbar";
import Footer from "../Components/Footer";
import "../Styles/MyTrainingContent.css"
import React, {useState, useEffect} from "react";
import {Link, useParams} from 'react-router-dom';
import CourseInAssignedPlan from "../Components/CourseInAssignedPlan";

function MyTrainingContent() {

    const loggedInUserId = localStorage.getItem('loggedInUserId');
    const [allAssignedPlans, setAllAssignedPlans] = useState([]);
    const {id} = useParams(); // Get plan id from route parameters
    const planIdInt = parseInt(id, 10);
    const [trainingDetail, setTrainingDetail] = useState([]);
    const [contentQuizMap, setContentQuizMap] = useState([]);
    const [existingQuizStatusObject, setExistingQuizStatusObject] = useState({});
    const [progressBarStyle, setProgressBarStyle] = useState({});
    const [planCompletionPercentage, setPlanCompletionPercentage] = useState(0);




    const [sortOrder, setSortOrder] = useState(null); // Add state for sorting order
    const [selectedCourseType, setSelectedCourseType] = useState("All"); // State for selected course type
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Retrieve all training details
    useEffect(() => {
        // Fetch the courses and set them in the state
        fetch('http://localhost:8080/api/PlanAssignment/GetAllTrainingDetails')
            .then(response => {
                if (!response.ok) {
                    throw Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setTrainingDetail(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // Use the filter function to get all trainingDetail objects with the specified plan id
    const trainingDetailsForPlan = trainingDetail.filter(detail => detail.trainingPlan.id === planIdInt);

    // Extract the trainingPlan.name and trainingPlan.description properties
    const trainingPlanData = trainingDetailsForPlan.map(detail => ({
        name: detail.trainingPlan.name,
        description: detail.trainingPlan.description
    }));

    // Retrieve all content quiz maps
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


    // Filter and extract content quiz maps where contentId matches trainingContent.id
    const matchingContentQuizMaps = trainingDetailsForPlan.map((detail) => {
        const contentId = detail.trainingContent.id;
        const matchingMap = contentQuizMap.find((map) => map.contentId === contentId);

        if (matchingMap) {
            return {
                id: matchingMap.id,
                contentId: matchingMap.contentId,
                quizId: matchingMap.quizId,
            };
        }

        return null; // Return null for non-matching entries
    });

    // Filter out null entries (non-matching) and keep only the matching content quiz maps
    const filteredContentQuizMaps = matchingContentQuizMaps.filter((map) => map !== null);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    const filterByCourseType = (course) => {
        if (selectedCourseType === "All") {
            return true; // Show all courses
        }
        return course.trainingContent.contentType === selectedCourseType;
    };

    // Filter the courses based on the course type
    const filteredCourses = trainingDetailsForPlan
        .filter(filterByCourseType)

    // Sort the filteredQuizzes array by name
    filteredCourses.sort((a, b) => {
        return sortOrder === "desc" ? b.trainingContent.title.localeCompare(a.title) : a.trainingContent.title.localeCompare(b.title);
    });

    // Define the number of courses to display per page
    const coursesPerPage = 15;

    // Define the current page
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the indexes for the courses to display on the current page
    const startIndex = (currentPage - 1) * coursesPerPage;
    const endIndex = startIndex + coursesPerPage;

    // Get the courses to display on the current page
    const coursesToDisplay = filteredCourses.slice(startIndex, endIndex);

    // Define a function to handle pagination
    const handlePageChange = (increment) => {
        const newPage = currentPage + increment;
        if (newPage >= 1 && newPage <= Math.ceil(filteredCourses.length / coursesPerPage)) {
            setCurrentPage(newPage);
        }
    };

    // Retrieves all assigned plans
    useEffect(() => {
        // Make an API request to fetch data
        fetch('http://localhost:8080/api/PlanAssignment/GetAllAssignedPlans')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Filter the data based on loggedInUserId
                const filteredAssignedPlans = data.filter(plan => plan.userId === parseInt(loggedInUserId));
                setAllAssignedPlans(filteredAssignedPlans);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [loggedInUserId]); // Add loggedInUserId to the dependency array to re-run the effect when it changes

    // Use the filter function to get all assigned plans with the specified plan id
    const assignedPlanForPlanId = allAssignedPlans.filter(
        (plan) => plan.planId === planIdInt
    );

    const dueDate = assignedPlanForPlanId.map((plan) => plan.dueDate);

    // Get the assignment ID from the first element of assignedPlanForPlanId array
    const assignmentIdToUpdate = assignedPlanForPlanId.length > 0 ? assignedPlanForPlanId[0].assignmentId : null;

    // When you have the assignmentIdToUpdate
    localStorage.setItem('currentAssignmentId', assignmentIdToUpdate);


    // Storing Quiz Completions ===============================================

    useEffect(() => {
        if (assignmentIdToUpdate != null) {
            // Fetch existing quiz status for the assignment
            fetch(`http://localhost:8080/api/PlanAssignment/GetQuizStatus?assignmentId=${assignmentIdToUpdate}`)
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
                    // console.log(existingQuizStatusObject)

                    // Check if all quiz results are "Passed"
                    const allPassed = Object.values(existingQuizStatusObject).every(status => status === 'Passed');

                    // If all quiz results are "Passed," update the status to "Complete"
                    if (allPassed) {
                        // Update the status to "Complete"
                        fetch(`http://localhost:8080/api/PlanAssignment/UpdateStatus?assignmentId=${assignmentIdToUpdate}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                status: 'Complete',
                                completedDate: new Date().toISOString(), // Set the completed date to the current date
                            }),
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Network response was not ok');
                                }
                                // You can perform further operations if needed
                            })
                            .catch(error => console.error('Error updating status:', error));
                    }

                    // Set the state with the existing quiz status object
                    setExistingQuizStatusObject(existingQuizStatusObject);

                    // You can perform further operations with the existing array if needed
                })
                .catch(error => console.error('Error fetching existing quiz status:', error));
        }

    }, [assignmentIdToUpdate]);

    // Calculate Training Plan Progress =====================================
    function isObjectEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    useEffect(() => {
        if (!isObjectEmpty(existingQuizStatusObject)) {
            // Initialize count variables
            let naCount = 0;
            let passedCount = 0;

            // Iterate through the object and count occurrences
            for (const key in existingQuizStatusObject) {
                if (existingQuizStatusObject[key] === 'N/A') {
                    naCount++;
                } else if (existingQuizStatusObject[key] === 'Passed') {
                    passedCount++;
                }
            }

            // Calculate total number of courses in the training plan
            const totalCoursesInAssignedPlan = naCount + passedCount;

            // Calculate completion percentage
            const planCompletionPercentage = ((passedCount / totalCoursesInAssignedPlan) * 100);
            setPlanCompletionPercentage(planCompletionPercentage)

            // Set the width of the progress bar based on the completion percentage
            const newProgressBarStyle = {
                width: `${planCompletionPercentage}%`,
            };

            // Update the state with the new style
            setProgressBarStyle(newProgressBarStyle);
        }
    }, [existingQuizStatusObject]); // Run the effect when existingQuizStatusObject changes


    function truncateDescription(description) {
        const maxLength = 100;

        // Check if the description is longer than the maximum length
        if (description.length > maxLength) {
            // If yes, truncate and add "..." at the end
            return description.substring(0, maxLength) + "...";
        }

        // If not, return the original description
        return description;
    }


    return (
        <div className="myTrainingContentContainerNew">
            <MainNavbar/>
            <div className="myTrainingContentBackground">
                <div className="myTrainingContentMainContainer">
                    <div className="myTrainingContentSearchFilter">
                        <div className="myTrainingContentTitle">
                            {trainingPlanData.length > 0 ? (
                                <>
                                    <h1>{trainingPlanData[0].name}</h1>
                                    <p>{truncateDescription(trainingPlanData[0].description)}</p>
                                </>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                        <div className="myTrainingContentProgressBar">
                            <div className="myTrainingContentProgressBarRemaining">
                                <div
                                    className="myTrainingContentProgressBarComplete"
                                    style={progressBarStyle} // Apply the inline style
                                >
                                </div>
                            </div>
                            <p>{planCompletionPercentage}%</p>
                        </div>
                    </div>
                    <div className="myTrainingContentInfoFilter">
                        <div className="myTrainingContentInfoFilterCourseStatus">
                            Status
                        </div>
                        <div className="myTrainingContentInfoFilterCourseName" onClick={toggleSortOrder}>
                            Course Name {sortOrder === 'asc' ? '▲' : '▼'}
                        </div>
                        <div className="myTrainingContentInfoFilterCourseType"
                             onMouseEnter={toggleDropdown}
                             onMouseLeave={closeDropdown}>
                            <span className="courseTypeLabel">Course Type ▼</span>
                            {isDropdownOpen && (
                                <div className="dropdownTypeContent">
                                    <select
                                        value={selectedCourseType}
                                        onChange={(e) => setSelectedCourseType(e.target.value)}
                                    >
                                        <option value="All">All</option>
                                        <option value="Document">Document</option>
                                        <option value="Video">Video</option>
                                    </select>
                                </div>
                            )}

                        </div>
                        <div className="myTrainingContentInfoFilterDescription">Description</div>
                        <div className="myTrainingContentInfoFilterCreatedBy">Created By</div>
                        <div className="myTrainingContentInfoFilterDueDate">
                            Due Date
                        </div>
                        <div className="myTrainingContentInfoFilterQuiz">
                            Quiz
                        </div>

                    </div>
                    <CourseInAssignedPlan trainingPlans={coursesToDisplay} contentQuizMap={filteredContentQuizMaps}
                                          sortOrder={sortOrder} dueDate={dueDate}/>

                    <div className="myTrainingContentPageScroll">
                        <p onClick={() => handlePageChange(-1)}>▲</p>
                        <p>{`Courses ${startIndex + 1}-${endIndex}`}</p>
                        <p onClick={() => handlePageChange(1)}>▼</p>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    )
}

export default MyTrainingContent;