import type React from 'react';
import {View, Text, StyleSheet, Switch} from 'react-native';
import {useThemedStyles} from '../hooks/useThemedStyles';
import {useTheme} from '../theme/ThemeContext';
import { Button } from '../components/Button';

export const ProfileScreen: React.FC = () => {
  const {isDark, setTheme} = useTheme();

  const styles = useThemedStyles(theme =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md,
      },
      title: {
        ...theme.typography.h1,
        color: theme.colors.text,
        marginBottom: theme.spacing.lg,
      },
      row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
      },
      label: {
        ...theme.typography.body,
        color: theme.colors.text,
      },
    }),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch
          value={isDark}
          onValueChange={value => setTheme(value ? 'dark' : 'light')}
        />
      </View>
      <Button onPress={() => {}}>Edit Profile</Button>
      <Button onPress={() => {}} variant="secondary">
        Log Out
      </Button>
    </View>
  );
};
