import axios from 'axios';

// 🔥 Use relative URL so Nginx proxy works
const API_URL = process.env.REACT_APP_API_URL || '/api';

console.log('API Base URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// ✅ Attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`[API] ${config.method.toUpperCase()} ${config.url}`, { token: !!token });
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle unauthorized globally
api.interceptors.response.use(
  (response) => {
    console.log(`[API RESPONSE] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`[API ERROR] ${error.response?.status || 'Network Error'} ${error.config?.url}`, error.response?.data);
    
    if (error.response?.status === 401) {
      console.warn('Unauthorized - redirecting to login');

      localStorage.removeItem('token');

      // 🔥 safer than hard reload loop
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;