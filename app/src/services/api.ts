import axios from 'axios';
import { Route } from '../types';

const BASE_URL = 'https://lhv6ppbd-2345.inc1.devtunnels.ms'; // Adjust to your backend URL

export const loginDriver = async (vehicleNumber: string, password: string) => {
    const response = await axios.post(`${BASE_URL}/auth/login`, { vehicleNumber, password });
    return response.data;
};

export const getRoute = async (driverId: string, token: string): Promise<Route> => {
    const response = await axios.get(`${BASE_URL}/routes/${driverId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    console.log('these are routes', response);
    return response.data;
};

export const updatePickupStatus = async (routeId: string, pickupId: string, token: string) => {
    const response = await axios.patch(
        `${BASE_URL}/routes/${routeId}/pickup/${pickupId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const markReached = async (routeId: string, destId: string, token: string) => {
    const response = await axios.patch(
        `${BASE_URL}/routes/${routeId}/destination/${destId}/reach`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const markDelivered = async (routeId: string, destId: string, remarks: string, token: string) => {
    const response = await axios.patch(
        `${BASE_URL}/routes/${routeId}/destination/${destId}/deliver`,
        { remarks },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const updateLocation = async (driverId: string, lat: number, lng: number, token: string) => {
    const response = await axios.post(
        `${BASE_URL}/location/update`,
        { driverId, lat, lng },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};
