import React, { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes } from './components/routers';
import DeleteExpiredCookie from './components/DeleteCookie';
import { SnackbarProvider } from 'notistack';
const App = () => {
    return (
        <div>
            <StrictMode>
                <BrowserRouter>{Routes}</BrowserRouter>
                <SnackbarProvider
                    maxSnack={3}
                    anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                />
                <DeleteExpiredCookie />
            </StrictMode>
        </div>
    );
};

export default App;
