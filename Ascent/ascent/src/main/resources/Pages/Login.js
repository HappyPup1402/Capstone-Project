import React, {useEffect, useState} from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Navbar from '../Components/Navbar';
import Home from './Home';
import ForgotPassword from './Forgot-Password';
import CreateAccount from './CreateAccount';
import MyTraining from './MyTraining';
import TrainingPlan from './TrainingPlan';
import TrainingPlanContent from './TrainingPlanContent';
import KPI from './KPI';
import UserProfile from "./UserProfile";
import NewCourse from "./NewCourse";
import TrainingContent from "./TrainingContent";
import QuizContent from "./QuizContent";
import QuizCreation from "./QuizCreation";
import NewTrainingPlan from "./NewTrainingPlan";
import Quiz from "./Quiz";
import MyTrainingContent from "./MyTrainingContent";



function Navigation() {

    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/CreateAccount" element={<CreateAccount />} />
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/MyTraining" element={<MyTraining />} />
            <Route path="/MyTrainingContent/:id" element={<MyTrainingContent />} />
            <Route path="/TrainingPlan" element={<TrainingPlan />} />
            <Route path="/TrainingPlanContent/:id" element={<TrainingPlanContent />} />
            <Route path="/QuizContent" element={<QuizContent />} />
            <Route path="/KPI" element={<KPI />} />
            <Route path="/TrainingContent" element={<TrainingContent />} />
            <Route path="/UserProfile" element={<UserProfile />} />
            <Route path="/Account" element={<Home />} />
            <Route path="/NewCourse" element={<NewCourse />} />
            <Route path="/QuizCreation" element={<QuizCreation />} />
            <Route path="/NewTrainingPlan" element={<NewTrainingPlan />} />
            <Route path="/Quiz/:quizId" element={<Quiz />} />
        </Routes>
    );
}

function Login( ) {

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [users, setUsers] = useState('');

    const [loginData, setLoginData] = useState({
        email: "",
        password: "" ,
        loggedInUserId: "",
        loggedInUserRole: ""
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setLoginData({
            ...loginData,
            [name]: value,
        });
    };

    useEffect(() => {
        fetch('http://localhost:8080/api/users/GetAllUsers')
            .then(response => {
                if (!response.ok) {
                    throw Error(`Request failed with status ${response.status}`);
                }
                return response.json();
            })
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleLogin = () => {
        // Send the formData to the Spring backend here
        fetch('http://localhost:8080/api/users/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:3000',
            },
            body: JSON.stringify(loginData),
        })
            .then((response) => {
                if (response.status === 202) {
                    // Set the email in the context
                    localStorage.setItem('email', loginData.email);
                    // Extract userID and Role from the user data
                    const loggedInUser = users.find(user => user.email === loginData.email);
                    localStorage.setItem('loggedInUserId', loggedInUser.id);
                    localStorage.setItem('loggedInUserRole', loggedInUser.userRole);
                    navigate('/Home')
                    console.log("Login successful!")
                } else {
                    // Handle other status codes as needed
                    setErrorMessage('Invalid email or password. Please try again.');
                    // console.log(loginData);
                    throw new Error("User does not exist.")
                }
            })
            .catch((error) => {
                console.error(error);
            });

    };

    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="mainContainer">
            <Navbar />
            <div className="lowerPage">
                <div className="loginImage"></div>
                <div className="signIn">
                    <div className="signInBox">
                        <div className="loginText">
                            <h1>Ascent</h1>
                            <p>Training and Learning Management for WDC</p>
                            {errorMessage && (
                                <div className="error-message">{errorMessage}</div>
                            )}
                        </div>
                        <div className="email">
                            <p>Email Address</p>
                            <input
                                type="email"
                                name="email"
                                value={loginData.email}
                                onChange={handleInputChange}

                            />
                        </div>
                        <div className="password">
                            <p>Password</p>
                            <div className="passwordInputBox">
                                <input
                                    type={passwordVisible ? 'text' : 'password'}
                                    name="password"
                                    value={loginData.password}
                                    onChange={handleInputChange}
                                />
                                <div
                                    className={passwordVisible ? 'visiblePasswordToggle' : 'hiddenPasswordToggle'}
                                    onClick={togglePasswordVisibility}>
                                </div>
                            </div>
                        </div>
                        <div className="remember_forgot">
                            <div className="remember">
                                <input type="checkbox" />
                                <p>Remember Me</p>
                            </div>
                            <a href="/">Forgot Password</a>
                        </div>
                        <div className="buttons">
                            <button className="login" onClick={handleLogin}>
                                Login
                            </button>
                            <a href="./CreateAccount">
                                <button className="create">Create Account</button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navigation;
