import { Client, LatLngLiteral } from "@googlemaps/google-maps-services-js"; // Use LatLngLiteral
import logger from "./logger";
import { UnitSystem } from "@googlemaps/google-maps-services-js/dist/common"; // Import UnitSystem

const googleMapsClient = new Client({});

export const getCoordinates = async (address: string): Promise<LatLngLiteral> => {
  try {
    const response = await googleMapsClient.geocode({
      params: {
        address,
        key: process.env.GOOGLE_MAPS_API_KEY as string,
      },
    });
    const location = response.data.results[0]?.geometry.location;
    if (!location) throw new Error("No coordinates found for address");
    return location; // Returns { lat: number, lng: number }
  } catch (error) {
    logger.error("Google Maps geocoding error", { error });
    throw error;
  }
};

export const calculateDistance = async (origin: LatLngLiteral, destination: LatLngLiteral): Promise<number> => {
  try {
    const response = await googleMapsClient.distancematrix({
      params: {
        origins: [`${origin.lat},${origin.lng}`],
        destinations: [`${destination.lat},${destination.lng}`],
        key: process.env.GOOGLE_MAPS_API_KEY as string,
        units: UnitSystem.metric, // Use UnitSystem.metric instead of "metric"
      },
    });
    const distance = response.data.rows[0].elements[0].distance.value; // Distance in meters
    return distance;
  } catch (error) {
    logger.error("Google Maps distance calculation error", { error });
    throw error;
  }
};