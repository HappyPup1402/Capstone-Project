import "../Styles/HomeEmployee.css"
import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";

export default function TableInMainPage({AssignedPlans, FilterState}) {
    // Displaying Required Plans =======================================================
    const [incompletePlans, setIncompletePlans] = useState([]);
    const [incompletePlansInfo, setIncompletePlansInfo] = useState([]);

    // Filter only the plans with a status of "Incomplete"
    useEffect(() => {
        if (AssignedPlans) {
            const filteredPlans = AssignedPlans.filter((plan) => plan.status === "Incomplete");
            setIncompletePlans(filteredPlans);
        }
    }, [AssignedPlans]);

    // Retrieves all training plans created
    useEffect(() => {
        if (incompletePlans.length > 0) {
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
                        incompletePlans.some((assignedPlan) => assignedPlan.planId === plan.id)
                    );
                    setIncompletePlansInfo(filteredPlans);
                })
                .catch((error) => console.error("Error fetching training plans:", error));
        }
    }, [incompletePlans]);


    function formatDate(inputDate) {
        const date = new Date(inputDate); // Parse the input date string

        // Define the options for formatting the date
        const options = {year: 'numeric', month: 'long', day: 'numeric'};

        // Use the options to format the date
        return date.toLocaleDateString(undefined, options);
    }

    // Display Required Courses ===================================

    const [trainingDetail, setTrainingDetail] = useState([]);

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

    // Assuming incompletePlans is an array of incomplete plans
    const idsBeforeNA = incompletePlans
        .map((plan) => {
            const quizResultObj = JSON.parse(plan.quizResult);
            return Object.keys(quizResultObj)
                .filter((key) => quizResultObj[key] === "N/A")
                .map((key) => `${plan.planId}:${key}`);
        })
        .flat();

    // Filter trainingDetail based on the matching trainingPlan.id
    const filteredTrainingDetails = trainingDetail.filter(
        (detail) => incompletePlans.some((assignedPlan) => assignedPlan.planId === detail.trainingPlan.id)
    );

    // Filter filteredTrainingDetails based on the matching idsBeforeNA
    const filteredTrainingDetailsWithIdsBeforeNA = filteredTrainingDetails.filter(
        (detail) => idsBeforeNA.includes(`${detail.trainingPlan.id}:${detail.trainingContent.id}`)
    );

    // Display Required Quizzes =====================================

    const [contentQuizMap, setContentQuizMap] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [filteredQuizIds, setFilteredQuizIds] = useState([]); // Add state for filteredQuizIds

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

    // Assuming contentQuizMap is an array of content quiz mappings
    const matchedContentQuizMap = contentQuizMap.filter(
        (mapping) => idsBeforeNA.some((id) => {
            const [planId, contentId] = id.split(':');
            return contentId === mapping.contentId.toString();
        })
    );

    // Extract quizId from matchedContentQuizMap
    const extractedQuizIds = matchedContentQuizMap.map((mapping) => mapping.quizId);

    // Fetch all quizzes and filter based on extractedQuizIds

    useEffect(() => {
        // Assuming extractedQuizIds is an array obtained from matchedContentQuizMap
        fetch('http://localhost:8080/api/QuizCreation/GetAllQuizzes')
            .then(response => {
                if (!response.ok) {
                    throw Error(`Request failed with status ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Now you can use filteredQuizzes as needed
                setQuizzes(data);
            })
            .catch(error => console.error('Error fetching data:', error));

    }, []);

    // Filter quizzes based on extractedQuizIds
    const filteredQuizzes = quizzes.filter(quiz => extractedQuizIds.includes(quiz.quizId));

    // Displaying Information Conditionally
    let dataToDisplay;

    switch (FilterState) {
        case 1:
            dataToDisplay = filteredTrainingDetailsWithIdsBeforeNA.map(course => (
                <div className="tableInMainPage" key={course.id}>
                    <div className="mainPageTableContentTitle">
                        <Link to={course.contentLink}>
                            {course.trainingContent.title}
                        </Link>
                    </div>
                    <div className="mainPageTableContentType">
                        {course.trainingContent.contentType}
                    </div>
                    <div className="mainPageTableContentCreatedBy">
                        {course.trainingContent.createdBy}
                    </div>
                    <div className="mainPageTableContentDueDate">
                        {formatDate(course.trainingPlan.createDate)}
                    </div>
                </div>
            ))
            break;
        case 2:
            dataToDisplay = incompletePlansInfo.map(plan => (
                <div className="tableInMainPage" key={plan.id}>
                    <div className="mainPageTableContentTitle">
                        <Link to={`/MyTrainingContent/${plan.id}`}>
                            {plan.name}
                        </Link>
                    </div>
                    <div className="mainPageTableContentType">
                        {plan.trainingArea}
                    </div>
                    <div className="mainPageTableContentCreatedBy">
                        {plan.createBy}
                    </div>
                    <div className="mainPageTableContentDueDate">
                        {formatDate(incompletePlans.find((assignedPlan) => assignedPlan.planId === plan.id)?.dueDate)}
                    </div>

                </div>
            ))
            break;
        case 3:
            dataToDisplay = filteredQuizzes.map(quiz => (
                <div className="tableInMainPage" key={quiz.quizId}>
                    <div className="mainPageTableContentTitle">
                        <Link to={`/Quiz/${quiz.quizId}`}>
                            {quiz.name}
                        </Link>
                    </div>
                    <div className="mainPageTableContentType">
                        {quiz.difficulty}
                    </div>
                    <div className="mainPageTableContentCreatedBy">
                        {quiz.createBy}
                    </div>
                    <div className="mainPageTableContentDueDate">
                        {formatDate(quiz.createDate)}
                    </div>

                </div>
            ))
            break;
        default:
            dataToDisplay = []; // Or render some default data
            break;
    }
    return (
        <div>
            {dataToDisplay}
        </div>
    );
}