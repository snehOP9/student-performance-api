import axios from 'axios';
import type { StudentInput, PredictionResult, UncertaintyResult, Recommendation } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Health check
  health: () => api.get('/'),

  // Predictions
  predict: (data: StudentInput): Promise<{ data: PredictionResult }> =>
    api.post('/predict', data),

  // Uncertainty quantification
  uncertainty: (data: StudentInput): Promise<{ data: UncertaintyResult }> =>
    api.post('/uncertainty', data),

  // Recommendations
  recommend: (data: StudentInput): Promise<{ data: Recommendation[] }> =>
    api.post('/recommend', data),

  // Auth endpoints
  signup: (params: { full_name: string; email: string; password: string; role: string }) =>
    api.post('/auth/signup', params),

  login: (params: { email: string; password: string }) =>
    api.post('/auth/login', params),

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return Promise.resolve();
  },

  // Profile
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

export default api;
