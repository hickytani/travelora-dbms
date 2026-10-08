-- Travel Booking and Trip Management System - PostgreSQL Schema
-- DA-2 Implementation based on DA-1 ER Diagram

-- Create tables without foreign key constraints first
CREATE TABLE IF NOT EXISTS admin (
    admin_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    address TEXT,
    passport_no VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS destination (
    destination_id SERIAL PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    description TEXT,
    climate VARCHAR(50),
    best_season VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS package (
    package_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    duration INTEGER NOT NULL CHECK (duration > 0),
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    category VARCHAR(100),
    destination_id INTEGER NOT NULL,
    admin_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (destination_id) REFERENCES destination(destination_id) ON DELETE RESTRICT,
    FOREIGN KEY (admin_id) REFERENCES admin(admin_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS hotel (
    hotel_id SERIAL PRIMARY KEY,
    hotel_name VARCHAR(150) NOT NULL,
    rating DECIMAL(3, 1) CHECK (rating >= 0 AND rating <= 5),
    location VARCHAR(200),
    price_per_night DECIMAL(10, 2) NOT NULL CHECK (price_per_night > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS flight (
    flight_id SERIAL PRIMARY KEY,
    airline VARCHAR(100) NOT NULL,
    departure VARCHAR(100) NOT NULL,
    arrival VARCHAR(100) NOT NULL,
    departure_time TIME,
    arrival_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS booking (
    booking_id SERIAL PRIMARY KEY,
    booking_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')),
    customer_id INTEGER NOT NULL,
    package_id INTEGER NOT NULL,
    hotel_id INTEGER NOT NULL,
    flight_id INTEGER NOT NULL,
    admin_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES package(package_id) ON DELETE RESTRICT,
    FOREIGN KEY (hotel_id) REFERENCES hotel(hotel_id) ON DELETE RESTRICT,
    FOREIGN KEY (flight_id) REFERENCES flight(flight_id) ON DELETE RESTRICT,
    FOREIGN KEY (admin_id) REFERENCES admin(admin_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS payment (
    payment_id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('UPI', 'CARD', 'NET_BANKING')),
    payment_status VARCHAR(50) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'SUCCESS', 'FAILED')),
    transaction_id VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES booking(booking_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS review (
    review_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    package_id INTEGER NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES package(package_id) ON DELETE CASCADE,
    CONSTRAINT review_customer_package_unique UNIQUE (customer_id, package_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_package_destination ON package(destination_id);
CREATE INDEX idx_package_admin ON package(admin_id);
CREATE INDEX idx_booking_customer ON booking(customer_id);
CREATE INDEX idx_booking_package ON booking(package_id);
CREATE INDEX idx_booking_hotel ON booking(hotel_id);
CREATE INDEX idx_booking_flight ON booking(flight_id);
CREATE INDEX idx_booking_admin ON booking(admin_id);
CREATE INDEX idx_payment_booking ON payment(booking_id);
CREATE INDEX idx_review_customer ON review(customer_id);
CREATE INDEX idx_review_package ON review(package_id);
CREATE INDEX idx_customer_email ON customer(email);
CREATE INDEX idx_admin_email ON admin(email);
