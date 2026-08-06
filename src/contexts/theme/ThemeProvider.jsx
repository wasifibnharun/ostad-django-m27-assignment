import { useState, useEffect, useRef, useMemo } from 'react';
import { ThemeContext } from './ThemeContext';

export function ThemeProvider({ children }) {
  // Initialize theme from localStorage or default to 'dark'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('nexus_theme') || 'dark';
  });

  // [REQ-1] useRef to touch the DOM: data-theme set with setAttribute
  const htmlRef = useRef(document.documentElement);

  useEffect(() => {
    // Persist to localStorage
    localStorage.setItem('nexus_theme', theme);
    // Apply data-theme attribute directly to the HTML root element
    htmlRef.current.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}