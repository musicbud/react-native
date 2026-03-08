// musicbud-expo/src/services/apiService.ts
// axios not installed - using RTK Query instead
/*
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
*/
