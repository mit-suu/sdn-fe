# 🚗 Frontend Authentication Setup Guide

## Overview
Frontend sử dụng JWT token-based authentication với axios interceptors để tự động add token vào requests và refresh token khi hết hạn.

---

## 📁 Files Created

### 1. **LoginPage.jsx**
Trang đăng nhập người dùng
- Form email + password
- Lưu token vào localStorage
- Redirect tới dashboard nếu login thành công

### 2. **RegisterPage.jsx**
Trang đăng ký tài khoản mới
- Form username + email + password + confirm password
- Validation ở client
- Tự động login sau khi đăng ký thành công

### 3. **useAuth.js** (Hook)
Quản lý auth state
```javascript
// Kiểm tra xem user đã login chưa
const { isAuthenticated, user, token } = useAuth();

// Logout
const logout = useLogout();
logout();

// ProtectedRoute component
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>
```

---

## 🔐 Routing Configuration

### Public Routes (không cần auth)
```
/login       → LoginPage
/register    → RegisterPage
```

### Protected Routes (cần auth)
```
/             → Dashboard
/cars         → CarsList
/cars/new     → CarForm (create)
/cars/edit/:carNumber → CarForm (edit)
/bookings     → BookingsList
/bookings/new → BookingForm (create)
/bookings/edit/:bookingId → BookingForm (edit)
```

**Nếu chưa login mà truy cập protected route → Redirect tới /login**

---

## 🔄 API Integration

### 1. **api.js Updates**
Thêm interceptors:
```javascript
// Request interceptor: Thêm token vào header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Refresh token nếu expired
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try refresh token
      const response = await api.post("/auth/refresh");
      const { accessToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      // Retry original request
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);
```

### 2. **Auth Service**
```javascript
// Register
authService.register({ username, email, password })

// Login
authService.login({ email, password })

// Logout
authService.logout()

// Refresh token
authService.refresh()
```

---

## 📱 Component Integration

### Trang được bảo vệ (tất cả các page ngoại trừ login/register)

**Example: CarsList.jsx**
```javascript
import { useAuth } from "../hooks/useAuth";

export default function CarsList() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      {isAuthenticated && (
        <p>Welcome, {user.username}!</p>
      )}
      {/* Rest of component */}
    </div>
  );
}
```

### Layout Component
- Hiển thị user info
- Có nút Logout ở sidebar
- Tự động update khi user login/logout

```javascript
import { useAuth, useLogout } from "../hooks/useAuth";

export default function Layout({ children }) {
  const { user } = useAuth();
  const logout = useLogout();

  return (
    <div>
      {/* Sidebar với user info */}
      <p>Logged in as: {user.username}</p>
      
      {/* Logout button */}
      <button onClick={logout}>
        Logout
      </button>
      {children}
    </div>
  );
}
```

---

## 💾 LocalStorage Management

### Lưu trữ
```javascript
// Login/Register response
localStorage.setItem("accessToken", response.accessToken);
localStorage.setItem("user", JSON.stringify(response.user));
```

### Access
```javascript
const token = localStorage.getItem("accessToken");
const user = JSON.parse(localStorage.getItem("user"));
```

### Clear (Logout)
```javascript
localStorage.removeItem("accessToken");
localStorage.removeItem("user");
```

---

## 🔄 Token Lifecycle

### 1. Login/Register
```
User inputs credentials
    ↓
POST /auth/login (or /auth/register)
    ↓
Response: { accessToken, refreshToken (in httpOnly cookie), user }
    ↓
Save accessToken + user to localStorage
    ↓
Redirect to dashboard
```

### 2. Making Requests
```
axios request
    ↓
Request interceptor adds: Authorization: Bearer {accessToken}
    ↓
Backend receives + validates token
    ↓
Response returned
```

### 3. Token Refresh
```
Backend returns 401 (token expired)
    ↓
Response interceptor detects 401
    ↓
POST /auth/refresh (browser sends refreshToken cookie automatically)
    ↓
Backend validates refreshToken
    ↓
Response: { newAccessToken }
    ↓
Save new token to localStorage
    ↓
Retry original request with new token
```

### 4. Logout
```
Click Logout button
    ↓
Call authService.logout()
    ↓
Backend clears refreshToken
    ↓
Frontend clears localStorage
    ↓
Redirect to /login
```

---

## 🧪 Testing Authentication Flow

### 1. Test Register
```bash
# 1. Go to http://localhost:3000/register
# 2. Fill form:
#    - Username: testuser
#    - Email: test@example.com
#    - Password: password123
#    - Confirm Password: password123
# 3. Click "Đăng Ký"
# 4. Should redirect to dashboard
# 5. Check localStorage in DevTools (F12)
```

### 2. Test Login
```bash
# 1. Clear localStorage: localStorage.clear()
# 2. Go to http://localhost:3000/login
# 3. Fill form:
#    - Email: test@example.com
#    - Password: password123
# 4. Click "Đăng Nhập"
# 5. Should redirect to dashboard
```

### 3. Test Protected Routes
```bash
# 1. Clear localStorage: localStorage.clear()
# 2. Try to access http://localhost:3000/cars
# 3. Should redirect to /login
```

### 4. Test Logout
```bash
# 1. While logged in, click "Đăng Xuất" button
# 2. Should redirect to /login
# 3. Should clear localStorage
```

### 5. Test Token Refresh (Advanced)
```bash
# 1. Login
# 2. Wait 15 minutes (or manually expire token in localStorage)
# 3. Make any request
# 4. Should automatically refresh token
# 5. Network tab shows 401 then retry with new token
```

---

## ⚠️ Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Missing/invalid token | Login again |
| Stuck in login loop | Token invalid but refresh fails | Clear localStorage, login fresh |
| Cannot make requests | Token not in header | Check interceptor is set up |
| Logout redirects to 404 | Wrong logout handler | Check useLogout hook implementation |

---

## 🛡️ Security Best Practices

✅ **Do's:**
- Store sensitive data in httpOnly cookies (backend does this)
- Use localStorage only for accessToken (temporary)
- Clear localStorage on logout
- Validate token expiry and refresh automatically
- Use HTTPS in production

❌ **Don'ts:**
- Store refreshToken in localStorage (too risky)
- Don't send password in requests other than login/register
- Don't expose tokens in URLs
- Don't keep expired tokens beyond refresh window

---

## 📚 API Endpoint Reference

### Auth Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `POST /auth/refresh` - Refresh accessToken

### Protected Endpoints (require Authorization header)
- `POST /api/cars` - Create car
- `PUT /api/cars/:carNumber` - Update car
- `DELETE /api/cars/:carNumber` - Delete car
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking
- `PUT /api/bookings/:id/pickup` - Pickup car

---

## 📝 Environment Variables

`.env` file:
```
REACT_APP_API_URL=http://localhost:3000/api
```

This tells axios where to make requests to.

---

**Last Updated:** March 10, 2026
**Author:** Assistant
