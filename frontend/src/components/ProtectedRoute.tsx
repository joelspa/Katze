// Componente de ruta protegida
// Restringe acceso a rutas según autenticación y roles de usuario

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactElement;
    allowedRoles: string[]; // Roles permitidos para acceder a esta ruta
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useAuth();

    // Redirige a login si el usuario no está autenticado
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    // Obtiene el usuario del contexto o del localStorage (fallback para race conditions)
    const currentUser = user || (() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    })();

    // Redirige a inicio si el usuario no tiene el rol requerido
    if (!currentUser || !allowedRoles.includes(currentUser.role)) {
        return <Navigate to="/" replace />;
    }

    // Permite acceso si el usuario está autenticado y tiene el rol correcto
    return children;
};

export default ProtectedRoute;