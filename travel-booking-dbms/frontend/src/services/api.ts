import axios from 'axios';
import { ApiResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  adminLogin: (email: string, password: string) => api.post('/auth/admin-login', { email, password }),
  getCurrentUser: () => api.get('/auth/me'),
};

// Destinations
export const destinationApi = {
  getAll: () => api.get('/destinations'),
  getById: (id: number) => api.get(`/destinations/${id}`),
  search: (filters: any) => api.get('/destinations', { params: filters }),
  create: (data: any) => api.post('/destinations', data),
  update: (id: number, data: any) => api.put(`/destinations/${id}`, data),
  delete: (id: number) => api.delete(`/destinations/${id}`),
};

// Packages
export const packageApi = {
  getAll: () => api.get('/packages'),
  getById: (id: number) => api.get(`/packages/${id}`),
  search: (filters: any) => api.get('/packages', { params: filters }),
  getByDestination: (destinationId: number) => api.get(`/packages/destination/${destinationId}`),
  create: (data: any) => api.post('/packages', data),
  update: (id: number, data: any) => api.put(`/packages/${id}`, data),
  delete: (id: number) => api.delete(`/packages/${id}`),
};

// Hotels
export const hotelApi = {
  getAll: () => api.get('/hotels'),
  getById: (id: number) => api.get(`/hotels/${id}`),
  create: (data: any) => api.post('/hotels', data),
  update: (id: number, data: any) => api.put(`/hotels/${id}`, data),
  delete: (id: number) => api.delete(`/hotels/${id}`),
};

// Flights
export const flightApi = {
  getAll: () => api.get('/flights'),
  getById: (id: number) => api.get(`/flights/${id}`),
  create: (data: any) => api.post('/flights', data),
  update: (id: number, data: any) => api.put(`/flights/${id}`, data),
  delete: (id: number) => api.delete(`/flights/${id}`),
};

// Bookings
export const bookingApi = {
  getAll: () => api.get('/bookings'),
  getById: (id: number) => api.get(`/bookings/${id}`),
  create: (data: any) => api.post('/bookings', data),
  cancel: (id: number) => api.put(`/bookings/${id}/cancel`),
  updateStatus: (id: number, status: string) => api.put(`/bookings/${id}/status`, { status }),
};

// Payments
export const paymentApi = {
  getAll: () => api.get('/payments'),
  getById: (id: number) => api.get(`/payments/${id}`),
  create: (data: any) => api.post('/payments', data),
};

// Reviews
export const reviewApi = {
  getAll: () => api.get('/reviews'),
  getById: (id: number) => api.get(`/reviews/${id}`),
  getByPackage: (packageId: number) => api.get(`/reviews/package/${packageId}`),
  create: (data: any) => api.post('/reviews', data),
  delete: (id: number) => api.delete(`/reviews/${id}`),
};

// Customers
export const customerApi = {
  getAll: () => api.get('/customers'),
  getById: (id: number) => api.get(`/customers/${id}`),
  update: (id: number, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: number) => api.delete(`/customers/${id}`),
};

// Admin
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getBookingStats: () => api.get('/admin/booking-stats'),
  getPopularDestinations: () => api.get('/admin/popular-destinations'),
  getTopCustomers: () => api.get('/admin/top-customers'),
  getPaymentStats: () => api.get('/admin/payment-stats'),
  getTableInfo: () => api.get('/admin/table-info'),
  getDemoQueries: () => api.get('/admin/demo-queries'),
  executeQuery: (queryName: string) => api.post('/admin/execute-query', { queryName }),
};

export default api;
