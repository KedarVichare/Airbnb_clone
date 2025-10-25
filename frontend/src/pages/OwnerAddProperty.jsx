import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function OwnerAddProperty() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    amenities: "",
    bedrooms: "",
    bathrooms: "",
    available_from: "",
    available_to: "",
    photo_url: "",
  });
  const [msg, setMsg] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await axios.post("http://localhost:5000/api/properties/owner", form, {
        withCredentials: true,
      });
      setMsg(`✅ ${res.data.message}`);
      setForm({
        title: "", description: "", location: "", price: "",
        amenities: "", bedrooms: "", bathrooms: "",
        available_from: "", available_to: "", photo_url: "",
      });
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.message || "Error");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Post a New Property</h2>
        {msg && <p className="mb-3 text-rose-600">{msg}</p>}
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3">
          <input className="border p-2 rounded" placeholder="Title" name="title" value={form.title} onChange={onChange} required/>
          <textarea className="border p-2 rounded" placeholder="Description" name="description" value={form.description} onChange={onChange}/>
          <input className="border p-2 rounded" placeholder="Location" name="location" value={form.location} onChange={onChange} required/>
          <input className="border p-2 rounded" placeholder="Price" name="price" value={form.price} onChange={onChange} required/>
          <input className="border p-2 rounded" placeholder="Amenities (comma separated)" name="amenities" value={form.amenities} onChange={onChange}/>
          <div className="grid grid-cols-2 gap-3">
            <input className="border p-2 rounded" placeholder="Bedrooms" name="bedrooms" value={form.bedrooms} onChange={onChange}/>
            <input className="border p-2 rounded" placeholder="Bathrooms" name="bathrooms" value={form.bathrooms} onChange={onChange}/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input className="border p-2 rounded" type="date" name="available_from" value={form.available_from} onChange={onChange}/>
            <input className="border p-2 rounded" type="date" name="available_to" value={form.available_to} onChange={onChange}/>
          </div>
          <input className="border p-2 rounded" placeholder="Photo URL" name="photo_url" value={form.photo_url} onChange={onChange}/>
          <button className="bg-rose-500 text-white px-4 py-2 rounded">Create</button>
        </form>
      </div>
    </div>
  );
}
