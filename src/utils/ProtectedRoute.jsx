import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function ProtectedRoute({ children, adminOnly = false }) {

  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // 🔐 Auth check
    if (token || location.state?.authFromGoogle) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    // 👑 Admin check
    if (user.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }

    setIsChecking(false);

  }, [location]);

  // ⏳ Loading state
  if (isChecking) {
    return null;
  }

  // ❌ Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // ❌ Not admin but admin route
  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Allow access
  return children;
}

export default ProtectedRoute;