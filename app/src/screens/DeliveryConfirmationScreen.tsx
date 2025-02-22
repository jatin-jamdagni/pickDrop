import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {markDelivered} from '../services/api';
import {Button} from '../components/Button';
import {RootStackParamList} from '../navigation/AppNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import { requestLocationPermission } from '../services/permissions';

type DeliveryConfirmationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'DeliveryConfirmation'
>;
type DeliveryConfirmationScreenRouteProp = RouteProp<
  RootStackParamList,
  'DeliveryConfirmation'
>;

interface Props {
  route: DeliveryConfirmationScreenRouteProp;
  navigation: DeliveryConfirmationScreenNavigationProp;
}

export const DeliveryConfirmationScreen: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const {routeId, destId} = route.params;
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    const getCameraPermission = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Camera permission is required.');
      }
    };
    getCameraPermission();
  }, []);

  const handleDelivered = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      await markDelivered(routeId, destId, remarks, token);
      navigation.navigate('Dashboard');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Confirmation</Text>
      <TextInput
        style={styles.input}
        placeholder="Remarks (optional)"
        value={remarks}
        onChangeText={setRemarks}
      />
      <Button title="Mark Delivered" onPress={handleDelivered} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
  },
});
