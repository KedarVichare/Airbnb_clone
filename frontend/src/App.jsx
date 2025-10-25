import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Favourites from "./pages/Favourites";
import TravelerHistory from "./pages/TravelerHistory";
import PropertyDetail from "./pages/PropertyDetail";
import SearchResults from "./pages/SearchResults";
import OwnerAddProperty from "./pages/OwnerAddProperty";
import OwnerMyProperties from "./pages/OwnerMyProperties";
import OwnerBookings from "./pages/OwnerBookings";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Check session on mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/check-session", { withCredentials: true })
      .then((res) => {
        setIsLoggedIn(res.data.isLoggedIn);
        setRole(res.data.role || localStorage.getItem("role")); // store user role
      })
      .catch(() => {
        setIsLoggedIn(false);
        setRole(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  // ✅ Protect Owner-only routes
  const OwnerRoute = ({ element }) => {
    if (!isLoggedIn) return <Navigate to="/login" />;
    if (role !== "owner") return <Navigate to="/home" />;
    return element;
  };

  // ✅ Protect Traveler-only routes
  const TravelerRoute = ({ element }) => {
    if (!isLoggedIn) return <Navigate to="/login" />;
    if (role !== "traveler") return <Navigate to="/home" />;
    return element;
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/home" /> : <Login onLogin={() => setIsLoggedIn(true)} />
          }
        />
        <Route
          path="/signup"
          element={isLoggedIn ? <Navigate to="/home" /> : <Signup />}
        />

        {/* Traveler routes */}
        <Route
          path="/"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/home"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={TravelerRoute({ element: <Profile /> })}
        />
        <Route
          path="/favourites"
          element={TravelerRoute({ element: <Favourites /> })}
        />
        <Route
          path="/history"
          element={TravelerRoute({ element: <TravelerHistory /> })}
        />
        <Route
          path="/property/:id"
          element={TravelerRoute({ element: <PropertyDetail /> })}
        />
        <Route path="/search" element={<SearchResults />} />

        {/* Owner routes */}
        <Route
          path="/owner/properties"
          element={OwnerRoute({ element: <OwnerMyProperties /> })}
        />
        <Route
          path="/owner/properties/new"
          element={OwnerRoute({ element: <OwnerAddProperty /> })}
        />
        <Route
          path="/owner/bookings"
          element={OwnerRoute({ element: <OwnerBookings /> })}
        />

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

export default App;
