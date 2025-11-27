import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Initialize theme from localStorage or default to 'light'
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('katze-theme') as Theme;
        return savedTheme || 'light';
    });

    // Apply theme to document root
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('katze-theme', theme);
    }, [theme]);

    // Optimizar toggleTheme con useCallback
    const toggleTheme = useCallback(() => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    }, []);

    // Memoizar el valor del contexto
    const contextValue = useMemo(
        () => ({ theme, toggleTheme }),
        [theme, toggleTheme]
    );

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook for using theme context
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
