export interface Driver {
    id: string;
    vehicleNumber: string;
    password: string;
    name: string;
    licenseNumber?: string;
    panNumber?: string;
    aadharNumber?: string;
    vehicleColor?: string;
    vehicleSize?: string;
    vehicleType?: string;
    lat: number;
    lng: number;
  }
  
  export interface Route {
    id: string;
    driverId: string;
    pickupPoints: PickupPoint[];
    destinations: Destination[];
    startTime: Date;
    endTime?: Date;
    metadata?: RouteMetadata;
  }
  
  export interface PickupPoint {
    id: string;
    lat: number;
    lng: number;
    address: string;
    status: "pending" | "completed";
    completedAt?: Date;
  }
  
  export interface Destination {
    id: string;
    lat: number;
    lng: number;
    address: string;
    maxTimeToReach: number;
    status: "locked" | "unlocked" | "reached" | "delivered";
    reachedAt?: Date;
    deliveredAt?: Date;
    waitTime?: number;
    remarks?: string;
  }
  
  export interface DriverLocation {
    id: string;
    driverId: string;
    lat: number;
    lng: number;
    timestamp: Date;
  }
  
  export interface RouteMetadata {
    id: string;
    routeId: string;
    travelTimes: { from: { lat: number; lng: number }; to: { lat: number; lng: number }; timeMinutes: number }[];
    driverName: string;
    vehicleNumber: string;
    vehicleColor?: string;
    vehicleSize?: string;
    vehicleType?: string;
    imagePath: string;
  }