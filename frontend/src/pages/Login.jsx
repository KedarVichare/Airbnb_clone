import { useState } from "react";
import { login } from "../services/AuthService"; 
import { useNavigate } from "react-router-dom";

export default function Login({setIsLoggedIn}) {
  const [role, setRole] = useState("traveler");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { role, ...formData };

    try {
      console.log("LOGIN payload →", payload);
      const res = await login(role, payload);
      console.log("Login success:", res.data);

      setIsLoggedIn(true);  
      navigate("/home");    
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-500 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src="/airbnb-logo.png" alt="Airbnb Logo" className="w-16" />
        </div>
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        {/* Role toggle */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => setRole("traveler")}
            className={`px-4 py-2 rounded-lg ${role === "traveler" ? "bg-rose-500 text-white" : "bg-gray-200"}`}
          >
            Traveler
          </button>
          <button
            type="button"
            onClick={() => setRole("owner")}
            className={`px-4 py-2 rounded-lg ${role === "owner" ? "bg-rose-500 text-white" : "bg-gray-200"}`}
          >
            Owner
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="email" type="email" value={formData.email} onChange={onChange} placeholder="Email" className="w-full p-3 border rounded-lg" required />
          <input name="password" type="password" value={formData.password} onChange={onChange} placeholder="Password" className="w-full p-3 border rounded-lg" required />

          {error && <p className="text-red-600 text-center">{error}</p>}

          <button type="submit" className="w-full bg-rose-500 text-white py-3 rounded-lg">Login</button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <a href={`/signup?role=${role}`} className="text-rose-500 font-semibold hover:underline">
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}

