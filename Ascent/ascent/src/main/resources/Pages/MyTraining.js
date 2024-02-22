import React, {useEffect, useState} from "react";
import MainNavbar from "../Components/MainNavbar";
import Footer from "../Components/Footer";
import "../Styles/MyTraining.css"
import CourseCard from "../Components/CourseCard";


function MyTraining(){
    const loggedInUserId = localStorage.getItem('loggedInUserId');

    const loggedInUserRole = localStorage.getItem('loggedInUserRole');


    const [allAssignedPlans, setAllAssignedPlans] = useState([]);
    const [trainingPlansInfo, setTrainingPlansInfo] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // State for search query

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


    // Retrieves all training plans created
    useEffect(() => {
        fetch('http://localhost:8080/api/PlanAssignment/GetAllTrainingPlans')
            .then(response => {
                if (!response.ok) {
                    throw Error(`Request failed with status ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Filter the training plans based on assigned plan ids
                const filteredPlans = data.filter((plan) =>
                    allAssignedPlans.some((assignedPlan) => assignedPlan.planId === plan.id)
                );
                setTrainingPlansInfo(filteredPlans);
            })
            .catch((error) => console.error("Error fetching training plans:", error));
    }, [allAssignedPlans]);


    // Sorting for search bar
    const filteredPlans = trainingPlansInfo
        .filter(plan => plan.name.toLowerCase().includes(searchQuery.toLowerCase()))

    // Define the number of plans to display per page
    const plansPerPage = 9;

    // Define the current page
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the indexes for the plans to display on the current page
    const startIndex = (currentPage - 1) * plansPerPage;
    const endIndex = startIndex + plansPerPage;

    // Get the plans to display on the current page
    const plansToDisplay = filteredPlans.slice(startIndex, endIndex);

    // Define a function to handle pagination
    const handlePageChange = (increment) => {
        const newPage = currentPage + increment;
        if (newPage >= 1 && newPage <= Math.ceil(filteredPlans.length / plansPerPage)) {
            setCurrentPage(newPage);
        }
    };


    return(
    <div className="myTrainingContainer">
        <MainNavbar/>
        <div className="myTrainingDisplayWindow">
            <div className="myTrainingSearchBar">
                <p className="myTrainingTitle">My Training Plans</p>
                <div className="searchBar">
                    <input
                        type="search"
                        name="searchFilter"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    ></input>
                    {/*<button type="submit">Search</button>*/}
                </div>
            </div>
            <div className="myTrainingBottom">
                <div className="myTrainingBottomBlank"></div>
                <div className="myTrainingFilters">
                    {/*<div className="myTrainingFiltersTitle">My Trainings</div>*/}
                    {/*<div className="myTrainingFiltersOptions">All Plans</div>*/}
                    {/*<div className="myTrainingFiltersOptions">Assigned</div>*/}
                    {/*<div className="myTrainingFiltersOptions">Completed</div>*/}
                </div>
                <div className="myTraining-PlanCatalog">
                    <CourseCard trainingPlansInfo={plansToDisplay} assignedPlans={allAssignedPlans}/>
                </div>
                <div className="myTrainingBottomBlank"></div>
            </div>
            <div className="assignedPlansPageScroll">
                <p onClick={() => handlePageChange(-1)}>▲</p>
                <p>{`Training Plans ${startIndex + 1}-${endIndex}`}</p>
                <p onClick={() => handlePageChange(1)}>▼</p>
            </div>
        </div>
        <Footer/>
    </div>
    )
}

export default MyTraining;
