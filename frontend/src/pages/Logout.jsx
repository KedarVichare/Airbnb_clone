// frontend/src/pages/Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        // ✅ Call backend logout to destroy session
        await logout();
      } catch (err) {
        console.error("Logout failed:", err);
      } finally {
        // ✅ Redirect to login page
        navigate("/login");
      }
    };

    logoutUser();
  }, [navigate, logout]);

  return (
    <div className="flex justify-center items-center min-h-screen text-gray-700 text-lg">
      Logging out...
    </div>
  );
}