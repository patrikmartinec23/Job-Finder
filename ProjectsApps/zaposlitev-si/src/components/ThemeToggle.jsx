import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '', size = 'md' }) => {
    const { isDarkMode, toggleTheme } = useTheme();

    const getButtonSize = () => {
        switch (size) {
            case 'sm':
                return '32px';
            case 'lg':
                return '48px';
            default:
                return '40px';
        }
    };

    const buttonStyle = {
        width: getButtonSize(),
        height: getButtonSize(),
    };

    return (
        <button
            className={`theme-toggle ${className}`}
            style={buttonStyle}
            onClick={toggleTheme}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        >
            <i className={isDarkMode ? 'fas fa-sun' : 'fas fa-moon'}></i>
        </button>
    );
};

export default ThemeToggle;
