import Cookies from 'js-cookie';
import React, { FC } from 'react';
import { Navigate, Route, RouterProps } from 'react-router-dom';
//import { isGranted } from '../../../lib/abpUtility'
const isAuthenticated = (): boolean => {
    // Check if user is authenticated (e.g. valid token in local storage)
    return localStorage.getItem('isLogin') !== null;
};
const ProtectedRoute: FC<{ component: FC; path: string }> = ({ component: Component, path }) => {
    const isLogin = () => {
        return Cookies.get('userId');
    };

    return (
        <Route
            path={path}
            element={isLogin() ? <Component /> : <Navigate replace to={'/login'} />}
        />
    );
};

export default ProtectedRoute;
