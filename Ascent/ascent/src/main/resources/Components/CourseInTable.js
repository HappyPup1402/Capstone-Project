import "../Styles/CourseInTable.css"
import React from "react";

export default function CourseInTable({ courses, sortOrder, dateSortOrder }) {
    let sortedCourses = courses; // Use the original order by default

    if (sortOrder === "asc" || sortOrder === "desc") {
        // If a valid sorting order is provided, sort the courses
        sortedCourses = [...courses]; // Create a copy to avoid mutating the original array

        sortedCourses.sort((a, b) => {
            const comparison = a.title.localeCompare(b.title);
            return sortOrder === "asc" ? comparison : -comparison;
        });
    } else if (dateSortOrder === "asc" || dateSortOrder === "desc") {
        // Sort the courses by date created
        sortedCourses = [...courses]; // Create a copy to avoid mutating the original array

        sortedCourses.sort((a, b) => {
            const dateA = new Date(a.dateCreated);
            const dateB = new Date(b.dateCreated);

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

        sortedCourses.map(course => (
            <div className="courseInTable" key={course.id}>
                <div className="courseInTableName">
                    <a href={course.contentLink}>
                        {course.title}
                    </a>
                </div>
                <div className="courseInTableType">
                    {course.contentType}
                </div>
                <div className="courseInTableDescription">
                    {truncateDescription(course.description)}
                </div>
                <div className="courseInTableCreatedBy">
                    {course.createdBy}
                </div>
                <div  className="courseInTableCreatedDate">
                    {formatDate(course.dateCreated)}
                </div>
                {/*<div className="courseInTableModify">*/}

                {/*</div>*/}
                {/*<div className="courseInTableEdit"></div>*/}
            </div>
        ))
    );
}