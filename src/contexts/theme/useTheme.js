import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

// [REQ-15] Modular context structure: a custom hook that throws a clear error when used outside its Provider
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}