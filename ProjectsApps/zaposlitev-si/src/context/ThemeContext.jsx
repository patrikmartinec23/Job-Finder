import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('jobfinder-theme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
        } else {
            const prefersDark = window.matchMedia(
                '(prefers-color-scheme: dark)'
            ).matches;
            setIsDarkMode(prefersDark);
        }
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.setAttribute('data-theme', 'dark');
            localStorage.setItem('jobfinder-theme', 'dark');
        } else {
            root.setAttribute('data-theme', 'light');
            localStorage.setItem('jobfinder-theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    const value = {
        isDarkMode,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
};
