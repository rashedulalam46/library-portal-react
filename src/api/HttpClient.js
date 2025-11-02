import axios from "axios";

const HttpClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5255/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor example
HttpClient.interceptors.response.use(
  response => response,
  error => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default HttpClient;