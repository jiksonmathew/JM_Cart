import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
console.log(apiUrl);
const api = axios.create({
  baseURL: `${apiUrl}/api/v1`,
  withCredentials: true,
});

export default api;
