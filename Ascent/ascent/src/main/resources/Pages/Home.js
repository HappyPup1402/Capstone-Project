import React, {useEffect, useState} from "react";
import MainNavbar from "../Components/MainNavbar";
import Footer from "../Components/Footer";
import "../Styles/HomeEmployee.css"
import SlProgressRing from "@shoelace-style/shoelace/dist/react/progress-ring";
import TableInMainPage from "../Components/TableInMainPage";


function Home() {

    const [toggleState, setToggleState] = useState(1)
    const [allAssignedPlans, setAllAssignedPlans] = useState([]);

    const toggleTab = (index) => {
        setToggleState(index)
    }
    const loggedInUserId = localStorage.getItem('loggedInUserId');

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

    // Calculate Plans Completed ===============================================

    // Filter assigned plans with a status of "Complete"
    const completedPlans = allAssignedPlans.filter(
        (plan) => plan.status === "Complete"
    );

    // Calculate the total number of plans and the number of completed plans
    const totalPlans = allAssignedPlans.length;

    const completedCount = completedPlans.length;

    // Calculate the completion percentage
    const completionPlanPercentage =
        totalPlans > 0
            ? Math.round((completedCount / totalPlans) * 100)
            : 0;

    // Calculate Trainings/Quizzes Completed ===============================================

    // Count occurrences of "Passed" and "N/A"
    let passedCount = 0;
    let naCount = 0;

    allAssignedPlans.forEach((plan) => {
        const quizResult = JSON.parse(plan.quizResult);

        // Check if quizResult is an object
        if (typeof quizResult === "object") {
            Object.values(quizResult).forEach((result) => {
                if (result === "Passed") {
                    passedCount++;
                } else if (result === "N/A") {
                    naCount++;
                }
            });
        }
    });

    // Calculate the percentage using the formula and round to the nearest whole number
    const completionTrainingQuizPercentage =
        passedCount > 0
            ? Math.round((passedCount / (passedCount + naCount)) * 100)
            : 0;
    const totalCount = passedCount + naCount


    return <div className="mainPageContainer">
        <MainNavbar/>
        <div className="mainPageTop">
            <div className="trend">
                <div className="trendText">
                    <p>Trainings Completed <br/> {passedCount}/{totalCount}</p>
                </div>
                <div className="trainingProgress">
                    <SlProgressRing
                        value={completionTrainingQuizPercentage}
                        style={{
                            '--track-color': "#DEDEDE",
                            '--track-width': "20px",
                            '--indicator-color': "#54A5FF",
                            '--indicator-width': '20px',
                            '--size': '200px'
                        }}
                    >
                        <p className="progressPercentage">{completionTrainingQuizPercentage}%</p>
                    </SlProgressRing>
                </div>

            </div>
            <div className="trend">
                <div className="trendText">
                    <p>Plans Completed <br/> {completedCount}/{totalPlans}</p>
                </div>
                <div className="trainingProgress">
                    <SlProgressRing
                        value={completionPlanPercentage}
                        style={{
                            '--track-color': "#DEDEDE",
                            '--track-width': "20px",
                            '--indicator-color': "#A34EFF",
                            '--indicator-width': '20px',
                            '--size': '200px'
                        }}
                    >
                        <p className="progressPercentage">{completionPlanPercentage}%</p>
                    </SlProgressRing>
                </div>
            </div>
            <div className="trendRight">
                <div className="rightTrendTop"></div>
                <div className="rightTrendMiddle">
                    <div className="trendText">
                        <p>Quizzes Completed <br/> {passedCount}/{totalCount}</p>
                    </div>
                    <div className="trainingProgress">
                        <SlProgressRing
                            value={completionTrainingQuizPercentage}
                            style={{
                                '--track-color': "#DEDEDE",
                                '--track-width': "20px",
                                '--indicator-color': "#FF0058",
                                '--indicator-width': '20px',
                                '--size': '200px'
                            }}
                        >
                            <p className="progressPercentage">{completionTrainingQuizPercentage}%</p>
                        </SlProgressRing>
                    </div>
                </div>
                <div className="rightTrendBottom">
                    {/*<p>Showing Completion for This</p>*/}
                    {/*<select className="timeFilter" id="timeFilter">*/}
                    {/*    <option value="week">Week</option>*/}
                    {/*    <option value="month">Month</option>*/}
                    {/*    <option value="quarter">Quarter</option>*/}
                    {/*    <option value="year">Year</option>*/}
                    {/*</select>*/}
                </div>

            </div>
        </div>
        <div className="mainPageBottom">
            <div className="toDo">
                <div className="toDoBox">
                    <p className="toDoText">To Do</p>
                </div>
                <div
                    className={toggleState === 1 ? "tabsActiveTab"
                        : "tabs"}
                    onClick={() => toggleTab(1)}
                >
                    <p className={toggleState === 1 ? "tabNameActive"
                    : "tabName"}>Required Trainings</p>
                    <div className={toggleState === 1 ? "tabCircleActive"
                        : "tabCircle"}>
                        <p className={toggleState === 1 ? "tabCircleTextActive"
                            : "tabCircleText"}>{naCount}</p>
                    </div>
                </div>
                <div
                    className={toggleState === 2 ? "tabsActiveTab"
                        : "tabs"}
                    onClick={() => toggleTab(2)}
                >
                    <p className={toggleState === 2 ? "tabNameActive"
                        : "tabName"}>Required Plans</p>
                    <div className={toggleState === 2 ? "tabCircleActive"
                        : "tabCircle"}>
                        <p className={toggleState === 2 ? "tabCircleTextActive"
                            : "tabCircleText"}>{totalPlans-completedCount}</p>
                    </div>
                </div>
                <div
                    className={toggleState === 3 ? "tabsActiveTab"
                        : "tabs"}
                    onClick={() => toggleTab(3)}
                >
                    <p className={toggleState === 3 ? "tabNameActive"
                        : "tabName"}>Required Quizzes</p>
                    <div className={toggleState === 3 ? "tabCircleActive"
                        : "tabCircle"}>
                        <p className={toggleState === 3 ? "tabCircleTextActive"
                            : "tabCircleText"}>{naCount}</p>
                    </div>
                </div>
                <div className="toDoBlank"></div>
            </div>
            <div className="mainPageRequiredContentContainer">
                <div className="mainPageRequiredContentDescriptions">
                    <div className="mainPageRequiredContentDescriptionsGridItem">
                        <p className={toggleState === 1 ? "contentNameActive"
                            : "contentName"}>Trainings to be Completed:</p>
                        <p className={toggleState === 2 ? "contentNameActive"
                            : "contentName"}>Plans to be Completed:</p>
                        <p className={toggleState === 3 ? "contentNameActive"
                            : "contentName"}>Quizzes to be Completed:</p>
                    </div>
                    <div className="mainPageRequiredContentDescriptionsGridItem"></div>
                    <div className="mainPageRequiredContentDescriptionsGridItemLeft">
                        <p className="requiredContentFiltersLeft1">Title</p>
                        <p className="requiredContentFiltersLeft2">Type</p>
                    </div>
                    <div className="mainPageRequiredContentDescriptionsGridItemRight">
                        <p className="requiredContentFiltersRight">Created By</p>
                        <p className="requiredContentFiltersRight">Due Date</p>
                    </div>
                </div>
                <div className="mainPageRequiredContent">
                    <TableInMainPage AssignedPlans={allAssignedPlans} FilterState={toggleState}/>

                </div>
            </div>
        </div>
        <Footer/>
    </div>
}

export default Home;