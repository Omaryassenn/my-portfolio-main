import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Initialize theme outside of component to prevent flash
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  return savedTheme ? savedTheme === 'dark' : true; // Default to dark if no theme is saved
};

// Apply theme to document
const applyTheme = (isDark) => {
  const root = document.documentElement;
  const body = document.body;
  
  if (isDark) {
    root.classList.add('dark-mode');
    root.classList.remove('light-mode');
    body.className = 'dark-mode';
  } else {
    root.classList.add('light-mode');
    root.classList.remove('dark-mode');
    body.className = 'light-mode';
  }
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);

  useEffect(() => {
    // Apply theme
    applyTheme(isDarkMode);
    // Save to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Provide both the current theme and the toggle function
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 