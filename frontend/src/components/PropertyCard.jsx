import { Link } from "react-router-dom";

const PropertyCard = ({ id, photo_url, title, location, price }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer">
      {photo_url ? (
        <img
          src={photo_url}
          alt={title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-500">
          No Image Available
        </div>
      )}

      <div className="p-3">
        <h3 className="font-semibold text-md text-gray-800">{title}</h3>
        <p className="text-gray-500 text-sm">{location}</p>
        <p className="text-rose-600 font-bold mt-1">${price} / night</p>
        <Link
          to={`/property/${id}`}
          className="inline-block mt-2 text-sm text-white bg-rose-500 px-3 py-1 rounded-lg hover:bg-rose-600"
        >
          View
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
