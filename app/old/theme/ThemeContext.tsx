import type React from 'react';
import {createContext, useState, useContext, useEffect} from 'react';
import {StyleSheet, useColorScheme} from 'react-native';
import type {Theme} from './types';
import {ThemeType} from './types';
import {darkTheme} from './darkTheme';
import {lightTheme} from './lightTheme';
import {SafeAreaView} from 'react-native-safe-area-context';

interface ThemeContextType {
  theme: Theme;
  themeType: ThemeType;
  setTheme: (type: ThemeType) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const colorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>(
    colorScheme === 'dark' ? 'dark' : 'light',
  );

  useEffect(() => {
    setThemeType(colorScheme === 'dark' ? 'dark' : 'light');
  }, [colorScheme]);

  const theme = themeType === 'dark' ? darkTheme : lightTheme;
  const isDark = themeType === 'dark';

  const setTheme = (type: ThemeType) => {
    setThemeType(type);
  };

  return (
    <ThemeContext.Provider value={{theme, themeType, setTheme, isDark}}>
      <SafeAreaView style={styles.containerSafeAreaView}>
        {children}
      </SafeAreaView>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  containerSafeAreaView: {
    flex: 1,
  },
});
