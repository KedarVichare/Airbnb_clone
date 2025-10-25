import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch user's favourites from backend
  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/favourites/my-favourites",
          { withCredentials: true }
        );
        setFavourites(res.data || []);
      } catch (err) {
        console.error("Error fetching favourites:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavourites();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">My Favourites</h2>

        {loading ? (
          <p className="text-gray-500">Loading your favourites...</p>
        ) : favourites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {favourites.map((fav) => (
              <div
                key={fav.id}
                className="border rounded-lg shadow hover:shadow-lg transition duration-200 bg-white"
              >
                <img
                  src={fav.photo_url || "/placeholder.jpg"}
                  alt={fav.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4 space-y-1">
                  <h3 className="font-semibold text-lg">{fav.title}</h3>
                  <p className="text-gray-600 text-sm">{fav.location}</p>
                  <p className="text-rose-500 font-medium">
                    ${fav.price} / night
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-6">
            You have no favourite properties yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Favourites;
