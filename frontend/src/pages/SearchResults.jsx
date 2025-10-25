import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import PropertyCard from "../components/PropertyCard";

export default function SearchResults() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const location = useLocation();

  // Extract query params
  const params = new URLSearchParams(location.search);
  const searchLocation = params.get("location") || "";
  const guests = params.get("guests") || "";
  const dates = params.get("dates") || "";

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        if (!searchLocation) {
          setError("Please enter a location to search.");
          setLoading(false);
          return;
        }

        // ✅ Call your backend API
        const res = await axios.get("http://localhost:5000/api/properties/search", {
          params: { location: searchLocation, guests },
          withCredentials: true,
        });

        setProperties(res.data);
        setError("");
      } catch (err) {
        console.error("Search failed:", err);
        if (err.response?.status === 404) {
          setError("No properties found for this location.");
        } else {
          setError("Server error. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchLocation, guests]);

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          {searchLocation
            ? `Search results for: ${searchLocation}`
            : "All Properties"}
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-gray-500 mt-4">{error}</p>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {properties.map((prop) => (
              <PropertyCard
                key={prop.id}
                id={prop.id}
                title={prop.title}
                location={prop.location}
                price={prop.price}
                photo_url={prop.photo_url}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-4">
            No results found for "{searchLocation}".
          </p>
        )}
      </div>
    </div>
  );
}
