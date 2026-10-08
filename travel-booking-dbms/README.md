# TRAVELORA — Travel Booking & Trip Management System
## DA-2 DBMS Implementation

A full-stack travel booking website demonstrating database design, relational queries, and CRUD operations based on the DA-1 ER model.

---

## 📋 Project Overview

**TRAVELORA** is a functional travel booking platform built to showcase:

- ✅ Relational Database Design (PostgreSQL)
- ✅ Entity-Relationship Model (DA-1)
- ✅ Foreign Key Relationships
- ✅ Complex SQL Joins
- ✅ CRUD Operations
- ✅ User Authentication & Authorization
- ✅ Booking Workflow & Transactions
- ✅ Admin Dashboard
- ✅ Modern Responsive UI

---

## 🗄️ Database Schema

### 9 Core Entities

```
1. Customer          — Users who book trips
2. Destination       — Travel destinations
3. Package           — Pre-designed travel packages
4. Hotel             — Accommodation options
5. Flight            — Flight options
6. Booking           — Customer bookings
7. Payment           — Payment records
8. Review            — Customer reviews
9. Admin             — Administrative users
```

### Key Relationships

```
Customer ──────< Booking >─────── Package
                     |                |
                     v                v
                 Payment         Destination

Customer ──────────< Review >───── Package

                  Hotel <─────────── Booking
                     
                  Flight <─────────── Booking
```

### Entity Attributes

#### CUSTOMER
- `customer_id` (PK, Serial)
- `name` (VARCHAR 100)
- `email` (VARCHAR 150, UNIQUE)
- `phone` (VARCHAR 20)
- `password` (VARCHAR 255, Hashed)
- `address` (TEXT)
- `passport_no` (VARCHAR 50)
- `created_at` (TIMESTAMP)

#### DESTINATION
- `destination_id` (PK, Serial)
- `city` (VARCHAR 100)
- `country` (VARCHAR 100)
- `description` (TEXT)
- `climate` (VARCHAR 50)
- `best_season` (VARCHAR 100)

#### PACKAGE
- `package_id` (PK, Serial)
- `title` (VARCHAR 200)
- `duration` (INTEGER, days)
- `price` (DECIMAL 10,2)
- `category` (VARCHAR 100)
- `destination_id` (FK → Destination)

#### HOTEL
- `hotel_id` (PK, Serial)
- `hotel_name` (VARCHAR 150)
- `rating` (DECIMAL 3,1, 0-5)
- `location` (VARCHAR 200)
- `price_per_night` (DECIMAL 10,2)

#### FLIGHT
- `flight_id` (PK, Serial)
- `airline` (VARCHAR 100)
- `departure` (VARCHAR 100)
- `arrival` (VARCHAR 100)
- `departure_time` (TIME)
- `arrival_time` (TIME)

#### BOOKING
- `booking_id` (PK, Serial)
- `booking_date` (DATE)
- `status` (VARCHAR 50, CHECK PENDING|CONFIRMED|CANCELLED|COMPLETED)
- `customer_id` (FK → Customer)
- `package_id` (FK → Package)
- `hotel_id` (FK → Hotel)
- `flight_id` (FK → Flight)

#### PAYMENT
- `payment_id` (PK, Serial)
- `booking_id` (FK → Booking)
- `amount` (DECIMAL 10,2)
- `payment_method` (VARCHAR 50, CHECK UPI|CARD|NET_BANKING)
- `payment_status` (VARCHAR 50, CHECK PENDING|SUCCESS|FAILED)
- `transaction_id` (VARCHAR 100, UNIQUE)

#### REVIEW
- `review_id` (PK, Serial)
- `customer_id` (FK → Customer)
- `package_id` (FK → Package)
- `rating` (INTEGER 1-5)
- `comment` (TEXT)
- `date` (TIMESTAMP)

#### ADMIN
- `admin_id` (PK, Serial)
- `name` (VARCHAR 100)
- `email` (VARCHAR 150, UNIQUE)
- `password` (VARCHAR 255, Hashed)
- `role` (VARCHAR 50)

---

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** (Build tool)
- **Tailwind CSS** (Styling)
- **shadcn/ui** (Component library)
- **Lucide Icons** (Icons)

### Backend
- **Node.js** with TypeScript
- **Express.js** (Web framework)
- **PostgreSQL** (Database)
- **pg** (Database driver)
- **bcryptjs** (Password hashing)
- **jsonwebtoken** (Authentication)

### Database
- **PostgreSQL 12+**
- **SQL Migrations**
- **Seed Data Scripts**

---

## 📦 Project Structure

```
travel-booking-dbms/
│
├── frontend/                      # React + Vite application
│   ├── src/
│   │   ├── components/           # Reusable React components
│   │   ├── pages/                # Page components
│   │   ├── layouts/              # Layout wrappers
│   │   ├── hooks/                # Custom React hooks
│   │   ├── services/             # API service layer
│   │   ├── types/                # TypeScript types
│   │   ├── styles/               # Tailwind + CSS
│   │   ├── App.tsx               # Root component
│   │   └── main.tsx              # Entry point
│   ├── public/                   # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/                       # Express + Node.js application
│   ├── src/
│   │   ├── routes/               # API endpoint definitions
│   │   ├── controllers/          # Route handlers
│   │   ├── services/             # Business logic
│   │   ├── db/                   # Database connection & queries
│   │   ├── middleware/           # Auth, validation, error handling
│   │   ├── utils/                # Helper functions
│   │   ├── types/                # TypeScript interfaces
│   │   └── server.ts             # Main server file
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── database/                      # Database scripts
│   ├── schema.sql                # Table definitions
│   ├── seed.sql                  # Sample data
│   └── queries.sql               # Key SQL queries
│
├── README.md                      # This file
├── docker-compose.yml            # PostgreSQL container
└── .gitignore
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 12+
- Docker (optional, for PostgreSQL)

### 1. Database Setup

#### Option A: Using Docker (Recommended)
```bash
docker-compose up -d
```

#### Option B: Local PostgreSQL
```bash
# Create database
createdb travelora_db

# Run schema
psql travelora_db < database/schema.sql

# Run seed data
psql travelora_db < database/seed.sql
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your database credentials
# DATABASE_URL=postgresql://postgres:my-worldos-password-123@localhost:5432/travelora_db

# Run migrations (if applicable)
npm run migrate

# Start backend server
npm start
```

Backend runs at: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (if needed)
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 📝 API Endpoints

### Destinations
```
GET    /api/destinations
GET    /api/destinations/:id
POST   /api/destinations (Admin)
PUT    /api/destinations/:id (Admin)
DELETE /api/destinations/:id (Admin)
```

### Packages
```
GET    /api/packages
GET    /api/packages/:id
POST   /api/packages (Admin)
PUT    /api/packages/:id (Admin)
DELETE /api/packages/:id (Admin)
```

### Hotels
```
GET    /api/hotels
GET    /api/hotels/:id
POST   /api/hotels (Admin)
PUT    /api/hotels/:id (Admin)
DELETE /api/hotels/:id (Admin)
```

### Flights
```
GET    /api/flights
GET    /api/flights/:id
POST   /api/flights (Admin)
PUT    /api/flights/:id (Admin)
DELETE /api/flights/:id (Admin)
```

### Authentication
```
POST   /api/auth/register (Customer)
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me (Protected)
POST   /api/auth/admin-login
```

### Customers
```
GET    /api/customers (Admin)
GET    /api/customers/:id
PUT    /api/customers/:id (Self or Admin)
DELETE /api/customers/:id (Admin)
```

### Bookings
```
GET    /api/bookings (Customer - own, Admin - all)
GET    /api/bookings/:id
POST   /api/bookings
PUT    /api/bookings/:id/cancel
PUT    /api/bookings/:id/status (Admin)
```

### Payments
```
GET    /api/payments (Admin)
GET    /api/payments/:id
POST   /api/payments
```

### Reviews
```
GET    /api/reviews
GET    /api/reviews/:id
POST   /api/reviews
DELETE /api/reviews/:id
```

---

## 🔐 Demo Credentials

### Customer Account
```
Email:    prasun@example.com
Password: password123
```

### Admin Account
```
Email:    admin@travelora.com
Password: password123
```

---

## 📄 Website Pages

### Public Pages
- **Home** (`/`) — Landing page with featured packages
- **Destinations** (`/destinations`) — Browse all destinations with filters
- **Packages** (`/packages`) — Browse packages with JOIN queries
- **Package Details** (`/packages/:id`) — View package details, hotels, flights, reviews
- **Register** (`/register`) — Customer registration
- **Login** (`/login`) — Customer/Admin login

### Customer Pages (Protected)
- **Dashboard** (`/dashboard`) — Welcome, upcoming trips, stats
- **My Bookings** (`/my-bookings`) — Booking history with JOINs
- **Booking Details** (`/my-bookings/:id`) — Full booking information
- **Book Package** (`/book/:packageId`) — Booking workflow
- **Payment** (`/payment/:bookingId`) — Payment processing
- **Reviews** (`/reviews`) — Write reviews for packages

### Admin Pages (Protected)
- **Admin Dashboard** (`/admin`) — Statistics and overview
- **Customers** (`/admin/customers`) — CRUD customer management
- **Packages** (`/admin/packages`) — CRUD package management
- **Destinations** (`/admin/destinations`) — CRUD destination management
- **Hotels** (`/admin/hotels`) — CRUD hotel management
- **Flights** (`/admin/flights`) — CRUD flight management
- **Bookings** (`/admin/bookings`) — View and manage bookings
- **Payments** (`/admin/payments`) — View payment records
- **Reviews** (`/admin/reviews`) — View customer reviews
- **Database Schema** (`/admin/database`) — Visual schema overview
- **DB Operations** (`/admin/db-operations`) — Demonstration queries

---

## 🔑 Key DBMS Demonstrations

### 1. CREATE Operations
- Register customer → `INSERT INTO customer`
- Add package → `INSERT INTO package`
- Create booking → `INSERT INTO booking`
- Process payment → `INSERT INTO payment`

### 2. READ Operations with JOINs
```sql
-- All packages with destinations
SELECT p.*, d.city, d.country 
FROM Package p 
JOIN Destination d ON p.destination_id = d.destination_id;

-- Customer booking history
SELECT b.*, p.title, d.city, h.hotel_name, f.airline
FROM Booking b
JOIN Package p ON b.package_id = p.package_id
JOIN Destination d ON p.destination_id = d.destination_id
JOIN Hotel h ON b.hotel_id = h.hotel_id
JOIN Flight f ON b.flight_id = f.flight_id
WHERE b.customer_id = $1;

-- Package reviews
SELECT r.*, c.name, p.title
FROM Review r
JOIN Customer c ON r.customer_id = c.customer_id
JOIN Package p ON r.package_id = p.package_id;
```

### 3. UPDATE Operations
```sql
UPDATE Package SET price = $1 WHERE package_id = $2;
UPDATE Booking SET status = 'CANCELLED' WHERE booking_id = $1;
UPDATE Customer SET address = $1 WHERE customer_id = $2;
```

### 4. DELETE Operations
```sql
DELETE FROM Review WHERE review_id = $1;
DELETE FROM Destination WHERE destination_id = $1; -- CASCADE
```

### 5. Foreign Key Constraints
All FK relationships are enforced at the database level preventing:
- Bookings with invalid customers
- Packages with invalid destinations
- Payments with invalid bookings

### 6. Transactions
Booking workflow uses transactions for consistency:
```sql
BEGIN;
INSERT INTO Booking (...);
INSERT INTO Payment (...);
COMMIT;
```

---

## ✅ Validation & Constraints

### Column Constraints
- **PRIMARY KEY** — All tables have unique identifiers
- **FOREIGN KEY** — All relationships are enforced
- **UNIQUE** — Email fields, transaction IDs
- **NOT NULL** — Critical fields
- **CHECK** — Status values, rating ranges, price > 0

### Data Validation
- Email format validation
- Password hashing with bcryptjs
- Referential integrity enforcement
- Status enum checks
- Rating range (1-5)
- Price range (positive)

---

## 🧪 Testing

### Test the Complete Workflow
1. Register a new customer
2. Browse destinations (SELECT with filters)
3. View packages (SELECT with JOIN)
4. Select a package
5. Choose hotel and flight
6. Create booking (INSERT + FK validation)
7. Make payment (INSERT + FK)
8. View booking history (JOIN query)
9. Write review (INSERT + FK)
10. Admin: View all bookings (SELECT with multiple JOINs)
11. Admin: Manage packages (CRUD)
12. Admin: View database schema

---

## 📊 Sample Queries for Demonstration

### Dashboard Statistics
```sql
-- Total customers
SELECT COUNT(*) FROM Customer;

-- Total packages
SELECT COUNT(*) FROM Package;

-- Total bookings
SELECT COUNT(*) FROM Booking;

-- Total revenue
SELECT SUM(amount) FROM Payment WHERE payment_status = 'SUCCESS';

-- Booking status breakdown
SELECT status, COUNT(*) FROM Booking GROUP BY status;
```

### Complex Queries
```sql
-- Top destinations by bookings
SELECT d.city, COUNT(b.booking_id) as total_bookings
FROM Destination d
JOIN Package p ON d.destination_id = p.destination_id
JOIN Booking b ON p.package_id = b.package_id
GROUP BY d.city
ORDER BY total_bookings DESC;

-- Customer with most bookings
SELECT c.name, COUNT(b.booking_id) as total_bookings
FROM Customer c
LEFT JOIN Booking b ON c.customer_id = b.customer_id
GROUP BY c.customer_id, c.name
ORDER BY total_bookings DESC
LIMIT 10;

-- Average rating by package
SELECT p.title, AVG(r.rating) as avg_rating, COUNT(r.review_id) as total_reviews
FROM Package p
LEFT JOIN Review r ON p.package_id = r.package_id
GROUP BY p.package_id, p.title
ORDER BY avg_rating DESC;
```

---

## 🔒 Security Features

- ✅ Password hashing (bcryptjs)
- ✅ JWT authentication
- ✅ Role-based access control (Customer/Admin)
- ✅ Parameterized SQL queries (No SQL injection)
- ✅ Environment variables for secrets
- ✅ Protected API routes
- ✅ HTTPS ready
- ✅ Input validation

---

## 📱 Responsive Design

The website is optimized for:
- ✅ Desktop (1920px+)
- ✅ Laptop (1366px)
- ✅ Tablet (768px)
- ✅ Mobile (375px+)

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
psql -U postgres

# Verify database exists
\l

# Check connection string in .env
DATABASE_URL=postgresql://user:password@localhost:5432/travelora_db
```

### Port Already in Use
```bash
# Backend port 5000
lsof -i :5000
kill -9 <PID>

# Frontend port 5173
lsof -i :5173
```

### CORS Issues
Ensure backend CORS is configured to accept requests from frontend origin.

---

## 📚 References

- DA-1 ER Diagram — See `DBMS-DA1.pdf`
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Express Documentation: https://expressjs.com/
- React Documentation: https://react.dev/
- Tailwind CSS: https://tailwindcss.com/

---

## 👤 Author

**Prasun Kumar**

DA-2 DBMS Implementation Project — Travel Booking System

---

## 📄 License

Academic Project — Educational Purposes Only
