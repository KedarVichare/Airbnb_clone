import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaGlobe, FaBars, FaHeart, FaSearch } from "react-icons/fa";

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
    <nav className="flex items-center justify-between px-6 py-3 shadow-md bg-rose-500 sticky top-0 z-50">
      {/* Left - Logo */}
      <Link to="/home" className="flex items-center space-x-2">
        <img
          src="/airbnb-logo.png" // Make sure this file is in /public/
          alt="Airbnb Logo"
          className="h-8 w-auto"
        />
        <span className="hidden sm:block font-bold text-lg text-white tracking-tight">
          airbnb
        </span>
      </Link>

      {/* Center - Search bar */}
      <div className="hidden md:flex items-center bg-white rounded-full shadow px-3 py-1 space-x-2 hover:shadow-lg transition">
        <input
          type="text"
          placeholder="Anywhere"
          className="bg-transparent placeholder-gray-500 text-gray-800 outline-none text-sm w-28"
        />
        <span className="text-gray-300">|</span>
        <input
          type="text"
          placeholder="Any week"
          className="bg-transparent placeholder-gray-500 text-gray-800 outline-none text-sm w-24"
        />
        <span className="text-gray-300">|</span>
        <input
          type="number"
          placeholder="Add guests"
          className="bg-transparent placeholder-gray-500 text-gray-800 outline-none text-sm w-20"
        />
        <button className="bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 transition">
          <FaSearch size={12} />
        </button>
      </div>

      {/* Right - Menu & Icons */}
      <div
        className="flex items-center space-x-4 relative text-white"
        ref={menuRef}
      >
        {/* Globe icon */}
        <FaGlobe className="text-lg cursor-pointer hover:scale-110 transition-transform" />

        {/* Heart icon for Favorites */}
        <Link to="/favourites" className="hover:text-pink-300">
          <FaHeart className="text-lg cursor-pointer hover:scale-110 transition-transform" />
        </Link>

        {/* Hamburger Menu */}
        <div
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center bg-white text-gray-600 px-3 py-1 rounded-full space-x-2 cursor-pointer hover:shadow-md transition"
        >
          <FaBars className="text-lg" />
        </div>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute right-0 top-12 w-48 bg-white shadow-lg rounded-md text-gray-700 z-20 animate-fadeIn">
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
