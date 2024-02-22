import "../Styles/CourseCard.css"
import React, {useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import "../Styles/CourseCard.css"
import SlProgressRing from '@shoelace-style/shoelace/dist/react/progress-ring';

export default function CourseCard({ trainingPlansInfo, assignedPlans }) {

    function formatDate(inputDate) {
        // Parse the input date string
        const date = new Date(inputDate);

        // Define the options for formatting the date
        const options = { year: 'numeric', month: 'long', day: 'numeric' };

        // Use the options to format the date
        return date.toLocaleDateString(undefined, options);
    }

    // State to store completion percentage
    const [planCompletionPercentages, setPlanCompletionPercentages] = useState({});

    useEffect(() => {
        // Calculate completion percentages for each assigned plan
        const percentages = {};
        assignedPlans.forEach((plan) => {
            const quizResultObject = JSON.parse(plan.quizResult);
            let naCount = 0;
            let passedCount = 0;

            // Count 'N/A' and 'Passed' results in the quiz
            for (const key in quizResultObject) {
                if (quizResultObject[key] === 'N/A') {
                    naCount++;
                } else if (quizResultObject[key] === 'Passed') {
                    passedCount++;
                }
            }

            // Calculate completion percentage for the plan
            const totalCoursesInAssignedPlan = naCount + passedCount;
            const planCompletionPercentage = totalCoursesInAssignedPlan > 0 ? (passedCount / totalCoursesInAssignedPlan) * 100 : 0;

            percentages[plan.planId] = planCompletionPercentage;
        });

        // Update the state with completion percentages
        setPlanCompletionPercentages(percentages);
    }, [assignedPlans]);


    return (
        trainingPlansInfo.map((plans, index) => {
            // Find the assigned plan that matches the current training plan by id
            const matchedAssignedPlan = assignedPlans.find(
                (assignedPlan) => assignedPlan.planId === plans.id
            );

            // Extract the dueDate from the matched assigned plan
            const dueDate = matchedAssignedPlan ? matchedAssignedPlan.dueDate : "N/A";
            const completionPercentage = planCompletionPercentages[plans.id] || 0;

            // Define colors based on the index
            let trackColor, indicatorColor;

            if (index === 0 || index === 3 || index === 6) {
                // First ring (blue)
                trackColor = 'white';
                indicatorColor = '#54A5FF';
            } else if (index === 1 || index === 4 || index === 7) {
                // Second ring (purple)
                trackColor = 'white';
                indicatorColor = '#A34EFF';
            } else if (index === 2 || index === 5 || index === 8) {
                // Third ring (pink)
                trackColor = 'white';
                indicatorColor = '#FF0058';
            }

            return (
                <div className="courseCardBackground" key={plans.id}>
                    <Link className="courseCardLink" to={`/MyTrainingContent/${plans.id}`}>
                        <div className="courseCard">
                            <div className="courseCardTitle">
                                <p>{plans.name}</p>
                            </div>
                            <div className="courseCardProgress">
                                <SlProgressRing
                                    value={completionPercentage}
                                    style={{
                                        '--track-color': trackColor,
                                        '--indicator-color': indicatorColor,
                                        '--indicator-width': '10px'
                                    }}
                                >
                                    {completionPercentage}%
                                </SlProgressRing>
                            </div>
                            <div className="courseCardAssignedBy">
                                <p>Assigned By:</p>
                                <p>{plans.createBy}</p>
                            </div>
                            <div className="courseCardDueDate">
                                <p>Due: {formatDate(dueDate)}</p>
                            </div>
                        </div>
                    </Link>
                </div>
            );
        })
    );
}

