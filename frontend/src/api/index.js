import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (userData) => api.post('/auth/login', userData),
  getProfile: () => api.get('/auth/profile'),
};

// Recipe API
export const recipeAPI = {
  getRecipes: (params) => api.get('/recipes', { params }),
  getRecipe: (id) => api.get(`/recipes/${id}`),
  createRecipe: (formData) => api.post('/recipes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateRecipe: (id, formData) => api.put(`/recipes/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteRecipe: (id) => api.delete(`/recipes/${id}`),
  getUserRecipes: () => api.get('/recipes/my-recipes'),
};

// Comment API
export const commentAPI = {
  getComments: (recipeId) => api.get(`/comments/${recipeId}`),
  createComment: (recipeId, content) => api.post(`/comments/${recipeId}`, { content }),
  deleteComment: (id) => api.delete(`/comments/${id}`),
};

// Rating API
export const ratingAPI = {
  createRating: (recipeId, rating) => api.post(`/ratings/${recipeId}`, { rating }),
  getUserRating: (recipeId) => api.get(`/ratings/${recipeId}`),
};

export default api;