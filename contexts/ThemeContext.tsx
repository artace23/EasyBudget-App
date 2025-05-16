import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: (value: boolean) => Promise<void>;
  colors: {
    background: string;
    text: string;
    border: string;
    card: string;
    primary: string;
  };
};

const lightColors = {
  background: '#fff',
  text: '#000',
  border: '#F0F0F0',
  card: '#fff',
  primary: '#6B4EFF',
};

const darkColors = {
  background: '#1A1A1A',
  text: '#fff',
  border: '#2A2A2A',
  card: '#2A2A2A',
  primary: '#6B4EFF',
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: async () => {},
  colors: lightColors,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadDarkModeSetting();
  }, []);

  const loadDarkModeSetting = async () => {
    try {
      const darkModeSetting = await AsyncStorage.getItem('darkMode');
      setIsDarkMode(darkModeSetting === 'true');
    } catch (error) {
      console.error('Error loading dark mode setting:', error);
    }
  };

  const toggleDarkMode = async (value: boolean) => {
    setIsDarkMode(value);
    await AsyncStorage.setItem('darkMode', value.toString());
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);