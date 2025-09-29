import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import PropertyDetail from "./pages/PropertyDetail";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home/Dashboard */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        {/* Property detail page */}
        <Route path="/property/:id" element={<PropertyDetail />} />

        {/* Profile */}
        <Route path="/profile" element={<Profile />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Travel history (placeholder for now) */}
        <Route
          path="/history"
          element={<div className="p-6">Travel History page coming soon...</div>}
        />
      </Routes>
    </Router>
  );
}

export default App;
