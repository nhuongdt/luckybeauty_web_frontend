import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes } from './components/routers';
import Cookies from 'js-cookie';
const App = () => {
    setTimeout(() => {
        console.log(Cookies.get('accessToken'));
    }, 1);

    return <BrowserRouter>{Routes}</BrowserRouter>;
};

export default App;
