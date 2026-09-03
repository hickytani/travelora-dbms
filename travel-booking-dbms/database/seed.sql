-- Seed Data for Travel Booking and Trip Management System

-- Truncate tables to ensure clean slate
TRUNCATE TABLE review CASCADE;
TRUNCATE TABLE payment CASCADE;
TRUNCATE TABLE booking CASCADE;
TRUNCATE TABLE flight CASCADE;
TRUNCATE TABLE hotel CASCADE;
TRUNCATE TABLE package CASCADE;
TRUNCATE TABLE destination CASCADE;
TRUNCATE TABLE customer CASCADE;
TRUNCATE TABLE admin CASCADE;

-- Reset sequences
ALTER SEQUENCE admin_admin_id_seq RESTART WITH 1;
ALTER SEQUENCE customer_customer_id_seq RESTART WITH 1;
ALTER SEQUENCE destination_destination_id_seq RESTART WITH 1;
ALTER SEQUENCE package_package_id_seq RESTART WITH 1;
ALTER SEQUENCE hotel_hotel_id_seq RESTART WITH 1;
ALTER SEQUENCE flight_flight_id_seq RESTART WITH 1;
ALTER SEQUENCE booking_booking_id_seq RESTART WITH 1;
ALTER SEQUENCE payment_payment_id_seq RESTART WITH 1;
ALTER SEQUENCE review_review_id_seq RESTART WITH 1;

-- Insert Admin Users
INSERT INTO admin (name, email, password, role) VALUES
('Admin User', 'admin@travelora.com', '$2a$10$S25eyRLDGsqBzCp5qpiUNO5uvXBddoVOI1pz7gnt8xGrrZWDXoJJm', 'admin'),
('Manager', 'manager@travelora.com', '$2a$10$S25eyRLDGsqBzCp5qpiUNO5uvXBddoVOI1pz7gnt8xGrrZWDXoJJm', 'manager');

-- Insert Destinations
INSERT INTO destination (city, country, description, climate, best_season) VALUES
('Dubai', 'UAE', 'Luxurious desert city with world-class shopping, iconic architecture, and pristine beaches.', 'Hot & Arid', 'October to April'),
('Paris', 'France', 'The City of Light, renowned for art, culture, romance, and historic landmarks.', 'Temperate', 'April to October'),
('Tokyo', 'Japan', 'Vibrant metropolis blending ancient traditions with cutting-edge modernity.', 'Temperate', 'March to May, September to November'),
('Bali', 'Indonesia', 'Tropical paradise known for stunning beaches, temples, and serene rice terraces.', 'Tropical', 'April to October'),
('Switzerland', 'Switzerland', 'Alpine wonderland with breathtaking mountains, lakes, and charming villages.', 'Temperate', 'June to September'),
('Singapore', 'Singapore', 'Modern city-state with futuristic architecture, diverse culture, and gardens.', 'Tropical', 'February to April'),
('London', 'United Kingdom', 'Historic capital blending royalty, culture, museums, and iconic landmarks.', 'Temperate', 'May to September'),
('New York', 'USA', 'The city that never sleeps, offering Broadway, museums, parks, and endless energy.', 'Temperate', 'April to October');

-- Insert Hotels
INSERT INTO hotel (hotel_name, rating, location, price_per_night) VALUES
('Atlantis The Palm', 5.0, 'Dubai, UAE', 25000.00),
('Burj Al Arab', 5.0, 'Dubai, UAE', 35000.00),
('Hilton Paris', 4.5, 'Paris, France', 12000.00),
('Le Meurice', 5.0, 'Paris, France', 18000.00),
('Tokyo Grand Hotel', 4.5, 'Tokyo, Japan', 10000.00),
('Shinjuku Prince Hotel', 4.0, 'Tokyo, Japan', 8500.00),
('Four Seasons Bali', 5.0, 'Bali, Indonesia', 9000.00),
('Intercontinental Bali', 4.5, 'Bali, Indonesia', 7500.00),
('Mandarin Oriental Geneva', 5.0, 'Switzerland', 15000.00),
('Hotel Kempinski Zurich', 5.0, 'Switzerland', 14000.00),
('Marina Bay Sands', 5.0, 'Singapore', 13000.00),
('Raffles Singapore', 5.0, 'Singapore', 12000.00),
('The Savoy London', 5.0, 'London, UK', 11000.00),
('Claridge''s London', 5.0, 'London, UK', 10500.00),
('The Plaza Hotel', 5.0, 'New York, USA', 9500.00),
('Mandarin Oriental New York', 5.0, 'New York, USA', 10000.00);

-- Insert Flights
INSERT INTO flight (airline, departure, arrival, departure_time, arrival_time) VALUES
('Emirates', 'Bangalore (BLR)', 'Dubai (DXB)', '06:30:00', '08:45:00'),
('Air India', 'Delhi (DEL)', 'Dubai (DXB)', '08:00:00', '10:30:00'),
('Qatar Airways', 'Mumbai (BOM)', 'Paris (CDG)', '22:00:00', '04:30:00'),
('Air France', 'Delhi (DEL)', 'Paris (CDG)', '01:00:00', '08:00:00'),
('Singapore Airlines', 'Bangalore (BLR)', 'Tokyo (NRT)', '23:30:00', '10:30:00'),
('All Nippon Airways', 'Delhi (DEL)', 'Tokyo (HND)', '01:30:00', '15:30:00'),
('Garuda Indonesia', 'Mumbai (BOM)', 'Bali (DPS)', '03:00:00', '07:30:00'),
('Lion Air', 'Chennai (MAA)', 'Bali (DPS)', '02:30:00', '06:45:00'),
('SWISS', 'Bangalore (BLR)', 'Zurich (ZRH)', '01:00:00', '07:45:00'),
('Lufthansa', 'Delhi (DEL)', 'Geneva (GVA)', '02:15:00', '08:45:00'),
('Singapore Airlines', 'Bangalore (BLR)', 'Singapore (SIN)', '06:00:00', '09:30:00'),
('Cathay Pacific', 'Mumbai (BOM)', 'Singapore (SIN)', '01:00:00', '08:15:00'),
('British Airways', 'Delhi (DEL)', 'London (LHR)', '02:00:00', '08:30:00'),
('Virgin Atlantic', 'Bangalore (BLR)', 'London (LHR)', '01:30:00', '08:00:00'),
('United Airlines', 'Delhi (DEL)', 'New York (JFK)', '02:00:00', '04:30:00'),
('American Airlines', 'Mumbai (BOM)', 'New York (JFK)', '01:00:00', '03:45:00');

-- Insert Packages
INSERT INTO package (title, duration, price, category, destination_id, admin_id) VALUES
('Dubai Luxury Escape', 4, 65000.00, 'Luxury', 1, 1),
('Dubai Beach Getaway', 3, 45000.00, 'Standard', 1, 1),
('Paris Explorer', 5, 72000.00, 'Luxury', 2, 1),
('Paris Romance', 3, 50000.00, 'Standard', 2, 1),
('Tokyo Cultural Journey', 6, 85000.00, 'Adventure', 3, 1),
('Tokyo Modern City', 4, 62000.00, 'Standard', 3, 1),
('Bali Beach Retreat', 5, 55000.00, 'Leisure', 4, 1),
('Bali Adventure', 4, 60000.00, 'Adventure', 4, 1),
('Swiss Alpine Adventure', 6, 95000.00, 'Adventure', 5, 1),
('Swiss Classic Tour', 4, 75000.00, 'Standard', 5, 1),
('Singapore Stopover', 3, 48000.00, 'Standard', 6, 2),
('Singapore Modern Escape', 4, 60000.00, 'Luxury', 6, 2),
('London Heritage Tour', 5, 70000.00, 'Standard', 7, 2),
('London Royal Experience', 4, 80000.00, 'Luxury', 7, 2),
('New York Explorer', 5, 78000.00, 'Luxury', 8, 2),
('New York City Lights', 3, 55000.00, 'Standard', 8, 2);

-- Insert Customers
INSERT INTO customer (name, email, phone, password, address, passport_no) VALUES
('Prasun Kumar', 'prasun@example.com', '9876543210', '$2a$10$S25eyRLDGsqBzCp5qpiUNO5uvXBddoVOI1pz7gnt8xGrrZWDXoJJm', '123 Main Street, Bangalore', 'AA1234567'),
('Rahul Sharma', 'rahul@example.com', '9123456789', '$2a$10$S25eyRLDGsqBzCp5qpiUNO5uvXBddoVOI1pz7gnt8xGrrZWDXoJJm', '456 Park Avenue, Mumbai', 'BB9876543'),
('Anjali Patel', 'anjali@example.com', '9234567890', '$2a$10$S25eyRLDGsqBzCp5qpiUNO5uvXBddoVOI1pz7gnt8xGrrZWDXoJJm', '789 Garden Road, Delhi', 'CC5678901'),
('Rohan Verma', 'rohan@example.com', '9345678901', '$2a$10$S25eyRLDGsqBzCp5qpiUNO5uvXBddoVOI1pz7gnt8xGrrZWDXoJJm', '321 Elm Street, Bangalore', 'DD2345678'),
('Priya Singh', 'priya@example.com', '9456789012', '$2a$10$S25eyRLDGsqBzCp5qpiUNO5uvXBddoVOI1pz7gnt8xGrrZWDXoJJm', '654 Oak Avenue, Chennai', 'EE3456789'),
('Aditya Desai', 'aditya@example.com', '9567890123', '$2a$10$S25eyRLDGsqBzCp5qpiUNO5uvXBddoVOI1pz7gnt8xGrrZWDXoJJm', '987 Pine Road, Pune', 'FF4567890'),
('Neha Gupta', 'neha@example.com', '9678901234', '$2a$10$S25eyRLDGsqBzCp5qpiUNO5uvXBddoVOI1pz7gnt8xGrrZWDXoJJm', '147 Maple Lane, Hyderabad', 'GG5678901'),
('Vikram Reddy', 'vikram@example.com', '9789012345', '$2a$10$S25eyRLDGsqBzCp5qpiUNO5uvXBddoVOI1pz7gnt8xGrrZWDXoJJm', '258 Cedar Street, Bangalore', 'HH6789012');

-- Insert Bookings
INSERT INTO booking (booking_date, status, customer_id, package_id, hotel_id, flight_id, admin_id) VALUES
('2026-09-10', 'CONFIRMED', 1, 1, 1, 1, 1),
('2026-09-12', 'CONFIRMED', 2, 3, 3, 3, 1),
('2026-09-15', 'CONFIRMED', 3, 5, 5, 5, 1),
('2026-09-18', 'PENDING', 4, 7, 7, 7, 1),
('2026-09-20', 'CONFIRMED', 5, 2, 2, 2, 1),
('2026-09-22', 'CANCELLED', 6, 4, 4, 4, 2),
('2026-09-25', 'CONFIRMED', 7, 9, 9, 9, 2),
('2026-09-28', 'CONFIRMED', 8, 11, 11, 11, 2);

-- Insert Payments
INSERT INTO payment (booking_id, amount, payment_method, payment_status, transaction_id) VALUES
(1, 90000.00, 'CARD', 'SUCCESS', 'TXN-20260903-00001'),
(2, 112000.00, 'UPI', 'SUCCESS', 'TXN-20260903-00002'),
(3, 155000.00, 'NET_BANKING', 'SUCCESS', 'TXN-20260903-00003'),
(4, 95000.00, 'CARD', 'PENDING', 'TXN-20260903-00004'),
(5, 85000.00, 'UPI', 'SUCCESS', 'TXN-20260903-00005'),
(7, 185000.00, 'NET_BANKING', 'SUCCESS', 'TXN-20260903-00006'),
(8, 96000.00, 'CARD', 'SUCCESS', 'TXN-20260903-00007');

-- Insert Reviews
INSERT INTO review (customer_id, package_id, rating, comment) VALUES
(1, 1, 5, 'Amazing experience! The package was well-organized and all arrangements were excellent.'),
(2, 3, 4, 'Beautiful package. Paris is magical. Hotel was great, only minor issues with transportation.'),
(3, 5, 5, 'Tokyo was incredible! Perfect blend of culture and modernity. Highly recommended!'),
(5, 2, 4, 'Good value for money. Dubai is stunning. Would love to go back.'),
(7, 9, 5, 'Swiss Alps exceeded all expectations. Breathtaking views and perfect organization.'),
(8, 11, 4, 'Singapore is fantastic. Great city experience. Package covered all major attractions.');

-- Verify data integrity
SELECT 'Destinations' as table_name, COUNT(*) as count FROM destination
UNION ALL
SELECT 'Customers', COUNT(*) FROM customer
UNION ALL
SELECT 'Packages', COUNT(*) FROM package
UNION ALL
SELECT 'Hotels', COUNT(*) FROM hotel
UNION ALL
SELECT 'Flights', COUNT(*) FROM flight
UNION ALL
SELECT 'Bookings', COUNT(*) FROM booking
UNION ALL
SELECT 'Payments', COUNT(*) FROM payment
UNION ALL
SELECT 'Reviews', COUNT(*) FROM review
UNION ALL
SELECT 'Admins', COUNT(*) FROM admin;
