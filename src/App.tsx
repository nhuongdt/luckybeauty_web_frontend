import React, { StrictMode, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes } from './components/routers';
import Cookies from 'js-cookie';
const App = () => {
    setTimeout(() => {
        console.log(Cookies.get('accessToken'));
    }, 1);

    return (
        <StrictMode>
            <BrowserRouter>{Routes}</BrowserRouter>;
        </StrictMode>
    );
};

export default App;
