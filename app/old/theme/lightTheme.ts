import { Theme } from './types';

export const lightTheme: Theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#6C6C6C',
    border: '#C6C6C8',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FFCC00',
  },
  typography: {
    h1: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '700',
    },
    h2: {
      fontSize: 22,
      lineHeight: 28,
      fontWeight: '600',
    },
    body: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '400',
    },
    caption: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};
