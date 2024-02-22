import "../Styles/PlanInTable.css"
import React from "react";
import {Link} from "react-router-dom";

export default function PlanInTable({trainingPlans, sortOrder, dateSortOrder}/*{ quizzes, sortOrder, dateSortOrder, contentQuizMap, courses, quizDetail}*/) {
    let sortedPlans = trainingPlans; // Use the original order by default

    if (sortOrder === "asc" || sortOrder === "desc") {
        // If a valid sorting order is provided, sort the courses
        sortedPlans = [...trainingPlans]; // Create a copy to avoid mutating the original array

        sortedPlans.sort((a, b) => {
            const comparison = a.name.localeCompare(b.name);
            return sortOrder === "asc" ? comparison : -comparison;
        });
    } else if (dateSortOrder === "asc" || dateSortOrder === "desc") {
        // Sort the courses by date created
        sortedPlans = [...trainingPlans]; // Create a copy to avoid mutating the original array

        sortedPlans.sort((a, b) => {
            const dateA = new Date(a.createDate);
            const dateB = new Date(b.createDate);

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
        sortedPlans.map(plan => (
            <div className="planInTable" key={plan.id}>
                <div className="planInTableName">
                    <Link to={`/TrainingPlanContent/${plan.id}`}>
                        {plan.name}
                    </Link>
                </div>
                <div className="planInTableTrainingArea">
                    {plan.trainingArea}
                </div>
                <div className="planInTableDescription">
                    {truncateDescription(plan.description)}
                </div>
                <div className="planInTableCreatedBy">
                    {plan.createBy}
                </div>
                <div className="planInTableCreatedDate">
                    {formatDate(plan.createDate)}
                </div>
                {/*<div className="planInTableModify">*/}
                {/*    */}
                {/*</div>*/}
            </div>
        ))
    );
}

