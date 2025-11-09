// frontend/src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactElement;
    allowedRoles: string[]; // Un array de roles, ej. ['rescatista', 'admin']
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated()) {
        // Si no está logueado, llévalo a login
        return <Navigate to="/login" replace />;
    }

    if (user && !allowedRoles.includes(user.role)) {
        // Si está logueado, pero no tiene el rol correcto, llévalo al inicio
        // (O a una página de "No autorizado")
        return <Navigate to="/" replace />;
    }

    // Si está logueado Y tiene el rol correcto, muestra la página
    return children;
};

export default ProtectedRoute;