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

// Recupera usuario desde localStorage con validación
const getStoredUser = (): User | null => {
    try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser || storedUser === 'undefined' || storedUser === 'null') {
            return null;
        }
        return JSON.parse(storedUser);
    } catch (error) {
        console.error('Error al parsear usuario desde localStorage:', error);
        // Limpia el localStorage corrupto
        localStorage.removeItem('user');
        return null;
    }
};

// Recupera token desde localStorage con validación
const getStoredToken = (): string | null => {
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined' || token === 'null') {
        localStorage.removeItem('token');
        return null;
    }
    return token;
};

// Limpia datos inválidos del localStorage
const cleanupLocalStorage = () => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (user === 'undefined' || user === 'null') {
        localStorage.removeItem('user');
    }
    
    if (token === 'undefined' || token === 'null') {
        localStorage.removeItem('token');
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // Limpia localStorage corrupto antes de inicializar
    cleanupLocalStorage();
    
    // Inicializa el estado desde localStorage para persistencia entre recargas
    const [user, setUser] = useState<User | null>(getStoredUser());
    const [token, setToken] = useState<string | null>(getStoredToken());

    // Guarda usuario y token en estado + localStorage
    const login = (user: User, token: string) => {
        if (!user || !token) {
            console.error('Intento de login con datos inválidos:', { user, token });
            return;
        }
        
        // Persiste en localStorage PRIMERO para evitar race conditions
        try {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
        
        // Luego actualiza el estado
        setUser(user);
        setToken(token);
    };

    // Limpia sesión del estado y localStorage
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    // Chequea si hay sesión activa
    const isAuthenticated = () => {
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