import React from 'react';
import { Navigate, Route, RouterProps } from 'react-router-dom';
//import { isGranted } from '../../../lib/abpUtility'

interface ProtectedRouteProps {
    path: string;
    component: React.ComponentType<any>;
    permission?: string;
    render?: (props: RouterProps) => React.ReactNode;
}
const isAuthenticated = (): boolean => {
    // Check if user is authenticated (e.g. valid token in local storage)
    return localStorage.getItem('isLogin') !== null;
};
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    return <Route element={<Component />} />;
};

export default ProtectedRoute;
