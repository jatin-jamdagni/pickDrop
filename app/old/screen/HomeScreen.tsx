import type React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useThemedStyles} from '../hooks/useThemedStyles';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const HomeScreen: React.FC = () => {
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
      subtitle: {
        ...theme.typography.h2,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.md,
      },
    }),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Where to?</Text>
      <Input placeholder="Enter destination" value="" onChangeText={() => {}} />
      <Text style={styles.subtitle}>Suggested rides</Text>
      <Card>
        <Text>UberX</Text>
        <Button onPress={() => {}}>Request Ride</Button>
      </Card>
      <Card>
        <Text>UberXL</Text>
        <Button onPress={() => {}}>Request Ride</Button>
      </Card>
    </View>
  );
};
