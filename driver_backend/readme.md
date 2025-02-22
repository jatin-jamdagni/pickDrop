# API Documentation with cURL Commands

## Base URL
All endpoints are relative to: `http://localhost:3000`

## Authentication
Most endpoints require a JWT token obtained from the `/auth/login` endpoint.
Use the token in the `Authorization` header as `Bearer <token>`.

### 1. Login Driver
**Endpoint:** `POST /auth/login`

**Description:** Authenticates a driver using their vehicle number and password, returning a JWT token.

**Request Body:**
- `vehicleNumber` (string, required): Unique vehicle number of the driver.
- `password` (string, required): Driver's password.

**Response:**
- `200 OK`: `{ "token": string, "driverId": string }`
- `400 Bad Request`: `{ "message": string }` (e.g., "Invalid credentials")
- `500 Internal Server Error`: `{ "message": "Server error" }`

**cURL Command:**
```sh
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{
    "vehicleNumber": "ABC123",
    "password": "ABC123"
}'
```
### Example Response:

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "driverId": "12345"
}
```

### 2. Register Driver (Admin Portal)
**Endpoint:** `POST /admin/drivers`

**Description:** Registers a new driver with detailed information (admin-only).

**Request Body:**
- `vehicleNumber` (string, required): Unique vehicle number.
- `password` (string, required): Driver's password.
- `name` (string, required): Driver's name.
- `licenseNumber` (string, optional): Driver's license number.
- `panNumber` (string, optional): Driver's PAN number.
- `aadharNumber` (string, optional): Driver's Aadhar number.
- `vehicleColor` (string, optional): Vehicle color.
- `vehicleSize` (string, optional): Vehicle size (e.g., "Medium").
- `vehicleType` (string, optional): Vehicle type (e.g., "Truck").

**Response:**
- `201 Created`: `{ "message": "Driver registered", "driverId": string }`
- `400 Bad Request`: `{ "message": "Driver already exists" }`
- `500 Internal Server Error`: `{ "message": "Server error" }`

**cURL Command:**
```sh
curl -X POST http://localhost:3000/admin/drivers \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <admin-token>" \
-d '{
    "vehicleNumber": "ABC123",
    "password": "password123",
    "name": "John Doe",
    "licenseNumber": "LIC123456",
    "panNumber": "ABCDE1234F",
    "aadharNumber": "123456789012",
    "vehicleColor": "Blue",
    "vehicleSize": "Medium",
    "vehicleType": "Truck"
}'
```
### Example Response:

```json
{
    "message": "Driver registered",
    "driverId": "uuid-of-driver"
}
```

> **Note:** Replace `<admin-token>` with a valid admin JWT if adminMiddleware is fully implemented.

### 3. Create Route (Admin Portal)
**Endpoint:** `POST /admin/routes`

**Description:** Creates a predefined route for a driver with pickup points and destinations.

**Request Body:**
- `driverId` (string, required): UUID of the driver.
- `pickupPoints` (array, required): List of pickup points with `lat`, `lng`, and `address`.
- `destinations` (array, required): List of destinations with `lat`, `lng`, `address`, and `maxTimeToReach`.
- `startTime` (string, required): ISO 8601 timestamp (e.g., "2025-02-21T10:00:00Z").

**Response:**
- `201 Created`: `{ "message": "Route created", "routeId": string }`
- `404 Not Found`: `{ "message": "Driver not found" }`
- `500 Internal Server Error`: `{ "message": "Server error" }`

**cURL Command:**
```sh
curl -X POST http://localhost:3000/admin/routes \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <admin-token>" \
-d '{
    "driverId": "uuid-of-driver",
    "pickupPoints": [
        {"lat": 12.9716, "lng": 77.5946, "address": "Bangalore Pickup"}
    ],
    "destinations": [
        {"lat": 13.0827, "lng": 80.2707, "address": "Chennai", "maxTimeToReach": 120}
    ],
    "startTime": "2025-02-21T10:00:00Z"
}'
```
### Example Response:

```json
{
    "message": "Route created",
    "routeId": "uuid-of-route"
}
```

### 4. Get Driver Route
**Endpoint:** `GET /routes/:driverId`

**Description:** Retrieves the assigned route for a driver, including pickup points, destinations, and metadata.

**Path Parameters:**
- `driverId` (string, required): UUID of the driver.

**Response:**
- `200 OK`: Route object with `pickupPoints`, `destinations`, and metadata.
- `404 Not Found`: `{ "message": "Route not found" }`
- `500 Internal Server Error`: `{ "message": "Server error" }`

**cURL Command:**
```sh
curl -X GET http://localhost:3000/routes/uuid-of-driver \
-H "Authorization: Bearer <driver-token>"
```
### Example Response:

```json
{
    "id": "uuid-of-route",
    "driverId": "uuid-of-driver",
    "pickupPoints": [
        {"id": "uuid", "lat": 12.9716, "lng": 77.5946, "address": "Bangalore Pickup", "status": "pending"}
    ],
    "destinations": [
        {
            "id": "uuid",
            "lat": 13.0827,
            "lng": 80.2707,
            "address": "Chennai",
            "maxTimeToReach": 120,
            "status": "locked"
        }
    ],
    "startTime": "2025-02-21T10:00:00Z",
    "endTime": null,
    "metadata": null
}
```

### 5. Update Driver Location
**Endpoint:** `POST /location/update`

**Description:** Updates the driver's current location and saves it periodically (every 10 minutes) in the DriverLocation table.

**Request Body:**
- `driverId` (string, required): UUID of the driver.
- `lat` (number, required): Latitude.
- `lng` (number, required): Longitude.

**Response:**
- `200 OK`: `{ "message": "Location updated" }`
- `404 Not Found`: `{ "message": "Driver not found" }`
- `500 Internal Server Error`: `{ "message": "Server error" }`

**cURL Command:**
```sh
curl -X POST http://localhost:3000/location/update \
-H "Authorization: Bearer <driver-token>" \
-H "Content-Type: application/json" \
-d '{
    "driverId": "uuid-of-driver",
    "lat": 12.9716,
    "lng": 77.5946
}'
```
### Example Response:

```json
{
    "message": "Location updated"
}
```

> **Note:** The frontend should call this every few seconds/minutes, and the backend saves it every 10 minutes based on the timestamp check.

### 6. Mark Pickup Complete
**Endpoint:** `PATCH /routes/:routeId/pickup/:pickupId`

**Description:** Marks a pickup point as completed, unlocking the first destination if all pickups are done.

**Path Parameters:**
- `routeId` (string, required): UUID of the route.
- `pickupId` (string, required): UUID of the pickup point.

**Response:**
- `200 OK`: Updated route object.
- `404 Not Found`: `{ "message": "Route not found" }` or `{ "message": "Pickup not found" }`
- `500 Internal Server Error`: `{ "message": "Server error" }`

**cURL Command:**
```sh
curl -X PATCH http://localhost:3000/routes/uuid-of-route/pickup/uuid-of-pickup \
-H "Authorization: Bearer <driver-token>"
```
### Example Response:

```json
{
    "id": "uuid-of-route",
    "driverId": "uuid-of-driver",
    "pickupPoints": [
        {
            "id": "uuid",
            "lat": 12.9716,
            "lng": 77.5946,
            "address": "Bangalore Pickup",
            "status": "completed",
            "completedAt": "2025-02-21T10:05:00Z"
        }
    ],
    "destinations": [
        {
            "id": "uuid",
            "lat": 13.0827,
            "lng": 80.2707,
            "address": "Chennai",
            "maxTimeToReach": 120,
            "status": "unlocked"
        }
    ],
    "startTime": "2025-02-21T10:00:00Z",
    "endTime": null
}
```

### 7. Mark Destination Reached
**Endpoint:** `PATCH /routes/:routeId/destination/:destId/reach`

**Description:** Marks a destination as reached by the driver.

**Path Parameters:**
- `routeId` (string, required): UUID of the route.
- `destId` (string, required): UUID of the destination.

**Response:**
- `200 OK`: Updated route object.
- `400 Bad Request`: `{ "message": "Invalid destination or not unlocked" }`
- `404 Not Found`: `{ "message": "Route not found" }`
- `500 Internal Server Error`: `{ "message": "Server error" }`

**cURL Command:**
```sh
curl -X PATCH http://localhost:3000/routes/uuid-of-route/destination/uuid-of-destination/reach \
-H "Authorization: Bearer <driver-token>"
```
### Example Response:

```json
{
    "id": "uuid-of-route",
    "driverId": "uuid-of-driver",
    "pickupPoints": [...],
    "destinations": [
        {
            "id": "uuid",
            "lat": 13.0827,
            "lng": 80.2707,
            "address": "Chennai",
            "maxTimeToReach": 120,
            "status": "reached",
            "reachedAt": "2025-02-21T12:00:00Z"
        }
    ],
    "startTime": "2025-02-21T10:00:00Z",
    "endTime": null
}
```

### 8. Mark Destination Delivered
**Endpoint:** `PATCH /routes/:routeId/destination/:destId/deliver`

**Description:** Marks a destination as delivered, generating a route map image and metadata when the last destination is completed.

**Path Parameters:**
- `routeId` (string, required): UUID of the route.
- `destId` (string, required): UUID of the destination.

**Request Body:**
- `remarks` (string, optional): Remarks about the delivery.

**Response:**
- `200 OK`: Updated route object with metadata if last destination.
- `400 Bad Request`: `{ "message": "Invalid destination or not reached" }`
- `404 Not Found`: `{ "message": "Route not found" }`
- `500 Internal Server Error`: `{ "message": "Server error" }`

**cURL Command:**
```sh
curl -X PATCH http://localhost:3000/routes/uuid-of-route/destination/uuid-of-destination/deliver \
-H "Authorization: Bearer <driver-token>" \
-H "Content-Type: application/json" \
-d '{"remarks": "Delivered on time"}'
```
### Example Response (if last destination):

```json
{
    "id": "uuid-of-route",
    "driverId": "uuid-of-driver",
    "pickupPoints": [...],
    "destinations": [
        {
            "id": "uuid",
            "lat": 13.0827,
            "lng": 80.2707,
            "address": "Chennai",
            "maxTimeToReach": 120,
            "status": "delivered",
            "reachedAt": "2025-02-21T12:00:00Z",
            "deliveredAt": "2025-02-21T12:05:00Z",
            "remarks": "Delivered on time"
        }
    ],
    "startTime": "2025-02-21T10:00:00Z",
    "endTime": "2025-02-21T12:05:00Z",
    "metadata": {
        "id": "uuid-of-metadata",
        "routeId": "uuid-of-route",
        "travelTimes": [
            {
                "from": {"lat": 12.9716, "lng": 77.5946},
                "to": {"lat": 13.0827, "lng": 80.2707},
                "timeMinutes": 110
            }
        ],
        "driverName": "John Doe",
        "vehicleNumber": "ABC123",
        "vehicleColor": "Blue",
        "vehicleSize": "Medium",
        "vehicleType": "Truck",
        "imagePath": "./src/images/uuid-of-route.png"
    }
}
```

***Note*** 
- `Tokens`  Replace <driver-token> with the JWT from /auth/login and <admin-token> with an admin JWT (if implemented).
Route Map Image: After marking the last destination as delivered, check the src/images directory for the generated PNG (e.g., uuid-of-route.png).
- `OpenStreetMap` The image uses OSM Static API (https://static-maps.openstreetmap.de/staticmap). Ensure internet access for this to work.
- `Error Handling` Responses include meaningful error messages for debugging.

