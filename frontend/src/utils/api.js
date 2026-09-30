import axios from 'axios';

// Base URL:
// - Dev: http://localhost:5001/api
// - Prod: REACT_APP_API_URL (set on Vercel/Netlify) or same-origin /api
const getBaseURL = () => {
  if (process.env.REACT_APP_API_URL) {
    return `${process.env.REACT_APP_API_URL}/api`;
  }
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '[api] REACT_APP_API_URL is not set. Falling back to same-origin /api.'
    );
    return '/api';
  }
  return 'http://localhost:5001/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 60000, // 60s — allows large uploads
});

// Request: attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response: handle 401 globally (but no redirect loop on auth pages)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      const onAuthPage =
        window.location.pathname === '/login' ||
        window.location.pathname === '/register';
      if (!onAuthPage) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;