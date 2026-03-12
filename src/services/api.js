import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ── Interceptor: Thêm token vào header ──
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Interceptor: Xử lý token expired ──
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest.url;

    // ✅ FIX: Không refresh token cho các endpoint auth
    const authEndpoints = ["/auth/login", "/auth/register", "/auth/logout"];
    const isAuthEndpoint = authEndpoints.some((endpoint) =>
      requestUrl.includes(endpoint)
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint // ← Thêm điều kiện này
    ) {
      originalRequest._retry = true;

      try {
        const response = await api.post("/auth/refresh");
        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────
export const authService = {
  register: (data) =>
    api.post("/auth/register", data).then((r) => r.data),

  login: (data) =>
    api.post("/auth/login", data).then((r) => r.data),

  logout: () =>
    api.post("/auth/logout").then((r) => r.data),

  refresh: () =>
    api.post("/auth/refresh").then((r) => r.data),
};

// ── Cars ──────────────────────────────────────────────
export const carService = {
  getAll: (status) =>
    api.get("/cars", { params: status ? { status } : {} }).then((r) => r.data),

  getOne: (carNumber) =>
    api.get(`/cars/${carNumber}`).then((r) => r.data),

  create: (data) =>
    api.post("/cars", data).then((r) => r.data),

  update: (carNumber, data) =>
    api.put(`/cars/${carNumber}`, data).then((r) => r.data),

  delete: (carNumber) =>
    api.delete(`/cars/${carNumber}`).then((r) => r.data),
};

// ── Bookings ──────────────────────────────────────────
export const bookingService = {
  getAll: () =>
    api.get("/bookings").then((r) => r.data),

  getOne: (id) =>
    api.get(`/bookings/${id}`).then((r) => r.data),

  create: (data) =>
    api.post("/bookings", data).then((r) => r.data),

  update: (id, data) =>
    api.put(`/bookings/${id}`, data).then((r) => r.data),

  delete: (id) =>
    api.delete(`/bookings/${id}`).then((r) => r.data),

  pickup: (id) =>
    api.put(`/bookings/${id}/pickup`).then((r) => r.data),
};

export default api;
