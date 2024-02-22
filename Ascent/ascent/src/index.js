import React from 'react';
import ReactDOM from 'react-dom/client';
import Login from "./main/resources/Pages/Login";
import "./main/resources/Styles/Login.css"
import {BrowserRouter} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Login/>
        </BrowserRouter>
    </React.StrictMode>
);