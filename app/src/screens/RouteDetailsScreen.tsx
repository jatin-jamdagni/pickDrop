 

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { Route, PickupPoint, Destination } from '../types';
import { Button } from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updatePickupStatus, markReached } from '../services/api';
import { RootStackParamList } from '../navigation/AppNavigator';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

type RouteDetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RouteDetails'>;
type RouteDetailsScreenRouteProp = RouteProp<RootStackParamList, 'RouteDetails'>;

interface Props {
  route: RouteDetailsScreenRouteProp;
  navigation: RouteDetailsScreenNavigationProp;
}

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface DirectionsResponse {
  routes: {
    overview_polyline: { points: string };
    legs: { duration: { value: number }; distance: { value: number } }[];
  }[];
  status: string;
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyCqyC2_frqEvhxj-hwWS3hJce_ch8qE2GU'; // Replace with your actual key

// Haversine formula to calculate distance between two points (in meters)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

// Decode Google Maps polyline
const decodePolyline = (encoded: string): Coordinate[] => {
  let points: Coordinate[] = [];
  let index = 0,
    len = encoded.length;
  let lat = 0,
    lng = 0;

  while (index < len) {
    let b,
      shift = 0,
      result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return points;
};

export const RouteDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { route: routeData } = route.params;
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>([]);
  const [travelTime, setTravelTime] = useState<string>('');
  const [distance, setDistance] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null);

  const coordinates = [
    ...routeData.pickupPoints.map((p) => ({ latitude: p.lat, longitude: p.lng })),
    ...routeData.destinations.map((d) => ({ latitude: d.lat, longitude: d.lng })),
  ];

  // Fetch route from Google Directions API
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const origin = `${coordinates[0].latitude},${coordinates[0].longitude}`;
        const destination = `${coordinates[coordinates.length - 1].latitude},${coordinates[coordinates.length - 1].longitude}`;
        const waypoints = coordinates
          .slice(1, -1)
          .map((coord) => `${coord.latitude},${coord.longitude}`)
          .join('|');
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=${waypoints}&key=${GOOGLE_MAPS_API_KEY}`;
        const response = await axios.get<DirectionsResponse>(url);
        const data = response.data;

        if (data.status !== 'OK' || !data.routes || data.routes.length === 0) {
          console.error('Directions API error:', data.status, data);
          setRouteCoordinates(coordinates); // Fallback to straight line
          return;
        }

        const route = data.routes[0];
        const polyline = route.overview_polyline.points;
        const decodedCoords = decodePolyline(polyline);
        setRouteCoordinates(decodedCoords);

        const totalDurationSeconds = route.legs.reduce((sum, leg) => sum + leg.duration.value, 0);
        const totalDistanceMeters = route.legs.reduce((sum, leg) => sum + leg.distance.value, 0);
        const hours = (totalDurationSeconds / 3600).toFixed(1);
        const kilometers = (totalDistanceMeters / 1000).toFixed(1);
        setTravelTime(`${hours} hours`);
        setDistance(`${kilometers} km`);
      } catch (error) {
        console.error('Failed to fetch route:', error);
        setRouteCoordinates(coordinates); // Fallback to straight line
      }
    };
    fetchRoute();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeData]);

  // Track current location
  useEffect(() => {
    Geolocation.watchPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => console.log('Geolocation error:', error),
      { enableHighAccuracy: true, distanceFilter: 10 }
    );
  }, []);

  const handlePickupComplete = async (pickupId: string) => {
    const token = await AsyncStorage.getItem('token');
    if (token && currentLocation) {
      const pickup = routeData.pickupPoints.find((p) => p.id === pickupId);
      if (!pickup) {return;}
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        pickup.lat,
        pickup.lng
      );
      if (distance <= 50) {
        const updatedRoute = await updatePickupStatus(routeData.id, pickupId, token);
        navigation.setParams({ route: updatedRoute });
      } else {
        Alert.alert('Too Far', 'You must be within 50 meters to mark this pickup complete.');
      }
    }
  };

  const handleReached = async (destId: string) => {
    const token = await AsyncStorage.getItem('token');
    if (token && currentLocation) {
      const destination = routeData.destinations.find((d) => d.id === destId);
      if (!destination) {return;}
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        destination.lat,
        destination.lng
      );
      if (distance <= 50) {
        const updatedRoute = await markReached(routeData.id, destId, token);
        navigation.setParams({ route: updatedRoute });
        navigation.navigate('DeliveryConfirmation', { routeId: routeData.id, destId });
      } else {
        Alert.alert('Too Far', 'You must be within 50 meters to mark this destination as reached.');
      }
    }
  };

  const region: Region = {
    latitude: coordinates[0].latitude,
    longitude: coordinates[0].longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        zoomEnabled={true} // Enables pinch-to-zoom
        zoomControlEnabled={true} // Optional: Shows zoom buttons on Android
      >
        <Polyline coordinates={routeCoordinates} strokeColor="#007AFF" strokeWidth={3} />
        {coordinates.map((coord, index) => (
          <Marker key={index} coordinate={coord} pinColor="red" />
        ))}
        {currentLocation && (
          <Marker coordinate={currentLocation} pinColor="blue" title="You are here" />
        )}
      </MapView>
      <Text style={styles.travelInfo}>
        Travel Time: {travelTime || 'Calculating...'} | Distance: {distance || 'Calculating...'}
      </Text>
      <Text style={styles.title}>Route Details</Text>
      <Text style={styles.subtitle}>Pickup Points</Text>
      <FlatList
        data={routeData.pickupPoints}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.address} - {item.status}</Text>
            {item.status === 'pending' && (
              <Button
                title="Mark Complete"
                onPress={() => handlePickupComplete(item.id)}
                disabled={!currentLocation}
              />
            )}
          </View>
        )}
      />
      <Text style={styles.subtitle}>Destinations</Text>
      <FlatList
        data={routeData.destinations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.address} - {item.status}</Text>
            {item.status === 'unlocked' && (
              <Button
                title="Mark Reached"
                onPress={() => handleReached(item.id)}
                disabled={!currentLocation}
              />
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  map: {
    height: 300,
  },
  travelInfo: {
    fontSize: 16,
    margin: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    marginHorizontal: 16,
  },
});
