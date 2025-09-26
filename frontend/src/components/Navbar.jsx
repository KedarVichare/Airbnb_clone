import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="p-4 bg-gray-200 flex gap-4">
      <Link to="/">Home</Link>
      <Link to="/traveler/signup">Traveler Signup</Link>
      <Link to="/traveler/login">Traveler Login</Link>
      <Link to="/owner/signup">Owner Signup</Link>
      <Link to="/owner/login">Owner Login</Link>
    </nav>
  );
}
