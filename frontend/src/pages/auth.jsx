import { useState } from "react";

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "IN", name: "India" },
  { code: "UK", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
];

const LANGUAGES = ["English", "Spanish", "French", "Hindi", "Mandarin"];
const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(true);      // true = Sign Up, false = Login
  const [role, setRole] = useState("traveler");        // "traveler" | "owner"

  const [formData, setFormData] = useState({
    // common
    email: "",
    password: "",
    // signup-only
    name: "",
    phone: "",
    city: "",
    country: "",
    language: "",
    gender: "",
    location: "",          // owner signup only
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      // build payload for signup
      const payload =
        role === "owner"
          ? {
              role,
              name: formData.name,
              email: formData.email,
              password: formData.password,
              phone: formData.phone,
              city: formData.city,
              country: formData.country,
              language: formData.language,
              gender: formData.gender,
              location: formData.location, // owner only
            }
          : {
              role,
              name: formData.name,
              email: formData.email,
              password: formData.password,
              phone: formData.phone,
              city: formData.city,
              country: formData.country,
              language: formData.language,
              gender: formData.gender,
            };

      // TODO: POST to your backend:
      //   traveler signup -> POST /api/auth/traveler/signup
      //   owner signup    -> POST /api/auth/owner/signup
      console.log("SIGNUP payload →", payload);
    } else {
      // login payload (email + password only)
      const payload = {
        role,
        email: formData.email,
        password: formData.password,
      };

      // TODO: POST to your backend (session-based with express-session):
      //   traveler login -> POST /api/auth/traveler/login
      //   owner login    -> POST /api/auth/owner/login
      console.log("LOGIN payload →", payload);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <h1 className="text-4xl font-extrabold text-white mb-6">
        Welcome to Airbnb Clone
      </h1>

      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {isSignup ? "Sign Up" : "Login"} as {role === "traveler" ? "Traveler" : "Owner"}
        </h2>

        {/* Role toggle */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRole("traveler")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              role === "traveler" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Traveler
          </button>
          <button
            type="button"
            onClick={() => setRole("owner")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              role === "owner" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Owner
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* SIGNUP-ONLY FIELDS */}
          {isSignup && (
            <>
              <input
                name="name"
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={onChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={onChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={onChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={onChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  name="city"
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={onChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <select
                name="country"
                value={formData.country}
                onChange={onChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="" disabled>Select Country</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  name="language"
                  value={formData.language}
                  onChange={onChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="" disabled>Select Language</option>
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l.toLowerCase()}>{l}</option>
                  ))}
                </select>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={onChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="" disabled>Select Gender</option>
                  {GENDERS.map((g) => (
                    <option key={g} value={g.toLowerCase()}>{g}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* LOGIN FIELDS (email + password only) */}
          {!isSignup && (
            <>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={onChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={onChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        {/* Toggle link */}
        <p className="text-center text-gray-600 mt-6">
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignup((s) => !s)}
            className="text-blue-600 font-semibold hover:underline"
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
