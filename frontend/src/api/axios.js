import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',   // ← FastAPI prefix
  withCredentials: false,                    // JWT in header, not cookie
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('adminToken');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
