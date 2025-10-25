import Navbar from "../components/Navbar";

export default function OwnerBookings() {
  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Owner Bookings</h2>
        <p>This page will show all incoming booking requests.</p>
      </div>
    </div>
  );
}
