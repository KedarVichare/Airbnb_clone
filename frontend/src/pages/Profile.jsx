import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    about: "",
    city: "",
    state: "",
    country: "",
    languages: "",
    gender: "Other",
    profilePic: null,
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const countries = ["United States", "Canada", "United Kingdom", "India", "Australia"];
  const genders = ["Male", "Female", "Other"];

  // ✅ Load current profile info when component mounts
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/me", { withCredentials: true })
      .then((res) => {
        if (res.data) setProfile(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic" && files && files[0]) {
      setProfile({ ...profile, profilePic: files[0] });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  // ✅ Save profile to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "http://localhost:5000/api/users/update",
        profile,
        { withCredentials: true }
      );
  
      setMessage("Profile updated successfully!");
  
      // ✅ Redirect to home page after 1 second
      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      console.error("Profile update failed:", err);
      setMessage("Error updating profile.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md space-y-4"
          encType="multipart/form-data"
        >
          {/* Profile Pic */}
          <div className="flex flex-col items-center">
            {profile.profilePic ? (
              <img
                src={
                  typeof profile.profilePic === "string"
                    ? profile.profilePic
                    : URL.createObjectURL(profile.profilePic)
                }
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mb-2"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                No Image
              </div>
            )}
            <input
              type="file"
              name="profilePic"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          {/* Name */}
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* About */}
          <div>
            <label className="block font-medium">About Me</label>
            <textarea
              name="about"
              value={profile.about}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* City */}
          <div>
            <label className="block font-medium">City</label>
            <input
              type="text"
              name="city"
              value={profile.city}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* State */}
          <div>
            <label className="block font-medium">State (Abbreviation)</label>
            <input
              type="text"
              name="state"
              maxLength="2"
              placeholder="e.g., CA"
              value={profile.state}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded uppercase"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block font-medium">Country</label>
            <select
              name="country"
              value={profile.country}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Languages */}
          <div>
            <label className="block font-medium">Languages</label>
            <input
              type="text"
              name="languages"
              placeholder="e.g., English, Spanish"
              value={profile.languages}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block font-medium">Gender</label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              {genders.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="bg-rose-500 text-white px-6 py-2 rounded hover:bg-rose-600"
          >
            Save Changes
          </button>

          {message && (
            <p className="text-center text-green-600 mt-3">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
