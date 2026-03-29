import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const submitContactInquiry = (payload) => api.post("/contact", payload);

export default api;
