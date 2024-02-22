import React, {useState} from "react";
import {Link, useLocation} from "react-router-dom";

export default function MainNavbar() {

    const location = useLocation();
    const email = localStorage.getItem('email');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };


    return <nav className="nav">
        <div className="logoAndTitle">
            <div className="ascentLogo">
                <a href="/Home"></a>
            </div>
            <a href="/Home" className="site-title">Ascent</a>
        </div>
        <ul>
            <li className={location.pathname === "/MyTraining" ? "active" : ""}>
                <div className="myTraining"></div>
                <Link to="/MyTraining">My Training</Link>
            </li>
            <li className={location.pathname === "/TrainingPlan" ? "active" : ""}>
                <div className="trainingPlan"></div>
                <Link to="/TrainingPlan">Training Plan</Link>
            </li>
            <li className={location.pathname === "/QuizContent" ? "active" : ""}>
                <div className="quizCreation"></div>
                <Link to="/QuizContent">Quiz Content</Link>
            </li>
            {/*<li>*/}
            {/*    <div className="kpi"></div>*/}
            {/*    <a href="/KPI">KPI</a>*/}
            {/*</li>*/}
            <li className={location.pathname === "/TrainingContent" ? "active" : ""}>
                <div className="trainingContents"></div>
                <a href="/TrainingContent">Training Contents</a>
            </li>
        </ul>
        <div className="navEmail" onMouseEnter={toggleDropdown} onMouseLeave={closeDropdown}>
            <div className="emailIcon"></div>
            {/*<div className="userEmail">{email}</div>*/}
            <div className="userEmail">{email}</div>
            {isDropdownOpen && (
                <div className="dropdownContent">
                    <a href="/">Sign Out</a>
                </div>
            )}
        </div>
    </nav>
}
