import { createContext, useContext, useEffect, useState } from 'react';

// Pre-defined luxury Material You palettes for Indian destinations
export const DESTINATION_THEMES = {
  default: {
    primary: '#1E1B4B', // Deep Royal Indigo
    secondary: '#065F46', // Emerald Green
    accent: '#D97706', // Saffron Gold
    surface: '#F8FAFC',
    background: '#020617',
  },
  rajasthan: {
    primary: '#D4AF37', // Gold
    secondary: '#8B4513', // Sienna
    accent: '#B22222', // Firebrick
    surface: '#FFF8DC', // Cornsilk
    background: '#2C1E16',
  },
  kerala: {
    primary: '#2E8B57', // Sea Green
    secondary: '#006400', // Dark Green
    accent: '#FFD700', // Gold
    surface: '#F0FFF0', // Honeydew
    background: '#0B2414',
  },
  goa: {
    primary: '#0284C7', // Ocean Blue
    secondary: '#0D9488', // Teal
    accent: '#F59E0B', // Amber/Sunset
    surface: '#F0F9FF',
    background: '#082F49',
  }
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState('default');
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const theme = DESTINATION_THEMES[themeName] || DESTINATION_THEMES.default;
    const root = document.documentElement;
    
    // Convert hex to CSS variables for Tailwind v4 consumption
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
  }, [themeName, isDarkMode]);

  return (
    <ThemeContext.Provider value={{ themeName, setThemeName, isDarkMode, setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
