import React, { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';

type Theme = 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Always use dark theme
    const theme: Theme = 'dark';
    
    // Dummy toggleTheme function (does nothing since theme is always dark)
    const toggleTheme = () => {
        // Theme is locked to dark mode
    };

    // Apply dark theme to document root
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
    }, []);

    // Memoize context value
    const contextValue = useMemo(
        () => ({ theme, toggleTheme }),
        [theme]
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
