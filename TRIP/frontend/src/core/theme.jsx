import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const DESTINATION_THEMES = {
  default: {
    primary: '#1E1B4B',
    secondary: '#065F46',
    accent: '#D97706',
    surface: '#F8FAFC',
    background: '#020617',
  },
  rajasthan: {
    primary: '#D4AF37',
    secondary: '#8B4513',
    accent: '#B22222',
    surface: '#FFF8DC',
    background: '#2C1E16',
  },
  kerala: {
    primary: '#2E8B57',
    secondary: '#006400',
    accent: '#FFD700',
    surface: '#F0FFF0',
    background: '#0B2414',
  },
  goa: {
    primary: '#0284C7',
    secondary: '#0D9488',
    accent: '#F59E0B',
    surface: '#F0F9FF',
    background: '#082F49',
  }
};

const ThemeContext = createContext();

const STORAGE_KEY = 'wandersync-theme-mode';

function getInitialMode() {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored !== null) return stored === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState('default');
  const [isDarkMode, setIsDarkMode] = useState(getInitialMode);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  useEffect(() => {
    const theme = DESTINATION_THEMES[themeName] || DESTINATION_THEMES.default;
    const root = document.documentElement;
    
    root.style.setProperty('--md-sys-color-primary', theme.primary);
    root.style.setProperty('--md-sys-color-secondary', theme.secondary);
    root.style.setProperty('--md-sys-color-accent', theme.accent);
    root.style.setProperty('--md-sys-color-surface', theme.surface);
    root.style.setProperty('--md-sys-color-background', theme.background);
    
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, isDarkMode ? 'dark' : 'light');
  }, [themeName, isDarkMode]);

  // Listen for system preference changes
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return; // user has explicit preference

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setIsDarkMode(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <ThemeContext.Provider value={{ themeName, setThemeName, isDarkMode, setIsDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
