import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth, ProtectedRoute } from "./hooks/useAuth";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CarsList from "./pages/CarsList";
import CarForm from "./pages/CarForm";
import BookingsList from "./pages/BookingsList";
import BookingForm from "./pages/BookingForm";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#27272a",
            color: "#f4f4f5",
            border: "1px solid #3f3f46",
            fontFamily: "'Poppins', sans-serif",
            fontSize: "13px",
          },
          success: { iconTheme: { primary: "#f97316", secondary: "#fff" } },
        }}
      />
      <Routes>
        {/* Auth Routes */}
        <Route
          path="/auth/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/auth/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />}
        />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/cars" element={<CarsList />} />
                  <Route path="/cars/new" element={<CarForm />} />
                  <Route path="/cars/edit/:carNumber" element={<CarForm />} />
                  <Route path="/bookings" element={<BookingsList />} />
                  <Route path="/bookings/new" element={<BookingForm />} />
                  <Route path="/bookings/edit/:bookingId" element={<BookingForm />} />
                  {/* 404 */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
