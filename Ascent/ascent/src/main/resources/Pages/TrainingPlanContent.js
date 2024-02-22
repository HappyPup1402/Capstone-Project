import MainNavbar from "../Components/MainNavbar";
import Footer from "../Components/Footer";
import "../Styles/TrainingPlanContent.css"
import React, {useState, useEffect} from "react";
import {useParams} from 'react-router-dom';
import CourseInPlan from "../Components/CourseInPlan";

function TrainingPlanContent() {

    const {id} = useParams(); // Get plan id from route parameters
    const planIdInt = parseInt(id, 10);
    const [trainingDetail, setTrainingDetail] = useState([]);
    const [contentQuizMap, setContentQuizMap] = useState([]);

    const [sortOrder, setSortOrder] = useState(null); // Add state for sorting order
    const [selectedCourseType, setSelectedCourseType] = useState("All"); // State for selected course type
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [dateSortOrder, setDateSortOrder] = useState(null); // Add state for date sorting order


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
    // console.log(filteredContentQuizMaps);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };
    const toggleDateSortOrder = () => {
        setDateSortOrder(dateSortOrder === 'asc' ? 'desc' : 'asc');
    };

    const filterByCourseType = (course) => {
        if (selectedCourseType === "All") {
            return true; // Show all courses
        }
        return course.trainingContent.contentType === selectedCourseType;
    };

    // Filter the courses based on the date range and search query
    const filteredCourses = trainingDetailsForPlan
        .filter(filterByCourseType)



    // Sort the filteredQuizzes array by name
    filteredCourses.sort((a, b) => {
        return sortOrder === "desc" ?  b.trainingContent.title.localeCompare(a.title) : a.trainingContent.title.localeCompare(b.title);
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
        <div className="trainingPlanContentContainerNew">
            <MainNavbar/>
            <div className="trainingPlanContentBackground">
                <div className="trainingPlanContentMainContainer">
                    <div className="trainingPlanContentSearchFilter">
                        <div className="trainingPlanContentTitle">
                            {trainingPlanData.length > 0 ? (
                                <>
                                    <h1>{trainingPlanData[0].name}</h1>
                                    <p>{truncateDescription(trainingPlanData[0].description)}</p>
                                </>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                    </div>
                    <div className="trainingPlanContentInfoFilter">
                        <div className="trainingPlanContentInfoFilterCourseStatus">
                            Status
                        </div>
                        <div className="trainingPlanContentInfoFilterCourseName" onClick={toggleSortOrder}>
                            Course Name {sortOrder === 'asc' ? '▲' : '▼'}
                        </div>
                        <div className="trainingPlanContentInfoFilterCourseType"
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
                        <div className="trainingPlanContentInfoFilterDescription">Description</div>
                        <div className="trainingPlanContentInfoFilterCreatedBy">Created By</div>
                        <div className="trainingPlanContentInfoFilterDueDate" onClick={toggleDateSortOrder}>
                            Due Date {dateSortOrder === 'asc' ? '▲' : '▼'}
                        </div>
                        <div className="trainingPlanContentInfoFilterQuiz">
                            Quiz
                        </div>

                    </div>
                    <CourseInPlan trainingPlans={coursesToDisplay} contentQuizMap={filteredContentQuizMaps} sortOrder={sortOrder} dateSortOrder={dateSortOrder}/>

                    <div className="trainingPlanContentPageScroll">
                        <p onClick={() => handlePageChange(-1)}>▲</p>
                        <p>{`Courses ${startIndex + 1}-${endIndex} of ${filteredCourses.length}`}</p>
                        <p onClick={() => handlePageChange(1)}>▼</p>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    )
}

export default TrainingPlanContent;