// musicbud-expo/src/services/apiService.ts
import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Requires installation

const API = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL, // Updated with the confirmed development API URL
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach authentication token
API.interceptors.request.use(
  async (config) => {
    // Example: Retrieve token from AsyncStorage
    // const token = await AsyncStorage.getItem('userToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle global API errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: Redirect to login on 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // TODO: Implement unauthorized handling, e.g., navigate to login screen
      console.error('Unauthorized access. Please log in again.');
    }
    // Example: Log other server errors
    if (error.response && error.response.status >= 500) {
      console.error('Server error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default API;
