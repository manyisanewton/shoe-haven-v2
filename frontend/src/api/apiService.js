import axios from 'axios';

// The base URL of our Flask backend
const API_URL = 'http://127.0.0.1:5000/api';

const apiService = axios.create({
  baseURL: API_URL,
});

// VERY IMPORTANT: Interceptor to add the JWT token to every request
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // config.headers['Authorization'] = `Bearer ${token}`; // Standard
      config.headers.Authorization = `Bearer ${token}`; // Also correct
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiService;