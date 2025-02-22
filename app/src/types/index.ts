export interface Driver {
    id: string;
    vehicleNumber: string;
    name: string;
}

export interface PickupPoint {
    id: string;
    lat: number;
    lng: number;
    address: string;
    status: 'pending' | 'completed';
}

export interface Destination {
    id: string;
    lat: number;
    lng: number;
    address: string;
    maxTimeToReach: number;
    status: 'locked' | 'unlocked' | 'reached' | 'delivered';
}

export interface Route {
    id: string;
    driverId: string;
    pickupPoints: PickupPoint[];
    destinations: Destination[];
    startTime: string;
}
