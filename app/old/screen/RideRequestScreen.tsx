import type React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useThemedStyles} from '../hooks/useThemedStyles';
import {Card} from '../components/Card';
import {Button} from '../components/Button';

export const RideRequestScreen: React.FC = () => {
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
      info: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.md,
      },
    }),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Ride</Text>
      <Card>
        <Text style={styles.info}>Driver: John Doe</Text>
        <Text style={styles.info}>ETA: 5 minutes</Text>
        <Text style={styles.info}>Car: Toyota Camry (ABC 123)</Text>
      </Card>
      <Button onPress={() => {}}>Cancel Ride</Button>
    </View>
  );
};
