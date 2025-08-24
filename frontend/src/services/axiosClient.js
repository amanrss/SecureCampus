import axios from "axios";
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 20000,
});
export default instance;
