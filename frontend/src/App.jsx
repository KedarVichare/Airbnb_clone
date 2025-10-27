// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerMyProperties from "./pages/OwnerMyProperties";
import OwnerAddProperty from "./pages/OwnerAddProperty";
import OwnerBookings from "./pages/OwnerBookings";
import PropertyDetail from "./pages/PropertyDetail";
import Favourites from "./pages/Favourites";
import Profile from "./pages/Profile";
import TravelerHistory from "./pages/TravelerHistory";
import SearchResults from "./pages/SearchResults";

function AppRoutes() {
  const { isLoggedIn, role, loading } = useAuth();

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-lg">
        Checking session...
      </div>
    );

  // ✅ General protected route
  const ProtectedRoute = ({ element }) => {
    if (!isLoggedIn) return <Navigate to="/login" replace />;
    return element;
  };

  // ✅ Traveler-only route
  const TravelerRoute = ({ element }) => {
    if (!isLoggedIn) return <Navigate to="/login" replace />;
    if (role !== "traveler") return <Navigate to="/owner/dashboard" replace />;
    return element;
  };

  // ✅ Owner-only route
  const OwnerRoute = ({ element }) => {
    if (!isLoggedIn) return <Navigate to="/login" replace />;
    if (role !== "owner") return <Navigate to="/home" replace />;
    return element;
  };

  return (
    <Routes>
      {/* Public */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />

      {/* Traveler */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={TravelerRoute({ element: <Home /> })} />
      <Route path="/search" element={TravelerRoute({ element: <SearchResults /> })} />
      <Route path="/property/:id" element={TravelerRoute({ element: <PropertyDetail /> })} />
      <Route path="/favourites" element={TravelerRoute({ element: <Favourites /> })} />
      <Route path="/profile" element={TravelerRoute({ element: <Profile /> })} />
      <Route path="/history" element={TravelerRoute({ element: <TravelerHistory /> })} />

      {/* Owner */}
      <Route path="/owner/dashboard" element={OwnerRoute({ element: <OwnerDashboard /> })} />
      <Route path="/owner/properties" element={OwnerRoute({ element: <OwnerMyProperties /> })} />
      <Route path="/owner/properties/new" element={OwnerRoute({ element: <OwnerAddProperty /> })} />
      <Route path="/owner/bookings" element={OwnerRoute({ element: <OwnerBookings /> })} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
