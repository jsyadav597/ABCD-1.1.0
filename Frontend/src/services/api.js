import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - Add token to every request
API.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle common errors
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default API

// Auth API endpoints
export const authAPI = {
  login: (email, password) =>
    API.post('/auth/login', { email, password }),
  register: (userData) =>
    API.post('/auth/register', userData),
  logout: () =>
    API.post('/auth/logout'),
  getProfile: () =>
    API.get('/auth/profile'),
  refreshToken: () =>
    API.post('/auth/refresh-token')
}

// User API endpoints
export const userAPI = {
  getAll: () => API.get('/users'),
  getById: (id) => API.get(`/users/${id}`),
  create: (userData) => API.post('/users', userData),
  update: (id, userData) => API.put(`/users/${id}`, userData),
  delete: (id) => API.delete(`/users/${id}`)
}

// Organization API endpoints
export const organizationAPI = {
  getAll: () => API.get('/organizations'),
  getById: (id) => API.get(`/organizations/${id}`),
  create: (data) => API.post('/organizations', data),
  update: (id, data) => API.put(`/organizations/${id}`, data),
  delete: (id) => API.delete(`/organizations/${id}`)
}

// Branch API endpoints
export const branchAPI = {
  getAll: () => API.get('/branches'),
  getById: (id) => API.get(`/branches/${id}`),
  create: (data) => API.post('/branches', data),
  update: (id, data) => API.put(`/branches/${id}`, data),
  delete: (id) => API.delete(`/branches/${id}`)
}

// Role API endpoints
export const roleAPI = {
  getAll: () => API.get('/roles'),
  getById: (id) => API.get(`/roles/${id}`),
  create: (data) => API.post('/roles', data),
  update: (id, data) => API.put(`/roles/${id}`, data),
  delete: (id) => API.delete(`/roles/${id}`)
}
