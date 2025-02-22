import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const requestLocationPermission = async (): Promise<boolean> => {
  const permission = Platform.OS === 'ios'
    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

  const status = await check(permission);
  if (status === RESULTS.GRANTED) {return true;}

  const result = await request(permission);
  return result === RESULTS.GRANTED;
};

export const requestCameraPermission = async (): Promise<boolean> => {
  const permission = Platform.OS === 'ios'
    ? PERMISSIONS.IOS.CAMERA
    : PERMISSIONS.ANDROID.CAMERA;

  const status = await check(permission);
  if (status === RESULTS.GRANTED) {return true;}

  const result = await request(permission);
  return result === RESULTS.GRANTED;
};
