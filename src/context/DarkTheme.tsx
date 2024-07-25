import React, { createContext, useState, useEffect } from 'react';

interface ThemeContextProps {
  darkMode: boolean;
  Toggle: () => void;
}

const initialThemeContext: ThemeContextProps = {
  darkMode: false,
  Toggle: () => {} // Placeholder function
};

export const ThemeContext = createContext<ThemeContextProps>(initialThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Check system theme preference
  const getSystemTheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
    return false;
  };

  // Initialize state from localStorage or system theme
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedState = localStorage.getItem('toggleState');
    return savedState ? JSON.parse(savedState) : getSystemTheme();
  });

  // Update localStorage whenever toggleState changes
  useEffect(() => {
    localStorage.setItem('toggleState', JSON.stringify(darkMode));
  }, [darkMode]);

  const Toggle = () => setDarkMode((prevState) => !prevState);

  const contextValue: ThemeContextProps = {
    darkMode,
    Toggle
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
