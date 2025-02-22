import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getRoute} from '../services/api';
import {Route} from '../types';
import {Button} from '../components/Button';
 import {startLocationTracking} from '../utils/location';
import {RootStackParamList} from '../navigation/AppNavigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { requestCameraPermission } from '../services/permissions';
// import { checkLocationAccuracy } from 'react-native-permissions';
// import { checkCameraPermission } from '../services/permissions';

type DashboardScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Dashboard'
>;

interface Props {
  navigation: DashboardScreenNavigationProp;
}

export const DashboardScreen: React.FC<Props> = ({navigation}) => {
  const [route, setRoute] = useState<Route | null>(null);

  useEffect(() => {
    const init = async () => {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }

      const token = await AsyncStorage.getItem('token');
      const driverId = await AsyncStorage.getItem('driverId');
      if (token && driverId) {
        const fetchedRoute = await getRoute(driverId, token);
        setRoute(fetchedRoute);
        startLocationTracking(driverId, token); // Start tracking
      }
    };
    init();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Dashboard</Text>
      {route ? (
        <Button
          title="View Route"
          onPress={() => navigation.navigate('RouteDetails', {route})}
        />
      ) : (
        <Text>No route assigned yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});


// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Alert } from 'react-native';
//  import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getRoute } from '../services/api';
// import { Route } from '../types';
// import { Button } from '../components/Button';
//  import { startLocationTracking } from '../utils/location';
// import { RootStackParamList } from '../navigation/AppNavigator';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
// import { checkLocationPermission } from '../services/permissions';

// type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

// interface Props {
//   navigation: DashboardScreenNavigationProp;
// }

// export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
//   const [route, setRoute] = useState<Route | null>(null);

//   useEffect(() => {
//     const init = async () => {
//       const hasPermission = await checkLocationPermission();
//       if (!hasPermission) {
//         Alert.alert('Permission Denied', 'Location permission is required to proceed.');
//         return;
//       }

//       const token = await AsyncStorage.getItem('token');
//       const driverId = await AsyncStorage.getItem('driverId');
//       if (token && driverId) {
//         try {
//           const fetchedRoute = await getRoute(driverId, token);
//           setRoute(fetchedRoute);
//           startLocationTracking(driverId, token);
//         } catch (error) {
//           console.log('Error fetching route:', error);
//         }
//       }
//     };
//     init();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Driver Dashboard</Text>
//       {route ? (
//         <Button
//           title="View Route"
//           onPress={() => navigation.navigate('RouteDetails', { route })}
//         />
//       ) : (
//         <Text>No route assigned yet.</Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
// });
