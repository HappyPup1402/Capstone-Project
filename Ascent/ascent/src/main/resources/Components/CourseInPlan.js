import "../Styles/CourseInPlan.css"
import React from "react";
import {Link} from "react-router-dom";

export default function CourseInPlan({trainingPlans, contentQuizMap, sortOrder, dateSortOrder}) {
    let sortedCourses = [...trainingPlans]; // Create a copy to avoid mutating the original array

    if (sortOrder === "asc" || sortOrder === "desc") {
        sortedCourses.sort((a, b) => {
            const titleA = a.trainingContent ? a.trainingContent.title : '';
            const titleB = b.trainingContent ? b.trainingContent.title : '';
            const comparison = titleA.localeCompare(titleB);

            return sortOrder === "asc" ? comparison : -comparison;
        });
    } else if (dateSortOrder === "asc" || dateSortOrder === "desc") {
        sortedCourses.sort((a, b) => {
            const dateA = a.trainingContent ? new Date(a.trainingContent.dateCreated) : new Date(0);
            const dateB = b.trainingContent ? new Date(b.trainingContent.dateCreated) : new Date(0);
            return dateSortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });
    }


    function formatDate(inputDate) {
        const date = new Date(inputDate); // Parse the input date string

        // Define the options for formatting the date
        const options = { year: 'numeric', month: 'long', day: 'numeric' };

        // Use the options to format the date
        return date.toLocaleDateString(undefined, options);
    }

    function truncateDescription(description) {
        const maxLength = 60;

        // Check if the description is longer than the maximum length
        if (description.length > maxLength) {
            // If yes, truncate and add "..." at the end
            return description.substring(0, maxLength) + "...";
        }

        // If not, return the original description
        return description;
    }

    return (
        sortedCourses.map(plan => {
            // Find the matching content quiz map entry
            const matchingMap = contentQuizMap.find(entry => entry.contentId === plan.trainingContent.id);

            return (
                <div className="courseInPlan" key={plan.trainingContent.id}>
                    <div className="courseInPlanStatus">
                        <div className="courseInPlanStatusIndicatorEmpty"></div>
                    </div>
                    <div className="courseInPlanName">
                        <Link to={`/TrainingPlanContent/${plan.trainingPlan.id}`}>
                            {plan.trainingContent.title}
                        </Link>
                    </div>
                    <div className="courseInPlanType">
                        {plan.trainingContent.contentType}
                    </div>
                    <div className="courseInPlanDescription">
                        {truncateDescription(plan.trainingContent.description)}
                    </div>
                    <div className="courseInPlanCreatedBy">
                        {plan.trainingContent.createdBy}
                    </div>
                    <div className="courseInPlanDueDate">
                        {formatDate(plan.trainingContent.dateCreated)}
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


