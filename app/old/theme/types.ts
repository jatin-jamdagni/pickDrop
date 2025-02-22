
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
  typography: {
    h1: {
      fontSize: number;
      lineHeight: number;
      fontWeight: '700' | '600' | '400';
    };
    h2: {
      fontSize: number;
      lineHeight: number;
      fontWeight: '700' | '600' | '400';
    };
    body: {
      fontSize: number;
      lineHeight: number;
      fontWeight: '700' | '600' | '400';
    };
    caption: {
      fontSize: number;
      lineHeight: number;
      fontWeight: '700' | '600' | '400';
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

export type ThemeType = 'light' | 'dark';
