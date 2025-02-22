import type React from 'react';
import {TextInput, StyleSheet} from 'react-native';
import {useThemedStyles} from '../hooks/useThemedStyles';

interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

export const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
}) => {
  const styles = useThemedStyles(theme =>
    StyleSheet.create({
      input: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: theme.spacing.sm,
        padding: theme.spacing.sm,
        ...theme.typography.body,
        color: theme.colors.text,
      },
    }),
  );

  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor={styles.input.color}
      value={value}
      onChangeText={onChangeText}
    />
  );
};
