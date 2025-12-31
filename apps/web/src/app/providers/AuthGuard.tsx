import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface AuthGuardProps {
    isAuthenticated: boolean;
    redirectPath?: string;
    children?: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
    isAuthenticated,
    redirectPath = '/login',
    children
}) => {
    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default AuthGuard;
