import MainNavbar from "../Components/MainNavbar";
import Footer from "../Components/Footer";
import "../Styles/TrainingPlan.css"
import React, {useState, useEffect} from "react";
import {Link} from 'react-router-dom';
import PlanInTable from "../Components/PlanInTable";

function TrainingPlan() {

    const [contentQuizMap, setContentQuizMap] = useState([]);
    const [quizDetail, setQuizDetail] = useState([]);
    const [trainingPlans, setTrainingPlans] = useState([]);
    const [courses, setCourses] = useState([]);
    const [sortOrder, setSortOrder] = useState(null); // Add state for sorting order
    const [dateSortOrder, setDateSortOrder] = useState(null); // Add state for date sorting order
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [startDate, setStartDate] = useState(null); // State for start date
    const [endDate, setEndDate] = useState(null); // State for end date
    const [selectedTrainingArea, setSelectedTrainingArea] = useState("All"); // State for selected training area
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const loggedInUserRole = localStorage.getItem('loggedInUserRole');


    useEffect(() => {
        fetch('http://localhost:8080/api/PlanAssignment/GetAllTrainingPlans')
            .then(response => {
                if (!response.ok) {
                    throw Error(`Request failed with status ${response.status}`);
                }
                return response.json();
            })
            .then(data => setTrainingPlans(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

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

    const filterByDateRange = (quiz) => {
        if (!startDate || !endDate) {
            return true; // No date range filter applied
        }

        const quizDate = new Date(quiz.createDate);

        return quizDate >= startDate && quizDate <= endDate;
    };

    const filterByTrainingArea = (quiz) => {
        if (selectedTrainingArea === "All") {
            return true; // Show all courses
        }
        return quiz.trainingArea === selectedTrainingArea;
    };


    const filteredPlans = trainingPlans
        .filter(quiz => quiz.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(filterByDateRange)
        .filter(filterByTrainingArea)


    // Define the number of plans to display per page
    const plansPerPage = 15;

    // Define the current page
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the indexes for the plans to display on the current page
    const startIndex = (currentPage - 1) * plansPerPage;
    const endIndex = startIndex + plansPerPage;

    // Sort the filteredPlans array by name
    filteredPlans.sort((a, b) => {
        return sortOrder === "desc" ?  b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
    });


    // Get the plans to display on the current page
    const plansToDisplay = filteredPlans.slice(startIndex, endIndex);

    // Define a function to handle pagination
    const handlePageChange = (increment) => {
        const newPage = currentPage + increment;
        if (newPage >= 1 && newPage <= Math.ceil(filteredPlans.length / plansPerPage)) {
            setCurrentPage(newPage);
        }
    };

    // Check if the user has the required role (Manager) to access the page
    if (loggedInUserRole !== "Manager") {
        return (
            <div className="trainingPlanContainerNew">
                <MainNavbar />
                <div className="trainingPlanBackground">
                    <div className="trainingPlanMainContainer">
                        <div className="accessDeniedMessage">
                            <h1>Access Denied!</h1>
                            <p>You do not have permission to view this page.</p>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="trainingPlanContainerNew">
            <MainNavbar/>
            <div className="trainingPlanBackground">
                <div className="trainingPlanMainContainer">
                    <div className="trainingPlanSearchFilter">
                        <div className="trainingPlanTitle">
                            <h1>Training Plans</h1>
                        </div>
                        <div className="trainingPlanDateSearch">
                            <input
                                type="text"
                                name="daterange"
                                placeholder="Date Range (YYYY-MM-DD - YYYY-MM-DD)"
                                onChange={(e) => {
                                    const [start, end] = e.target.value.split(" - ");
                                    setStartDate(new Date(start));
                                    setEndDate(new Date(end));
                                }}
                            />
                            <input
                                type="search"
                                name="searchFilter"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}

                            />
                            {/*<button type="submit">Search</button>*/}
                            <Link to="../NewTrainingPlan" className="newTrainingPlanButton">
                                New Plan
                            </Link>
                        </div>
                    </div>
                    <div className="trainingPlanInfoFilter">
                        <div className="trainingPlanInfoFilterTrainingPlanName" onClick={toggleSortOrder}>
                            Plan Name {sortOrder === 'asc' ? '▲' : '▼'}
                        </div>
                        <div className="trainingPlanInfoFilterTrainingArea"
                             onMouseEnter={toggleDropdown}
                             onMouseLeave={closeDropdown}
                        >
                            <span>Training Area ▼</span>
                            {isDropdownOpen && (
                                <div className="dropdownTypeContent">
                                    <select
                                        value={selectedTrainingArea}
                                        onChange={(e) => setSelectedTrainingArea(e.target.value)}
                                    >
                                        <option value="All">All</option>
                                        <option value="Front-End">Front-End</option>
                                        <option value="Back-End">Back-End</option>
                                        <option value="Databases">Databases</option>
                                    </select>
                                </div>
                            )}
                        </div>
                        <div className="trainingPlanInfoFilterDescription">
                            Description
                        </div>
                        <div className="trainingPlanInfoFilterCreatedBy">Created By</div>
                        <div className="trainingPlanInfoFilterCreateDate" onClick={toggleDateSortOrder}>
                            Date Created {dateSortOrder === 'asc' ? '▲' : '▼'}
                        </div>
                        {/*<div className="trainingPlanInfoFilterModify">*/}
                        {/*    Modify*/}
                        {/*</div>*/}

                    </div>
                    <PlanInTable trainingPlans={plansToDisplay} sortOrder={sortOrder} dateSortOrder={dateSortOrder} contentQuizMap={contentQuizMap} courses={courses} quizDetail={quizDetail}/>
                    <div className="trainingPlanPageScroll">
                        <p onClick={() => handlePageChange(-1)}>▲</p>
                        <p>{`Training Plans ${startIndex + 1}-${endIndex}`}</p>
                        <p onClick={() => handlePageChange(1)}>▼</p>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    )
}

export default TrainingPlan;