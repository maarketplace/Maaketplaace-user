import React, { createContext, useState, useEffect } from 'react';

interface ThemeContextProps {
  userDarkeMode: boolean;
  ToggleDarkMode: () => void;
}

const initialThemeContext: ThemeContextProps = {
  userDarkeMode: false,
  ToggleDarkMode: () => {} // Placeholder function
};

export const UserThemeContext = createContext<ThemeContextProps>(initialThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Check system theme preference
  const getUserSystemTheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
    return false;
  };

  // Initialize state from localStorage or system theme
  const [userDarkeMode, setUserDarkMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem('userTogleState');
    return savedMode ? JSON.parse(savedMode) : getUserSystemTheme();
  });

  // Update localStorage whenever toggleState changes
  useEffect(() => {
    localStorage.setItem('userTogleState', JSON.stringify(userDarkeMode));
  }, [userDarkeMode]);

  const ToggleDarkMode = () => setUserDarkMode((prevState) => !prevState);

  const contextValue: ThemeContextProps = {
    userDarkeMode,
    ToggleDarkMode
  };

  return (
    <UserThemeContext.Provider value={contextValue}>
      {children}
    </UserThemeContext.Provider>
  );
};
