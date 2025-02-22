import React from 'react';
import { LoginScreen } from '../screens/LoginScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { RouteDetailsScreen } from '../screens/RouteDetailsScreen';
import { DeliveryConfirmationScreen } from '../screens/DeliveryConfirmationScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  RouteDetails: { route: import('../types').Route };
  DeliveryConfirmation: { routeId: string; destId: string };
};

export const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <Stack.Screen name="RouteDetails" component={RouteDetailsScreen} options={{ title: 'Route Details' }} />
      <Stack.Screen name="DeliveryConfirmation" component={DeliveryConfirmationScreen} options={{ title: 'Confirm Delivery' }} />
    </Stack.Navigator>
  </NavigationContainer>
);
