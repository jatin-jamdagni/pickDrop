# Full Workflow Example

## Register a Driver:
```bash
curl -X POST http://localhost:3000/admin/drivers -H "Content-Type: application/json" -d '{"vehicleNumber": "ABC123", "password": "password123", "name": "John Doe"}'
```

## Login:
```bash
curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"vehicleNumber": "ABC123", "password": "password123"}'
```
Copy the token from the response.

## Create a Route:
```bash
curl -X POST http://localhost:3000/admin/routes -H "Content-Type: application/json" -H "Authorization: Bearer <admin-token>" -d '{"driverId": "uuid-from-login", "pickupPoints": [{"lat": 12.9716, "lng": 77.5946, "address": "Bangalore"}], "destinations": [{"lat": 13.0827, "lng": 80.2707, "address": "Chennai", "maxTimeToReach": 120}], "startTime": "2025-02-21T10:00:00Z"}'
```

## Update Location (repeat every few minutes):
```bash
curl -X POST http://localhost:3000/location/update -H "Authorization: Bearer <driver-token>" -H "Content-Type: application/json" -d '{"driverId": "uuid-from-login", "lat": 12.9716, "lng": 77.5946}'
```

## Mark Pickup Complete:
```bash
curl -X PATCH http://localhost:3000/routes/uuid-from-route/pickup/uuid-from-pickup -H "Authorization: Bearer <driver-token>"
```

## Mark Destination Reached:
```bash
curl -X PATCH http://localhost:3000/routes/uuid-from-route/destination/uuid-from-destination/reach -H "Authorization: Bearer <driver-token>"
```

## Mark Destination Delivered (generates image/metadata):
```bash
curl -X PATCH http://localhost:3000/routes/uuid-from-route/destination/uuid-from-destination/deliver -H "Authorization: Bearer <driver-token>" -H "Content-Type: application/json" -d '{"remarks": "Delivered on time"}'
```