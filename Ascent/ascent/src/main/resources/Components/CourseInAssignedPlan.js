import "../Styles/CourseInPlan.css"
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";

export default function CourseInAssignedPlan({trainingPlans, contentQuizMap, sortOrder, dueDate}) {
    let sortedCourses = [...trainingPlans]; // Create a copy to avoid mutating the original array

    if (sortOrder === "asc" || sortOrder === "desc") {
        sortedCourses.sort((a, b) => {
            const titleA = a.trainingContent ? a.trainingContent.title : '';
            const titleB = b.trainingContent ? b.trainingContent.title : '';
            const comparison = titleA.localeCompare(titleB);

            return sortOrder === "asc" ? comparison : -comparison;
        });
    }

    // console.log(dueDate)
    function formatDate(inputDate) {
        const date = new Date(inputDate); // Parse the input date string

        // Define the options for formatting the date
        const options = { year: 'numeric', month: 'long', day: 'numeric' };

        // Use the options to format the date
        return date.toLocaleDateString(undefined, options);
    }
    // console.log(sortedCourses)

    // Load assignmentId you want to update if quiz is passed
    const currentAssignmentId = localStorage.getItem('currentAssignmentId');
    // Convert assignmentId to an int
    let currentAssignmentIdAsInt = parseInt(currentAssignmentId)

    // State to store existingQuizStatusObject
    const [existingQuizStatusObject, setExistingQuizStatusObject] = useState({});

    useEffect(() => {
        if (currentAssignmentIdAsInt) {
            // Fetch existing quiz status for the assignment
            fetch(`http://localhost:8080/api/PlanAssignment/GetQuizStatus?assignmentId=${currentAssignmentId}`)
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
                    // console.log('Existing Quiz Status Object:', existingQuizStatusObject);

                    // Set the state with the existing quiz status object
                    setExistingQuizStatusObject(existingQuizStatusObject);

                    // You can perform further operations with the existing array if needed
                })
                .catch(error => console.error('Error fetching existing quiz status:', error));
        }

    }, [currentAssignmentId]);


    return (
        sortedCourses.map(plan => {
            // Find the matching content quiz map entry
            const matchingMap = contentQuizMap.find(entry => entry.contentId === plan.trainingContent.id);

            // Check if the matching quizId has a status of "Passed"
            const isQuizPassed = matchingMap && existingQuizStatusObject[matchingMap.quizId] === 'Passed';

            return (
                <div className="courseInPlan" key={plan.trainingContent.id}>
                    <div className="courseInPlanStatus">
                        {isQuizPassed ? (
                            <div className="courseInPlanStatusIndicatorFilled"></div>
                        ) : (
                            <div className="courseInPlanStatusIndicatorEmpty"></div>
                        )}
                    </div>
                    <div className="courseInPlanName">
                        <Link to={`/MyTrainingContent/${plan.trainingPlan.id}`}>
                            {plan.trainingContent.title}
                        </Link>
                    </div>
                    <div className="courseInPlanType">
                        {plan.trainingContent.contentType}
                    </div>
                    <div className="courseInPlanDescription">
                        {plan.trainingContent.description}
                    </div>
                    <div className="courseInPlanCreatedBy">
                        {plan.trainingContent.createdBy}
                    </div>
                    <div className="courseInPlanDueDate">
                        {formatDate(dueDate)}
                    </div>
                    <div className="courseInPlanQuiz">
                        {matchingMap && (
                            <Link to={`/Quiz/${matchingMap.quizId}`}>
                                Quiz
                            </Link>
                        )}
                    </div>
                </div>
            );
        })
    );
}


