// frontend/src/context/AuthContext.tsx
import { createContext, useState, useContext, type ReactNode } from 'react';

// --- (La interfaz User sigue igual) ---
interface User {
    id: number;
    email: string;
    role: 'adoptante' | 'rescatista' | 'admin';
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (user: User, token: string) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- 1. Funciones Helper para localStorage ---
const getStoredUser = (): User | null => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
};

const getStoredToken = (): string | null => {
    return localStorage.getItem('token');
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // 2. Inicializa el estado DESDE localStorage
    const [user, setUser] = useState<User | null>(getStoredUser());
    const [token, setToken] = useState<string | null>(getStoredToken());

    const login = (user: User, token: string) => {
        setUser(user);
        setToken(token);
        // 3. GUARDA en localStorage (¡Esto es síncrono/instantáneo!)
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        // 4. QUITA de localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const isAuthenticated = () => {
        // 5. Revisa el token del estado O de localStorage
        // Esto soluciona la condición de carrera.
        return !!token || !!getStoredToken();
    };

    // --- El resto del hook 'useAuth' sigue igual ---
    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};