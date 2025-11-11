// Contexto de autenticación
// Gestiona el estado de autenticación del usuario y persistencia en localStorage

import { createContext, useState, useContext, type ReactNode } from 'react';

// Interfaz del usuario autenticado
interface User {
    id: number;
    email: string;
    role: 'adoptante' | 'rescatista' | 'admin';
}

// Interfaz del contexto de autenticación
interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (user: User, token: string) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Funciones helper para gestionar localStorage
const getStoredUser = (): User | null => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
};

const getStoredToken = (): string | null => {
    return localStorage.getItem('token');
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // Inicializa el estado desde localStorage para persistencia entre recargas
    const [user, setUser] = useState<User | null>(getStoredUser());
    const [token, setToken] = useState<string | null>(getStoredToken());

    const login = (user: User, token: string) => {
        setUser(user);
        setToken(token);
        // Persiste en localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        // Elimina de localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const isAuthenticated = () => {
        // Verifica autenticación desde estado o localStorage
        return !!token || !!getStoredToken();
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto de autenticación
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};