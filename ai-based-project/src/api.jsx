import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5600/api', // Your backend URL
  withCredentials: true, // For sending cookies
});

// Add request interceptor to include token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;