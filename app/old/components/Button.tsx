import type React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useThemedStyles} from '../hooks/useThemedStyles';

interface ButtonProps {
  onPress: () => void;
  children: string;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  children,
  variant = 'primary',
}) => {
  const styles = useThemedStyles(theme =>
    StyleSheet.create({
      button: {
        backgroundColor: theme.colors[variant],
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.spacing.sm,
        alignItems: 'center',
      },
      text: {
        color: theme.colors.background,
        ...theme.typography.body,
        fontWeight: '600',
      },
    }),
  );

  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
};
