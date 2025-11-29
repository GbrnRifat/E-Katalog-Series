import axios from "axios";

// BASE URL dari .env
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log("[API] Base URL:", BASE_URL);

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Logging Request
apiClient.interceptors.request.use((config) => {
  console.log("[API Request]", config.method.toUpperCase(), config.url);
  return config;
});

// Logging Response
apiClient.interceptors.response.use(
  (response) => {
    console.log("[API Response]", response.data);
    return response;
  },
  (error) => {
    console.error("[API Error]", error);
    return Promise.reject(error);
  }
);

export default apiClient;
