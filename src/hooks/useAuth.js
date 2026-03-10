import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

/**
 * Hook để kiểm tra xem user đã login chưa
 */
export const useAuth = () => {
  const token = localStorage.getItem("accessToken");
  const user = localStorage.getItem("user");

  return {
    isAuthenticated: !!token,
    token,
    user: user ? JSON.parse(user) : null,
  };
};

/**
 * Hook để logout
 */
export const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  return logout;
};

/**
 * Component ProtectedRoute - Redirect không auth user tới login
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : null;
}
