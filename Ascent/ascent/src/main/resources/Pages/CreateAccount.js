import Navbar from "../Components/Navbar";
import "../Styles/CreateAccount.css"
import {useNavigate} from "react-router-dom";
import React, {useState} from "react";


function CreateAccount() {

    const navigate = useNavigate();

    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [createAccountData, setCreateAccountData] = useState({
        userRole: "",
        firstName: "",
        lastName: "",
        email: "",
        managerEmail: "",
        password: "",
    });

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setCreateAccountData({
            ...createAccountData,
            [name]: value,
        });
    }


        const validateFields = () => {
            if (
                createAccountData.userRole.trim() === '' ||
                createAccountData.firstName.trim() === '' ||
                createAccountData.lastName.trim() === '' ||
                createAccountData.email.trim() === '' ||
                createAccountData.managerEmail.trim() === '' ||
                createAccountData.password.trim() === '' ||
                confirmPassword.trim() === ''
            ) {
                setErrorMessage('All fields are required.');
                console.error("User did not fill all required fields.")
                return false;
            }
            if (!createAccountData.email.includes('@')) {
                setErrorMessage('Invalid Email.');
                console.error("Invalid Email")
                return false;
            }
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
            if (!passwordRegex.test(createAccountData.password)) {
                setErrorMessage('Password must have at least 1 capital letter and 1 number.');
                console.error("Invalid Password")
                return false;
            }
            if (createAccountData.password.length < 8) {
                setErrorMessage('Password must be 8 character or longer.');
                console.error("Password must be 8 character or longer.")
                return false;
            }

            if (createAccountData.password !== confirmPassword) {
                setErrorMessage('Passwords do not match.');
                console.error("User did not enter matching passwords.")
                return false;
            }

            return true;
        };

        const handleLogin = () => {

            if (!validateFields()) {
                return;
            }

            // Send the formData to the Spring backend here
            fetch('http://localhost:8080/api/users/CreateAccount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': 'http://localhost:3000',
                },
                body: JSON.stringify(createAccountData),
            })
                .then((response) => {
                    if (response.status === 201) {
                        navigate('/');
                        console.log("Successfully created an account!")
                        // Successful login, you can redirect or perform other actions here
                    } else if (response.status === 409) {
                        setErrorMessage('Email is already in use.');
                        throw new Error("Email is already in use.")
                    } else {
                        // Handle login failure (e.g., display an error message)
                        setErrorMessage('Please try again.');
                    }
                })
                .catch((error) => {
                    console.error(error);
                });

        };

        return <div className="createAccountContainer">

            <Navbar/>
            <div className="createAccountContent">
                <div className="createAccountLeft">
                </div>
                <div className="createAccountMiddle">
                    <div className="createAccountBox">
                        <div className="createAccountBoxText">
                            <p>Create Your Account</p>
                        </div>
                        <div className="createAccountBoxRole">
                            <p>Select Your Role</p>
                            <select name="userRole" value={createAccountData.userRole} onChange={handleInputChange}>
                                <option/>
                                <option value="IC">IC</option>
                                <option value="Manager">Manager</option>
                            </select>
                        </div>
                        <div className="createAccountBoxSection">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First"
                                value={createAccountData.firstName}
                                onChange={handleInputChange}

                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last"
                                value={createAccountData.lastName}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="createAccountBoxSection">
                            <input
                                type="email"
                                placeholder="Email Address"
                                name="email"
                                value={createAccountData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="createAccountBoxSection">
                            <input
                                type="email"
                                placeholder="Manager Email"
                                name="managerEmail"
                                value={createAccountData.managerEmail}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="createAccountBoxSection">
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={createAccountData.password}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="createAccountBoxSection">
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div className="createAccountBoxSection">
                            <input
                                type="button"
                                value="Create Account"
                                onClick={handleLogin}
                            />
                            {errorMessage && (
                                <div className="error-message">{errorMessage}</div>
                            )}

                        </div>
                    </div>
                </div>
                <div className="createAccountRight"></div>
            </div>
        </div>
    }


export default CreateAccount;