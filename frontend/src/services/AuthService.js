// frontend/src/services/AuthService.js
import axios from "axios";

const AUTH_API_URL = "http://localhost:5000/api/auth";

class AuthService {
  async login(role, payload) {
    return axios.post(`${AUTH_API_URL}/${role}/login`, payload, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // ✅ important for sessions
    });
  }

  async signup(role, payload) {
    return axios.post(`${AUTH_API_URL}/${role}/signup`, payload, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // ✅ include cookies for registration if needed
    });
  }

  async logout() {
    return axios.post(`${AUTH_API_URL}/logout`, {}, { withCredentials: true });
  }

  async checkSession() {
    return axios.get(`${AUTH_API_URL}/check-session`, { withCredentials: true });
  }
}

export default new AuthService();
