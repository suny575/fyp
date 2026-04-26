import axios from "axios";

const rawApiBaseUrl =
  process.env.REACT_APP_API_BASE_URL || "https://fyp-dle0.onrender.com";

export const API_BASE_URL = rawApiBaseUrl
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

export const API_URL = `${API_BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
});

export const submitContactInquiry = (payload) => api.post("/contact", payload);

export default api;

