import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaGlobe, FaBars, FaHeart } from "react-icons/fa";

export default function DashboardNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-md bg-rose-500">
      {/* Left - Logo */}
      <Link to="/home" className="flex items-center">
        <img
          src="/airbnb-logo-white.png" // put logo in public/
          alt="Airbnb Logo"
          className="h-8"
        />
      </Link>

      {/* Center - Search bar */}
      <div className="hidden md:flex items-center bg-white rounded-full shadow px-4 py-2 space-x-4">
        <input
          type="text"
          placeholder="Location"
          className="bg-transparent placeholder-gray-400 text-gray-800 outline-none text-sm"
        />
        <input
          type="date"
          className="bg-transparent text-gray-800 outline-none text-sm"
        />
        <input
          type="number"
          placeholder="Guests"
          className="bg-transparent placeholder-gray-400 text-gray-800 outline-none text-sm w-16"
        />
        <button className="bg-rose-500 text-white px-4 py-1 rounded-full text-sm hover:bg-rose-600">
          Search
        </button>
      </div>

      {/* Right - Menu */}
      <div className="flex items-center space-x-4 relative text-white" ref={menuRef}>
        {/* Globe icon */}
        <FaGlobe className="text-xl cursor-pointer" />

        {/* Heart icon for Favourites */}
        <Link to="/favourites" className="hover:text-pink-300">
          <FaHeart className="text-xl cursor-pointer transition-transform hover:scale-110" />
        </Link>

        {/* Hamburger menu */}
        <FaBars
          className="text-xl cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        />

        {/* Dropdown menu */}
        {menuOpen && (
          <div className="absolute right-0 mt-12 w-48 bg-white shadow-md rounded-md text-black z-10">
            <ul className="text-sm">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <Link to="/profile">Profile</Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <Link to="/history">Travel History</Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <Link to="/login">Logout</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
