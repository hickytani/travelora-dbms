// Customer
export interface Customer {
  customer_id: number;
  name: string;
  email: string;
  phone?: string;
  password: string;
  address?: string;
  passport_no?: string;
  created_at?: Date;
}

export interface CustomerWithoutPassword extends Omit<Customer, 'password'> {}

// Destination
export interface Destination {
  destination_id: number;
  city: string;
  country: string;
  description?: string;
  climate?: string;
  best_season?: string;
  created_at?: Date;
}

// Package
export interface Package {
  package_id: number;
  title: string;
  duration: number;
  price: number;
  category?: string;
  destination_id: number;
  admin_id: number;
  created_at?: Date;
}

export interface PackageWithDestination extends Package {
  city?: string;
  country?: string;
}

// Hotel
export interface Hotel {
  hotel_id: number;
  hotel_name: string;
  rating?: number;
  location?: string;
  price_per_night: number;
  created_at?: Date;
}

// Flight
export interface Flight {
  flight_id: number;
  airline: string;
  departure: string;
  arrival: string;
  departure_time?: string;
  arrival_time?: string;
  created_at?: Date;
}

// Booking
export interface Booking {
  booking_id: number;
  booking_date: Date;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  customer_id: number;
  package_id: number;
  hotel_id: number;
  flight_id: number;
  admin_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface BookingWithDetails extends Booking {
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
  created_at?: Date;
}

// Review
export interface Review {
  review_id: number;
  customer_id: number;
  package_id: number;
  rating: number;
  comment?: string;
  date?: Date;
}

export interface ReviewWithDetails extends Review {
  customer_name?: string;
  package_title?: string;
}

// Admin
export interface Admin {
  admin_id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  created_at?: Date;
}

export interface AdminWithoutPassword extends Omit<Admin, 'password'> {}

// Auth
export interface AuthPayload {
  id: number;
  email: string;
  role: 'customer' | 'admin';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
  phone?: string;
  address?: string;
  passport_no?: string;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
