// import Geolocation from '@react-native-community/geolocation';
// import { updateLocation } from '../services/api';

// export const startLocationTracking = async (driverId: string, token: string) => {
//   Geolocation.watchPosition(
//     async (position) => {
//       const { latitude, longitude } = position.coords;
//       await updateLocation(driverId, latitude, longitude, token);
//     },
//     (error) => console.log(error),
//     { enableHighAccuracy: true, distanceFilter: 10, interval: 10 * 60 * 1000 } // Every 10 minutes
//   );
// };

import Geolocation from '@react-native-community/geolocation';
import { updateLocation } from '../services/api';

export const startLocationTracking = async (driverId: string, token: string) => {
  Geolocation.watchPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      await updateLocation(driverId, latitude, longitude, token);
    },
    (error) => console.log(error),
    { enableHighAccuracy: true, distanceFilter: 10, interval: 10 * 60 * 1000 } // Every 10 minutes
  );
};
