import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppStore, UserRole } from '@/shared/kernel/store';
import { toast } from 'sonner';

interface RoleGuardProps {
    allowedRoles: UserRole[];
    redirectPath?: string;
    children?: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, redirectPath = '/', children }) => {
    const userRole = useAppStore((state) => state.userRole);
    const isAuthenticated = useAppStore((state) => state.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (userRole && !allowedRoles.includes(userRole)) {
        // Notify user about unauthorized access attempt
        // Prevent toast spam by checking if one is already active (optional optimization)
        toast.error("Unauthorized Access: You don't have permission to view this page.");
        return <Navigate to={redirectPath} replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default RoleGuard;
