-- TRAVELORA DBMS demonstration queries

-- COUNT
SELECT COUNT(*) AS total_customers FROM customer;
SELECT COUNT(*) AS total_packages FROM package;
SELECT COUNT(*) AS total_bookings FROM booking;

-- JOIN: packages and destinations
SELECT p.title, p.duration, p.price, d.city, d.country
FROM package p
JOIN destination d ON p.destination_id = d.destination_id
ORDER BY p.price;

-- Multi-table JOIN: customer booking history
SELECT b.booking_id, c.name AS customer, p.title AS package,
       d.city AS destination, h.hotel_name, f.airline, b.booking_date, b.status
FROM booking b
JOIN customer c ON b.customer_id = c.customer_id
JOIN package p ON b.package_id = p.package_id
JOIN destination d ON p.destination_id = d.destination_id
JOIN hotel h ON b.hotel_id = h.hotel_id
JOIN flight f ON b.flight_id = f.flight_id
ORDER BY b.booking_date;

-- GROUP BY: booking status distribution
SELECT status, COUNT(*) AS booking_count
FROM booking
GROUP BY status
ORDER BY booking_count DESC;

-- SUM: successful revenue by payment method
SELECT payment_method, SUM(amount) AS total_revenue
FROM payment
WHERE payment_status = 'SUCCESS'
GROUP BY payment_method;

-- AVG: package ratings
SELECT p.title, AVG(r.rating)::DECIMAL(3,2) AS average_rating,
       COUNT(r.review_id) AS review_count
FROM package p
LEFT JOIN review r ON p.package_id = r.package_id
GROUP BY p.package_id, p.title
ORDER BY average_rating DESC NULLS LAST;

-- Referential integrity check: every payment belongs to a booking
SELECT p.payment_id, p.transaction_id, b.booking_id, c.email
FROM payment p
JOIN booking b ON p.booking_id = b.booking_id
JOIN customer c ON b.customer_id = c.customer_id;
