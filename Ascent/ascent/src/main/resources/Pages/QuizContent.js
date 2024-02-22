import MainNavbar from "../Components/MainNavbar";
import Footer from "../Components/Footer";
import "../Styles/QuizContent.css"
import React, {useState, useEffect} from "react";
import {Link} from 'react-router-dom';
import QuizInTable from "../Components/QuizInTable";

function QuizContent() {

    const [contentQuizMap, setContentQuizMap] = useState([]);
    const [quizDetail, setQuizDetail] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [sortOrder, setSortOrder] = useState(null); // Add state for sorting order
    const [dateSortOrder, setDateSortOrder] = useState(null); // Add state for date sorting order
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [startDate, setStartDate] = useState(null); // State for start date
    const [endDate, setEndDate] = useState(null); // State for end date
    const [selectedDifficulty, setSelectedDifficulty] = useState("All"); // State for selected course type
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const loggedInUserRole = localStorage.getItem('loggedInUserRole');


    useEffect(() => {
        fetch('http://localhost:8080/api/QuizCreation/GetAllQuizzes')
            .then(response => {
                if (!response.ok) {
                    throw Error(`Request failed with status ${response.status}`);
                }
                return response.json();
            })
            .then(data => setQuizzes(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

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

    const filterByDifficulty = (quiz) => {
        if (selectedDifficulty === "All") {
            return true; // Show all courses
        }
        return quiz.difficulty === selectedDifficulty;
    };

    const filteredQuizzes = quizzes
        .filter(quiz => quiz.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(filterByDateRange)
        .filter(filterByDifficulty)

    // console.log(quizzes)
    // console.log(contentQuizMap)

    // Define the number of quizzes to display per page
    const quizzesPerPage = 15;

    // Define the current page
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the indexes for the quizzes to display on the current page
    const startIndex = (currentPage - 1) * quizzesPerPage;
    const endIndex = startIndex + quizzesPerPage;

    // Sort the filteredQuizzes array by name
    filteredQuizzes.sort((a, b) => {
        return sortOrder === "desc" ?  b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
    });


    // Get the quizzes to display on the current page
    const quizzesToDisplay = filteredQuizzes.slice(startIndex, endIndex);

    // Define a function to handle pagination
    const handlePageChange = (increment) => {
        const newPage = currentPage + increment;
        if (newPage >= 1 && newPage <= Math.ceil(filteredQuizzes.length / quizzesPerPage)) {
            setCurrentPage(newPage);
        }
    };

    if (loggedInUserRole !== "Manager") {
        return (
            <div className="quizContentContainerNew">
                <MainNavbar />
                <div className="quizContentBackground">
                    <div className="quizContentMainContainer">
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
        <div className="quizContentContainerNew">
            <MainNavbar/>
            <div className="quizContentBackground">
                <div className="quizContentMainContainer">
                    <div className="quizContentSearchFilter">
                        <div className="quizContentTitle">
                            <h1>Quizzes</h1>
                        </div>
                        <div className="quizContentDateSearch">
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
                            <Link to="../QuizCreation" className="newQuizButton">
                                New Quiz
                            </Link>
                        </div>
                    </div>
                    <div className="quizContentInfoFilter">
                        <div className="quizContentInfoFilterQuizName" onClick={toggleSortOrder}>
                            Quiz Name {sortOrder === 'asc' ? '▲' : '▼'}
                        </div>
                        <div className="quizContentInfoFilterQuestionAmount"># of Q's</div>
                        <div className="quizContentInfoFilterDifficulty"
                             onMouseEnter={toggleDropdown}
                             onMouseLeave={closeDropdown}
                        >
                            <span className="courseTypeLabel">Difficulty ▼</span>
                            {isDropdownOpen && (
                                <div className="dropdownTypeContent">
                                    <select
                                        value={selectedDifficulty}
                                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                                    >
                                        <option value="All">All</option>
                                        <option value="Easy">Easy</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="quizContentInfoFilterLinkedCourse">
                            <span className="quizLinkedCourseLabel">Linked Course</span>

                        </div>
                        <div className="quizContentInfoFilterCreatedBy">Created By</div>
                        <div className="quizContentInfoFilterCreateDate" onClick={toggleDateSortOrder}>
                            Date Created {dateSortOrder === 'asc' ? '▲' : '▼'}
                        </div>

                    </div>
                    <QuizInTable quizzes={quizzesToDisplay} sortOrder={sortOrder} dateSortOrder={dateSortOrder} contentQuizMap={contentQuizMap} courses={courses} quizDetail={quizDetail}/>
                    <div className="quizContentPageScroll">
                        <p onClick={() => handlePageChange(-1)}>▲</p>
                        <p>{`Quizzes ${startIndex + 1}-${endIndex}`}</p>
                        <p onClick={() => handlePageChange(1)}>▼</p>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    )
}

export default QuizContent;