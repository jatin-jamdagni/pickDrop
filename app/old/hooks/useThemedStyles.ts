// src/hooks/useThemedStyles.ts
// import { useMemo } from 'react';
// import { StyleSheet } from 'react-native';
// import { useTheme } from '../theme/ThemeContext';
// import { Theme } from '../theme/types';

// export const useThemedStyles = <T extends {}>(
//     styleFactory: (theme: Theme) => T
// ) => {
//     const { theme } = useTheme();

//     return useMemo(() => {
//         return StyleSheet.create(styleFactory(theme));
//     }, [theme, styleFactory]);
// };

import {StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {Theme} from '../theme/types';
import {useTheme} from '../theme/ThemeContext';
import {useMemo} from 'react';

type NamedStyles<T> = {[P in keyof T]: ViewStyle | TextStyle};

export const useThemedStyles = <T extends NamedStyles<T>>(
  styleFactory: (theme: Theme) => T,
) => {
  const {theme} = useTheme();

  return useMemo(() => {
    return StyleSheet.create(styleFactory(theme));
  }, [theme, styleFactory]);
};
