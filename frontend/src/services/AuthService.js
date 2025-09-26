// src/services/authService.js
import axios from "axios";

// create a pre-configured axios instance
const API = axios.create({
  baseURL: "http://localhost:8000/api/auth", // your backend URL
  withCredentials: true, // if you are using cookies/sessions
});

// Traveler or Owner signup
export const signup = (role, data) => API.post(`/${role}/signup`, data);

// Traveler or Owner login
export const login = (role, data) => API.post(`/${role}/login`, data);
