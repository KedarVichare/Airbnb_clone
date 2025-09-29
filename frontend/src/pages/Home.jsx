import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import PropertyCard from "../components/PropertyCard";

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/properties")
      .then((res) => {
        if (res.data.length > 0) {
          setProperties(res.data);
        } else {
          setError("No properties available at the moment.");
        }
      })
      .catch((err) => {
        console.error("Error fetching properties:", err);
        setError("Unable to load properties. Please try again later.");
      });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Explore Homes</h2>

        {error ? (
          <p className="text-center text-red-500 font-medium">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {properties.map((prop) => (
              <PropertyCard key={prop.id} {...prop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
