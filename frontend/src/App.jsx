import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />        {/* Landing page */}
        <Route path="/login" element={<Login />} />  {/* Login */}
        <Route path="/signup" element={<Signup />} />{/* Signup */}
      </Routes>
    </Router>
  );
}

export default App;
