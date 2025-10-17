import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// Pages
import Home from "./pages/Home";
import PropertyDetail from "./pages/PropertyDetail";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Favourites from "./pages/Favourites";
import TravelerHistory from "./pages/TravelerHistory";

function App() {
  // Temporary auth state (can be replaced by JWT/localStorage check)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/home" replace /> : <Login setIsLoggedIn={setIsLoggedIn} />
          }
        />
        <Route
          path="/signup"
          element={
            isLoggedIn ? <Navigate to="/home" replace /> : <Signup />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/home"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={isLoggedIn ? <Profile /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/favourites"
          element={isLoggedIn ? <Favourites /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/history"
          element={isLoggedIn ? <TravelerHistory /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/property/:id"
          element={isLoggedIn ? <PropertyDetail /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
