import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes } from './components/routers';
const App = () => {
    return <BrowserRouter>{Routes}</BrowserRouter>;
};

export default App;
