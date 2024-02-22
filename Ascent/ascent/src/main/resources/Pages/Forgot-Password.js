import React, { useState } from 'react';
import Navbar from "../Components/Navbar";

import "../Styles/Forgot-Password.css"


function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [message, setMessage] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        setMessage('Password reset instructions sent to your email.');
    };

    return (
    // <div className="forgot-password-container">
        //     <h2 className="forgot-text">Forgot Password</h2>
        //     <form onSubmit={handleSubmit}>
        //         <label htmlFor="email">Email:</label>
        //         <input
        //             type="email"
        //             id="email"
        //             placeholder="Enter your email"
        //             value={email}
        //             onChange={handleEmailChange}
        //         />
        //         <button type="submit">Reset Password</button>
        //     </form>
        //     {message && <p className="message">{message}</p>}
        // </div>
        <div className="forgotContainer">
            <Navbar/>

            <div className="forgotLeft">
                {/*<div className="style">*/}
                {/*    <div className="bluel"></div>*/}
                {/*    <div className="purplel"></div>*/}
                {/*    <div className="pinkl"></div>*/}
                {/*</div>*/}

            </div>
            <div className="forgotMiddle">
                <div className="forgotBox">
                    <div className="forgotBoxSectionTitle">
                        <p>Forgot Your Password?</p>
                    </div>
                    <div className="forgotBoxSectionEmail">
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="email">Email:</label>
                            <input type="email"
                                   id="email"
                                   placeholder="Enter your email"
                                   value={email}
                                   onChange={handleEmailChange}
                            />
                        </form>
                    </div>
                    <div className="forgotBoxSectionCode">
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="email">Verification Code:</label>
                            <input type="code"
                                   id="code"
                                   placeholder="Enter your verifcation code"
                                   value={verificationCode}
                                   onChange={(e) => setVerificationCode(e.target.value)}
                                   required
                            />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;