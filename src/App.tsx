import React, { StrictMode, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes } from './components/routers';
import DeleteExpiredCookie from './components/DeleteCookie';
const App = () => {
    return (
        <div>
            <StrictMode>
                <BrowserRouter>{Routes}</BrowserRouter>
                <DeleteExpiredCookie />
            </StrictMode>
        </div>
    );
};

export default App;
