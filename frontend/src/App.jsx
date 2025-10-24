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
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/home" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
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
          element={isLoggedIn ? <Home onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/home"
          element={isLoggedIn ? <Home onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={isLoggedIn ? <Profile onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/favourites"
          element={isLoggedIn ? <Favourites onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/history"
          element={isLoggedIn ? <TravelerHistory onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/property/:id"
          element={isLoggedIn ? <PropertyDetail onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
