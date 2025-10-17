import Navbar from "../components/Navbar";

const Favourites = () => {
  const favourites = [
    {
      id: 1,
      name: "Beachfront Villa",
      location: "Malibu, California",
      price: "$250/night",
      image:
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800",
    },
    {
      id: 2,
      name: "Mountain Cabin",
      location: "Aspen, Colorado",
      price: "$180/night",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">My Favourites</h2>

        {favourites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {favourites.map((fav) => (
              <div
                key={fav.id}
                className="border rounded-lg shadow hover:shadow-lg transition duration-200 bg-white"
              >
                <img
                  src={fav.image}
                  alt={fav.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4 space-y-1">
                  <h3 className="font-semibold text-lg">{fav.name}</h3>
                  <p className="text-gray-600 text-sm">{fav.location}</p>
                  <p className="text-rose-500 font-medium">{fav.price}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-6">You have no favourite properties yet.</p>
        )}
      </div>
    </div>
  );
};

export default Favourites;
