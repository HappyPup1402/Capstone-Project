import "../Styles/QuizInTable.css"
import React from "react";
import {Link} from "react-router-dom";

export default function QuizInTable({ quizzes, sortOrder, dateSortOrder, contentQuizMap, courses, quizDetail}) {
    let sortedQuizzes = quizzes; // Use the original order by default

    if (sortOrder === "asc" || sortOrder === "desc") {
        // If a valid sorting order is provided, sort the courses
        sortedQuizzes = [...quizzes]; // Create a copy to avoid mutating the original array

        sortedQuizzes.sort((a, b) => {
            const comparison = a.name.localeCompare(b.name);
            return sortOrder === "asc" ? comparison : -comparison;
        });
    } else if (dateSortOrder === "asc" || dateSortOrder === "desc") {
        // Sort the courses by date created
        sortedQuizzes = [...quizzes]; // Create a copy to avoid mutating the original array

        sortedQuizzes.sort((a, b) => {
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

    function findLinkedCourse(quizId) {
        const mapEntry = contentQuizMap.find(entry => entry.quizId === quizId);
        if (mapEntry) {
            // Assuming you have an array of courses with course IDs
            const linkedCourse = courses.find(course => course.id === mapEntry.contentId);
            if (linkedCourse) {
                return linkedCourse.title;
            }
        }

        return "";
    }

    function getNumberOfQuestions(quizId) {
        const questionsForQuiz = quizDetail.filter((detail) => detail.quiz.quizId === quizId);
        return questionsForQuiz.length;
    }


    return (
        sortedQuizzes.map(quiz => (
            <div className="quizInTable" key={quiz.quizId}>
                <div className="quizInTableName">
                    <Link to={`/Quiz/${quiz.quizId}`}> {/* Pass quizId as a route parameter */}
                        {quiz.name}
                    </Link>
                </div>
                <div className="quizInTableQuestionAmount">
                    ({getNumberOfQuestions(quiz.quizId)})
                </div>
                <div className="quizInTableDifficulty">
                    {quiz.difficulty}
                </div>
                <div className="quizInTableLinkedCourse">
                    {findLinkedCourse(quiz.quizId)}
                </div>
                <div className="quizInTableCreatedBy">
                    {quiz.createBy}
                </div>
                <div className="quizInTableCreatedDate">
                    {formatDate(quiz.createDate)}
                </div>
                {/*<div className="courseInTableEdit"></div>*/}
            </div>
        ))
    );
}