import type React from 'react';
import {View, StyleSheet} from 'react-native';
import {useThemedStyles} from '../hooks/useThemedStyles';

interface CardProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({children}) => {
  const styles = useThemedStyles(theme =>
    StyleSheet.create({
      card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.spacing.sm,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        shadowColor: theme.colors.text,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
  );

  return <View style={styles.card}>{children}</View>;
};
