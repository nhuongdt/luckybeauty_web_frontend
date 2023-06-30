import React, { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes } from './components/routers';
import { SnackbarProvider } from 'notistack';
const App = () => {
    return (
        <div>
            <BrowserRouter>{Routes}</BrowserRouter>
            <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
            />
        </div>
    );
};

export default App;
