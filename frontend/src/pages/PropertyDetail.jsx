import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/properties/${id}`)
      .then((res) => {
        if (res.data) {
          setProperty(res.data);
        } else {
          setError("Property not found.");
        }
      })
      .catch((err) => {
        console.error("Error fetching property:", err);
        setError("Unable to load property details. Please try again later.");
      });
  }, [id]);

  if (error) {
    return (
      <div>
        <Navbar />
        <p className="text-center text-red-500 font-medium mt-10">{error}</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div>
        <Navbar />
        <p className="text-center text-gray-600 mt-10">Loading property...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        {property.photo_url ? (
          <img
            src={property.photo_url}
            alt={property.title}
            className="w-full h-80 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-80 flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg">
            No Image Available
          </div>
        )}

        <h2 className="text-3xl font-bold mt-4">{property.title}</h2>
        <p className="text-gray-600">{property.location}</p>
        <p className="mt-2">{property.description}</p>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <p><strong>Type:</strong> {property.type}</p>
          <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
          <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
          <p><strong>Price:</strong> ${property.price} / night</p>
          <p><strong>Available:</strong> {property.available_from} → {property.available_to}</p>
        </div>

        {property.amenities && (
          <div className="mt-4">
            <strong>Amenities:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {property.amenities.split(",").map((a, idx) => (
                <span
                  key={idx}
                  className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full"
                >
                  {a.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        <button className="mt-6 bg-rose-500 text-white px-6 py-2 rounded hover:bg-rose-600">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default PropertyDetail;
