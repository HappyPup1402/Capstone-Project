import MainNavbar from "../Components/MainNavbar";
import Footer from "../Components/Footer";
import "../Styles/TrainingContent.css"
import React, {useState, useEffect} from "react";
import {Link} from 'react-router-dom';
import CourseInTable from "../Components/CourseInTable";

function TrainingContent() {

    const [courses, setCourses] = useState([]);
    const [sortOrder, setSortOrder] = useState(null); // Add state for sorting order
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [startDate, setStartDate] = useState(null); // State for start date
    const [endDate, setEndDate] = useState(null); // State for end date
    const [selectedCourseType, setSelectedCourseType] = useState("All"); // State for selected course type
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [dateSortOrder, setDateSortOrder] = useState(null); // Add state for date sorting order
    const loggedInUserRole = localStorage.getItem('loggedInUserRole');

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    const closeDropdown = () => {
        setIsDropdownOpen(false);
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

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };
    const toggleDateSortOrder = () => {
        setDateSortOrder(dateSortOrder === 'asc' ? 'desc' : 'asc');
    };


    const filterByDateRange = (course) => {
        if (!startDate || !endDate) {
            return true; // No date range filter applied
        }
        console.log(startDate)
        console.log(endDate)
        const courseDate = new Date(course.dateCreated);

        return courseDate >= startDate && courseDate <= endDate;
    };

    const filterByCourseType = (course) => {
        if (selectedCourseType === "All") {
            return true; // Show all courses
        }
        return course.contentType === selectedCourseType;
    };

    // Filter the courses based on the date range and search query
    const filteredCourses = courses
        .filter(course => course.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(filterByDateRange)
        .filter(filterByCourseType)

    // console.log(filteredCourses)

    // Define the number of quizzes to display per page
    const quizzesPerPage = 15;

    // Define the current page
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the indexes for the quizzes to display on the current page
    const startIndex = (currentPage - 1) * quizzesPerPage;
    const endIndex = startIndex + quizzesPerPage;

    // Sort the filteredQuizzes array by name
    filteredCourses.sort((a, b) => {
        return sortOrder === "desc" ?  b.title.localeCompare(a.title) : a.title.localeCompare(b.title);
    });


    // Get the quizzes to display on the current page
    const coursesToDisplay = filteredCourses.slice(startIndex, endIndex);

    // Define a function to handle pagination
    const handlePageChange = (increment) => {
        const newPage = currentPage + increment;
        if (newPage >= 1 && newPage <= Math.ceil(filteredCourses.length / quizzesPerPage)) {
            setCurrentPage(newPage);
        }
    };

    if (loggedInUserRole !== "Manager") {
        return (
            <div className="trainingContentContainerNew">
                <MainNavbar />
                <div className="trainingContentBackground">
                    <div className="trainingContentMainContainer">
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
        <div className="trainingContentContainerNew">
            <MainNavbar/>
            <div className="trainingContentBackground">
                <div className="trainingContentMainContainer">
                    <div className="trainingContentSearchFilter">
                        <div className="trainingContentTitle">
                            <h1>Courses</h1>
                        </div>
                        <div className="trainingContentDateSearch">
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
                            <Link to="../NewCourse" className="newCourseButton">
                                New Course
                            </Link>
                        </div>
                    </div>
                    <div className="trainingContentInfoFilter">
                        <div className="trainingContentInfoFilterCourseName" onClick={toggleSortOrder}>
                            Course Name {sortOrder === 'asc' ? '▲' : '▼'}
                        </div>
                        <div className="trainingContentInfoFilterCourseType"
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
                        <div className="trainingContentInfoFilterDescription">Description</div>
                        <div className="trainingContentInfoFilterCreatedBy">Created By</div>
                        <div className="trainingContentInfoFilterCreateDate" onClick={toggleDateSortOrder}>
                            Date Created {dateSortOrder === 'asc' ? '▲' : '▼'}
                        </div>
                        {/*<div className="trainingContentInfoFilterModify">*/}
                        {/*    Modify*/}
                        {/*</div>*/}

                    </div>
                    <CourseInTable courses={coursesToDisplay} sortOrder={sortOrder} dateSortOrder={dateSortOrder} />
                    <div className="trainingContentPageScroll">
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

export default TrainingContent;