import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-500">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md text-center">
        {/* Logo (optional) */}
        <div className="flex justify-center mb-6">
          <img src="/airbnb-logo.png" alt="Airbnb Logo" className="w-16" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Airbnb Clone
        </h1>
        <p className="text-gray-600 mb-8">Find your next stay, anywhere.</p>

        <button
          onClick={() => navigate("/login")}
          className="w-full bg-rose-500 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-rose-600 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
