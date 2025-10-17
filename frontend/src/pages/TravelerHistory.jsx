import Navbar from "../components/Navbar";

const TravelerHistory = () => {
  // Example trip history data
  const history = [
    {
      id: 1,
      property: "Ocean View Apartment",
      location: "Miami, Florida",
      date: "June 12 - June 15, 2024",
      price: "$600 total",
      image:
        "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=800",
    },
    {
      id: 2,
      property: "Cozy Cottage",
      location: "Napa Valley, California",
      date: "August 20 - August 23, 2024",
      price: "$450 total",
      image:
        "https://images.unsplash.com/photo-1572120360610-d971b9c79809?w=800",
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Traveler History</h2>

        {history.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {history.map((trip) => (
              <div
                key={trip.id}
                className="border rounded-lg shadow hover:shadow-lg transition duration-200 bg-white"
              >
                <img
                  src={trip.image}
                  alt={trip.property}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4 space-y-1">
                  <h3 className="font-semibold text-lg">{trip.property}</h3>
                  <p className="text-gray-600 text-sm">{trip.location}</p>
                  <p className="text-gray-500 text-sm">{trip.date}</p>
                  <p className="text-rose-500 font-medium">{trip.price}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-6">
            You haven’t booked any trips yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default TravelerHistory;
