import { useState } from "react";
import { signup } from "../services/AuthService"; 

export default function Signup() {
  const [role, setRole] = useState("traveler"); // traveler | owner
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: ""   // only used if role = owner
  });
  const [error, setError] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload =
      role === "owner"
        ? { role, name: formData.name, email: formData.email, password: formData.password, location: formData.location }
        : { role, name: formData.name, email: formData.email, password: formData.password };

    try {
      // TODO: connect with backend
      console.log("SIGNUP payload →", payload);
      const res = await signup(role, payload);
      console.log("Signup success:", res.data);

      // fake check for demo
      if (formData.email === "test@example.com") {
        throw new Error("Account already exists. Please log in.");
      }
      alert("Signup successful!");
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);
      setError(err.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-rose-500 p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="flex justify-center mb-6">
          <img src="/airbnb-logo.png" alt="Airbnb Logo" className="w-16" />
        </div>
        <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>

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
          <input
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="Name"
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            placeholder="Email"
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={onChange}
            placeholder="Password"
            className="w-full p-3 border rounded-lg"
            required
          />

          {role === "owner" && (
            <input
              name="location"
              value={formData.location}
              onChange={onChange}
              placeholder="Location"
              className="w-full p-3 border rounded-lg"
              required
            />
          )}

          {error && <p className="text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-rose-500 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <a href={`/login?role=${role}`} className="text-rose-500 font-semibold hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
