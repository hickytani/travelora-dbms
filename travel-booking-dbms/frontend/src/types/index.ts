// Customer
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  passport_no?: string;
}

// Destination
export interface Destination {
  destination_id: number;
  city: string;
  country: string;
  description?: string;
  climate?: string;
  best_season?: string;
}

// Package
export interface Package {
  package_id: number;
  title: string;
  duration: number;
  price: number;
  category?: string;
  destination_id: number;
  city?: string;
  country?: string;
  destination_description?: string;
}

// Hotel
export interface Hotel {
  hotel_id: number;
  hotel_name: string;
  rating?: number;
  location?: string;
  price_per_night: number;
}

// Flight
export interface Flight {
  flight_id: number;
  airline: string;
  departure: string;
  arrival: string;
  departure_time?: string;
  arrival_time?: string;
}

// Booking
export interface Booking {
  booking_id: number;
  booking_date: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  customer_id: number;
  package_id: number;
  hotel_id: number;
  flight_id: number;
  customer_name?: string;
  package_title?: string;
  destination_city?: string;
  hotel_name?: string;
  airline?: string;
}

// Payment
export interface Payment {
  payment_id: number;
  booking_id: number;
  amount: number;
  payment_method: 'UPI' | 'CARD' | 'NET_BANKING';
  payment_status: 'PENDING' | 'SUCCESS' | 'FAILED';
  transaction_id?: string;
}

// Review
export interface Review {
  review_id: number;
  customer_id: number;
  package_id: number;
  rating: number;
  comment?: string;
  date?: string;
  customer_name?: string;
  package_title?: string;
}

// Auth
export interface AuthResponse {
  token: string;
  customer?: Customer;
  admin?: { id: number; name: string; email: string; role: string };
}

export interface User {
  id: number;
  email: string;
  role: 'customer' | 'admin';
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
