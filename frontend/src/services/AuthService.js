import axios from "axios";

const AUTH_API_URL = "http://localhost:5000/api/auth";

class AuthService {
  async login(role, payload) {
    return axios.post(`${AUTH_API_URL}/${role}/login`, payload, {
      headers: { "Content-Type": "application/json" },
    });
  }

  async signup(role, payload) {
    return axios.post(`${AUTH_API_URL}/${role}/signup`, payload, {
      headers: { "Content-Type": "application/json" },
    });
  }
}

export default new AuthService();
