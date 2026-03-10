# Frontend Endpoints Documentation

Danh sách tất cả các endpoint mà Frontend gọi tới Backend

## Base URL
```
http://localhost:3000
```

---

## Authentication Endpoints

### 1. Register
- **Method**: `POST`
- **Endpoint**: `/auth/register`
- **Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: 
  ```json
  {
    "message": "User registered successfully",
    "user": { ... }
  }
  ```

### 2. Login
- **Method**: `POST`
- **Endpoint**: `/auth/login`
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login successful",
    "user": { ... },
    "accessToken": "jwt_token"
  }
  ```

### 3. Logout
- **Method**: `POST`
- **Endpoint**: `/auth/logout`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Response**:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

### 4. Refresh Token
- **Method**: `POST`
- **Endpoint**: `/auth/refresh`
- **Cookies**: `refreshToken` (httpOnly)
- **Response**:
  ```json
  {
    "message": "Token refreshed",
    "accessToken": "new_jwt_token"
  }
  ```

---

## Cars Endpoints

### 1. Get All Cars
- **Method**: `GET`
- **Endpoint**: `/cars`
- **Query Params**: `status` (optional)
- **Headers**: `Authorization: Bearer {accessToken}`
- **Response**:
  ```json
  {
    "data": [ ... ]
  }
  ```

### 2. Get Single Car
- **Method**: `GET`
- **Endpoint**: `/cars/{carNumber}`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Response**:
  ```json
  {
    "data": { ... }
  }
  ```

### 3. Create Car
- **Method**: `POST`
- **Endpoint**: `/cars`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Body**:
  ```json
  {
    "carNumber": "string",
    "brand": "string",
    "model": "string",
    "year": "number",
    "licensePlate": "string",
    "status": "available|rented|maintenance"
  }
  ```

### 4. Update Car
- **Method**: `PUT`
- **Endpoint**: `/cars/{carNumber}`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Body**: Same as Create Car

### 5. Delete Car
- **Method**: `DELETE`
- **Endpoint**: `/cars/{carNumber}`
- **Headers**: `Authorization: Bearer {accessToken}`

---

## Bookings Endpoints

### 1. Get All Bookings
- **Method**: `GET`
- **Endpoint**: `/bookings`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Response**:
  ```json
  {
    "data": [ ... ]
  }
  ```

### 2. Get Single Booking
- **Method**: `GET`
- **Endpoint**: `/bookings/{id}`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Response**:
  ```json
  {
    "data": { ... }
  }
  ```

### 3. Create Booking
- **Method**: `POST`
- **Endpoint**: `/bookings`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Body**:
  ```json
  {
    "carNumber": "string",
    "startDate": "yyyy-MM-dd",
    "endDate": "yyyy-MM-dd",
    "pickupLocation": "string",
    "returnLocation": "string"
  }
  ```

### 4. Update Booking
- **Method**: `PUT`
- **Endpoint**: `/bookings/{id}`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Body**: Same as Create Booking

### 5. Delete Booking
- **Method**: `DELETE`
- **Endpoint**: `/bookings/{id}`
- **Headers**: `Authorization: Bearer {accessToken}`

### 6. Pickup Booking
- **Method**: `PUT`
- **Endpoint**: `/bookings/{id}/pickup`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Response**:
  ```json
  {
    "message": "Booking picked up successfully",
    "data": { ... }
  }
  ```

---

## Notes

- Tất cả endpoint (except auth/register, auth/login) đều yêu cầu `Authorization: Bearer {accessToken}`
- RefreshToken được gửi qua httpOnly Cookie (tự động gửi bởi axios với `withCredentials: true`)
- Nếu accessToken hết hạn, Frontend sẽ tự động gọi `/auth/refresh` để lấy token mới
