# TRAVELORA
## Travel Booking & Trip Management System
### DA-2 Final Implementation Report

**Project location:** `c:\Users\prasu\Downloads\da-2-dbms\travel-booking-dbms`

**Report date:** 04 September 2026

---

## 1. Executive Summary

TRAVELORA is a full-stack travel booking and trip management system created for the DBMS DA-2 project. It connects a React/Vite frontend to an Express/TypeScript REST API and a PostgreSQL relational database.

The project demonstrates the complete database-driven flow:

```text
React frontend
    -> Express REST API
        -> Parameterized SQL
            -> PostgreSQL relational tables
                -> JSON response
                    -> React UI
```

The implementation was extended from the existing project rather than rebuilt. Existing authentication, services, routes, database files, and frontend structure were retained and completed where necessary.

The database is the central source of application data. Destinations, packages, hotels, flights, bookings, payments, reviews, customers, and administrative records are read from or written to PostgreSQL through the backend.

---

## 2. Work Completed in Context of the Existing Project

The original project already contained a substantial foundation:

- React 18 and Vite frontend
- Express and TypeScript backend
- PostgreSQL schema and seed scripts
- JWT authentication
- Customer and admin roles
- Service-based backend architecture
- Axios API client
- React Router route structure
- Home and Login pages
- Docker Compose configuration
- Project documentation

The final implementation pass built on that foundation. The major work completed was:

1. Audited the existing database schema against the corrected DA-2 relational model.
2. Added the missing `admin_id` ownership relationships to packages and bookings.
3. Added the composite review uniqueness constraint.
4. Updated seed data so every package and booking has a valid administrator.
5. Updated backend interfaces, SQL queries, and insert operations for the corrected schema.
6. Implemented the remaining customer-facing pages.
7. Implemented the remaining admin-facing pages.
8. Added database-backed forms, searches, mutations, loading states, error states, and empty states.
9. Added a DBMS query demonstration file at `database/queries.sql`.
10. Updated implementation documentation and database connection configuration.
11. Configured the supplied PostgreSQL password consistently.
12. Ran backend and frontend production builds.
13. Started PostgreSQL locally, initialized the database, loaded the seed data, and verified live API results.
14. Started the frontend and confirmed that real destinations and packages render in the browser.
15. Fixed the local CORS configuration so both Vite ports 5173 and 5174 are accepted during development.
16. Added a premium landing-page layer without changing the core DA-2 architecture.
17. Added destination-specific travel imagery with a high-quality fallback image.
18. Added GSAP hero and scroll-triggered reveal animations with reduced-motion support.
19. Added responsive destination tiles, package cards, CTA sections, and a visual DBMS workflow section.
20. Refined typography, navigation, hover states, spacing, colors, and responsive presentation.
21. Replaced hardcoded landing-page metrics with counts derived from API data.

The project was not replaced with a new framework, ORM, microservice architecture, or unrelated feature set.

---

## 3. Final Project Inventory

After excluding `node_modules` and generated `dist` output, the repository contains approximately:

| File type | Count | Purpose |
|---|---:|---|
| `.tsx` | 30 | React pages and components |
| `.ts` | 18 | Backend services, routes, types, utilities |
| `.json` | 7 | Package and TypeScript configuration |
| `.sql` | 3 | Schema, seed data, DBMS demonstration queries |
| `.md` | 3 | Project documentation and guides |
| `.js` | 2 | Tailwind and PostCSS configuration |
| `.css` | 1 | Tailwind entrypoint and shared styles |
| `.yml` | 1 | Docker Compose configuration |
| `.sh` | 1 | Quick-start shell script |
| `.html` | 1 | Vite HTML entrypoint |
| `.gitignore` | 1 | Repository ignore rules |

The main project areas are:

```text
travel-booking-dbms/
├── database/
├── backend/
├── frontend/
├── docker-compose.yml
├── README.md
├── IMPLEMENTATION.md
├── QUICKSTART.md
├── FINAL_PROJECT_REPORT.md
└── start.sh
```

---

## 4. Corrected Database Model

The authoritative model contains 9 normalized entities.

### 4.1 Customer

| Column | Meaning |
|---|---|
| `customer_id` | Primary key |
| `name` | Customer name |
| `email` | Unique login email |
| `phone` | Contact number |
| `password` | Bcrypt password hash |
| `address` | Customer address |
| `passport_no` | Passport identifier |

### 4.2 Destination

| Column | Meaning |
|---|---|
| `destination_id` | Primary key |
| `city` | Destination city or region |
| `country` | Country |
| `description` | Destination description |
| `climate` | Climate classification |
| `best_season` | Recommended travel season |

### 4.3 Admin

| Column | Meaning |
|---|---|
| `admin_id` | Primary key |
| `name` | Administrator name |
| `email` | Unique administrator email |
| `password` | Bcrypt password hash |
| `role` | Administrative role |

### 4.4 Package

| Column | Meaning |
|---|---|
| `package_id` | Primary key |
| `title` | Package name |
| `duration` | Number of days |
| `price` | Package price |
| `category` | Luxury, standard, adventure, leisure, etc. |
| `destination_id` | Foreign key to `destination` |
| `admin_id` | Foreign key to `admin` |

### 4.5 Hotel

| Column | Meaning |
|---|---|
| `hotel_id` | Primary key |
| `hotel_name` | Hotel name |
| `rating` | Rating from 0 to 5 |
| `location` | Hotel location |
| `price_per_night` | Nightly price |

### 4.6 Flight

| Column | Meaning |
|---|---|
| `flight_id` | Primary key |
| `airline` | Airline name |
| `departure` | Departure airport or city |
| `arrival` | Arrival airport or city |
| `departure_time` | Departure time |
| `arrival_time` | Arrival time |

### 4.7 Booking

| Column | Meaning |
|---|---|
| `booking_id` | Primary key |
| `booking_date` | Travel/booking date |
| `status` | `PENDING`, `CONFIRMED`, `CANCELLED`, or `COMPLETED` |
| `customer_id` | Foreign key to `customer` |
| `package_id` | Foreign key to `package` |
| `hotel_id` | Foreign key to `hotel` |
| `flight_id` | Foreign key to `flight` |
| `admin_id` | Foreign key to `admin` |

### 4.8 Payment

| Column | Meaning |
|---|---|
| `payment_id` | Primary key |
| `booking_id` | Foreign key to `booking` |
| `amount` | Amount paid |
| `payment_method` | `UPI`, `CARD`, or `NET_BANKING` |
| `payment_status` | `PENDING`, `SUCCESS`, or `FAILED` |
| `transaction_id` | Unique simulated transaction identifier |

There is no direct `customer_id` in `payment`. A customer's payment is determined through:

```text
Customer -> Booking -> Payment
```

### 4.9 Review

| Column | Meaning |
|---|---|
| `review_id` | Primary key |
| `customer_id` | Foreign key to `customer` |
| `package_id` | Foreign key to `package` |
| `rating` | Integer from 1 to 5 |
| `comment` | Written review |
| `date` | Review timestamp |

The database enforces one review per customer/package pair using:

```sql
UNIQUE (customer_id, package_id)
```

---

## 5. Database Constraints and Indexes

The schema demonstrates the following DBMS integrity features:

- Primary keys on all 9 entities
- Foreign keys for all required relationships
- Unique customer email
- Unique admin email
- Unique payment transaction ID
- Unique customer/package review pair
- Non-null critical fields
- Booking status check constraint
- Payment method check constraint
- Payment status check constraint
- Review rating check from 1 through 5
- Package duration and price checks
- Hotel rating check from 0 through 5
- Hotel nightly price check
- Restrictive deletion for package, hotel, flight, and administrator records referenced by bookings

Useful indexes exist on:

- Package destination
- Package administrator
- Booking customer
- Booking package
- Booking hotel
- Booking flight
- Booking administrator
- Payment booking
- Review customer
- Review package
- Customer email
- Admin email

These indexes support common joins, searches, authentication lookups, and relationship traversal.

---

## 6. Seed Data Used

The database was initialized successfully with the following records:

| Entity | Records |
|---|---:|
| Admins | 2 |
| Customers | 8 |
| Destinations | 8 |
| Packages | 16 |
| Hotels | 16 |
| Flights | 16 |
| Bookings | 8 |
| Payments | 7 |
| Reviews | 6 |

### Destinations

The seeded destinations are:

- Dubai, UAE
- Paris, France
- Tokyo, Japan
- Bali, Indonesia
- Switzerland
- Singapore
- London, United Kingdom
- New York, USA

### Packages

Each destination has two travel packages. Examples include:

- Dubai Luxury Escape
- Dubai Beach Getaway
- Paris Explorer
- Paris Romance
- Tokyo Cultural Journey
- Bali Beach Retreat
- Swiss Alpine Adventure
- Singapore Modern Escape
- London Royal Experience
- New York City Lights

### Hotels

The seed includes realistic hotel options such as:

- Atlantis The Palm
- Burj Al Arab
- Hilton Paris
- Le Meurice
- Tokyo Grand Hotel
- Four Seasons Bali
- Marina Bay Sands
- The Savoy London
- The Plaza Hotel

### Flights

The seed includes flights operated by:

- Emirates
- Air India
- Qatar Airways
- Air France
- Singapore Airlines
- All Nippon Airways
- Garuda Indonesia
- SWISS
- Lufthansa
- British Airways
- United Airlines

### Booking status coverage

The seeded bookings include:

- Confirmed bookings
- A pending booking
- A cancelled booking

### Payment coverage

The seeded payment data includes successful and pending payment records across:

- Card
- UPI
- Net Banking

### Reviews

Six reviews demonstrate ratings from 4 to 5 and are joined with the corresponding customer, package, and destination records.

---

## 7. Demo Accounts

### Customer

```text
Email: prasun@example.com
Password: password123
```

### Admin

```text
Email: admin@travelora.com
Password: password123
```

Passwords are stored in the database as bcrypt hashes. Plaintext passwords are not returned by customer or admin APIs.

### PostgreSQL connection

```text
User: postgres
Database: travelora_db
Host: localhost
Port: 5432
Password: configured locally; never commit or document the value
```

---

## 8. Backend Work Completed

The backend uses Express, TypeScript, PostgreSQL `pg`, JWT, bcryptjs, and parameterized SQL.

### Services

- `authService` for registration, login, JWT generation, and user retrieval
- `destinationService` for destination CRUD and filtering
- `packageService` for package CRUD, destination joins, and price/category searches
- `hotelService` for hotel CRUD
- `flightService` for flight CRUD
- `bookingService` for booking joins, inserts, status changes, cancellation, and revenue queries
- `paymentService` for payment joins, simulated payment insertion, and statistics
- `reviewService` for review joins, creation, deletion, and rating aggregation
- `customerService` for customer administration and customer statistics
- `adminService` for dashboard counts, grouped statistics, schema information, and predefined DBMS queries

### API coverage

The backend exposes approximately 51 route declarations covering:

- Authentication
- Destinations
- Packages
- Hotels
- Flights
- Bookings
- Payments
- Reviews
- Customers
- Admin dashboard and DBMS demonstrations
- Health check

### Security and authorization

- JWT authentication is retained.
- Customer and admin tokens carry different roles.
- Admin routes use server-side admin middleware.
- Customers cannot access admin endpoints.
- Booking creation requires authentication.
- Customer cancellation is scoped to the authenticated customer.
- User input in SQL uses PostgreSQL parameters rather than string interpolation.
- Passwords use bcrypt hashing.
- Database errors are converted into user-facing API messages.

### Transactions

Payment creation is transaction-wrapped:

```text
BEGIN
  Insert payment
  If payment succeeds, update booking to CONFIRMED
COMMIT
```

If either operation fails, the transaction rolls back. This prevents a payment record from being committed while the booking update fails.

Booking creation also runs inside a transaction, preserving atomicity for the booking insert.

---

## 9. Frontend Work Completed

### Public pages

- Home
- Destinations
- Packages
- Package details
- Login
- Registration

### Customer pages

- Dashboard
- My bookings
- Booking details
- Book package
- Payment simulation
- Reviews

### Admin pages

- Admin dashboard
- Customer management
- Package management
- Destination management
- Hotel management
- Flight management
- Booking management
- Payment records
- Review management
- Database schema page
- DB operations page

### Database-driven behavior

The frontend does not rely on hardcoded destination or package arrays for application data. It calls the Axios API client, which communicates with Express and PostgreSQL.

Implemented behaviors include:

- Destination search and filtering
- Package search and filtering
- Package details loading
- Hotel selection from database records
- Flight selection from database records
- Real booking insertion
- Simulated payment insertion
- Automatic booking confirmation after successful payment
- Booking history through multi-table joins
- Booking cancellation without deleting the booking record
- Review creation with duplicate-review database protection
- Admin statistics from SQL aggregation
- Admin CRUD forms and deletion actions
- Schema metadata retrieval
- Predefined DBMS query execution
- Loading indicators
- Error messages
- Empty results states
- Protected routes

---

## 10. Visual Aesthetics and UI Design

TRAVELORA uses a clean, modern travel-booking aesthetic with a restrained academic-demo presentation.

### Overall visual direction

- Blue travel-oriented primary color
- Warm white content surfaces
- Light gray page background
- Dark gray readable text
- White cards with subtle borders and shadows
- Rounded corners on cards, forms, and buttons
- Spacious section padding
- Clear visual hierarchy
- Responsive grid layouts
- Consistent button and badge styles

### Navigation

The navbar uses a strong blue header with:

- TRAVELORA aviation-themed logo treatment
- Home, Destinations, and Packages links
- Customer links after login
- Admin Panel access for administrators
- Login/Register actions for guests
- Responsive mobile menu
- Logout action with icon

### Home page

The home page is organized as a travel discovery funnel:

1. Hero section with “Discover Your Next Journey”
2. Explore Packages primary action
3. Popular Destinations section
4. Featured Packages section
5. How It Works four-step explanation
6. Footer with navigation, support, and contact information

Destination and package cards are populated from PostgreSQL. The cards show location, category, duration, price, and navigation actions.

### Forms and controls

Forms use consistent full-width inputs, labels, focus rings, and primary/secondary actions. The booking flow uses select controls for hotels and flights and a date input for the booking date.

### Status presentation

The application uses status badge classes for states such as:

- Confirmed
- Pending
- Cancelled
- Completed
- Success
- Failed

### Responsive behavior

The layout uses Tailwind responsive breakpoints for:

- Mobile navigation
- Single-column mobile cards
- Multi-column tablet and desktop grids
- Flexible admin tables and controls
- Responsive forms and content widths

### Premium frontend pass

The final landing page now includes:

- Cinematic full-viewport travel image hero with readable overlay
- Destination-specific imagery for the seeded destinations
- Editorial eyebrow labels and large display typography
- Multi-section scroll journey instead of a single static hero
- GSAP hero entrance and ScrollTrigger section reveals
- Destination tiles with image zoom and overlay hover states
- Featured package cards populated from PostgreSQL
- A clear five-step travel flow
- A public-facing relational DBMS workflow section
- Premium CTA band and refined responsive spacing
- `prefers-reduced-motion` support

The hero uses a high-quality image fallback rather than a heavy video asset, keeping the landing page fast and reliable while satisfying the cinematic travel direction.

---

## 11. DBMS Concepts Demonstrated

The system visibly and technically demonstrates:

| Concept | Demonstration in TRAVELORA |
|---|---|
| Primary keys | Serial IDs on all entities |
| Foreign keys | Relationships among customer, package, booking, hotel, flight, payment, review, and admin |
| Referential integrity | Invalid related IDs are rejected |
| CRUD | Admin destination, package, hotel, flight, customer, and review operations |
| SELECT | All listing and detail pages |
| WHERE | Search, filtering, ownership, and status operations |
| JOIN | Package/destination and booking/customer/package/destination/hotel/flight queries |
| GROUP BY | Booking status and payment method summaries |
| COUNT | Dashboard totals and review counts |
| SUM | Successful revenue calculations |
| AVG | Package review averages |
| UNIQUE | Emails, transaction IDs, and customer/package reviews |
| CHECK | Ratings, prices, statuses, and payment methods |
| NOT NULL | Required identity and relationship fields |
| Transactions | Booking/payment consistency |
| Parameterized queries | All user-input SQL values use parameters |
| Indexes | Foreign-key, email, and relationship lookup indexes |
| Authentication | JWT login and registration |
| Authorization | Customer/admin role protection |

The file `database/queries.sql` contains explicit examples of COUNT, JOIN, multi-table JOIN, GROUP BY, SUM, AVG, and referential-integrity queries for professor demonstration.

---

## 12. Validation Performed

### Database validation

Performed successfully against local PostgreSQL:

- PostgreSQL service was running on `localhost:5432`.
- The `travelora_db` database was created.
- `schema.sql` executed successfully.
- `seed.sql` executed successfully.
- All seeded foreign-key references were valid.
- The expected record counts were returned.

Verified counts:

```text
Destinations: 8
Customers: 8
Packages: 16
Hotels: 16
Flights: 16
Bookings: 8
Payments: 7
Reviews: 6
Admins: 2
```

### API validation

Verified successfully:

- `GET /api/health`
- `GET /api/destinations` returned 8 records.
- `GET /api/packages` returned 16 records.

### Build validation

Backend:

```text
npm run build -> passed
```

Frontend:

```text
npm run build -> passed
```

### Browser validation

The Vite application was opened and inspected in the browser. The following were confirmed:

- React mounted correctly.
- The page title loaded as `TRAVELORA - Travel Booking System`.
- Tailwind CSS was active.
- The body used the expected styled background and typography.
- Real destination records rendered.
- Real package records rendered.
- Home page navigation and sections rendered.
- Cinematic hero image rendered.
- Four destination tiles rendered.
- Six featured package cards rendered.
- DBMS workflow section and CTA rendered.
- API-derived destination/package metrics rendered.

### Not fully automated

A complete browser-driven booking/payment/review workflow was not executed through every form step in this environment. The underlying database and API were initialized and verified, and the relevant frontend pages and API calls are implemented, but a full scripted customer-to-admin acceptance test remains recommended before the academic demonstration.

---

## 13. What Is Fully Implemented

The following areas are implemented in the current codebase:

- Corrected 9-table relational schema
- Admin ownership relationships
- Payment through booking only
- Unique review rule
- Seed data
- PostgreSQL connection
- JWT authentication
- Customer registration and login
- Admin login
- Customer/admin route protection
- Destination browsing and filtering
- Package browsing and filtering
- Package detail view
- Hotel and flight selection
- Booking insertion
- Simulated payment insertion
- Booking confirmation after successful payment
- Customer booking history
- Booking cancellation
- Review submission
- Duplicate review protection through the database
- Admin statistics
- Admin management pages
- DB schema information page
- Predefined DBMS operations page
- Loading/error/empty states
- Responsive navigation and layouts
- Backend and frontend production builds

---

## 14. What Is Not Fully Implemented or Has Remaining Limitations

These are the genuine remaining limitations, rather than hidden claims of completion:

1. **Docker was not available in the working environment.**
   Local PostgreSQL 18 was used successfully instead. The Docker Compose file remains configured for PostgreSQL 15, but Docker Compose itself could not be executed from this machine because the `docker` command was unavailable.

2. **The default generated CRUD interface is functional but compact.**
   Admin CRUD pages prioritize working database operations and reuse a shared component. They could receive more detailed modal editing, richer filtering, and more tailored field controls in a future polish pass.

3. **The hero uses an image fallback rather than background video.**
  This keeps the academic demo lightweight and reliable. The destination images are remote URLs and should be replaced with locally hosted optimized assets for an offline submission.

4. **A full automated end-to-end browser test suite is not included.**
   Builds, database initialization, API reads, and browser rendering were verified. A repeatable Playwright test covering registration, booking, payment, review, and admin mutations would strengthen regression testing.

5. **The frontend currently uses a development API URL fallback.**
   Production deployment should provide a frontend environment variable such as `VITE_API_URL` and a production backend URL.

6. **Some API routes could be further hardened with stricter ownership checks.**
   Booking cancellation was scoped to the customer. Additional customer-owned access checks for every individual payment, booking detail, and review deletion path could be expanded for production-level authorization.

7. **The desktop cursor treatment is intentionally minimal.**
  The frontend uses a restrained crosshair-style interaction rather than a custom aircraft/compass cursor. This avoids distracting the user and keeps normal pointer behavior predictable.

8. **The application does not include out-of-scope features.**
   There is intentionally no wishlist, coupon system, notification service, live map, weather service, AI recommendation engine, real payment gateway, blockchain, chatbot, or microservice layer.

---

## 15. How Much Work Was Done

The work covered a complete integration and implementation pass across the project layers:

- Database schema correction and relationship repair
- Seed-data correction
- Backend type and SQL contract repair
- Authentication and authorization review
- Customer workflow implementation
- Admin workflow implementation
- Shared frontend state and API usage
- UI styling and responsive layout work
- Documentation updates
- Local PostgreSQL initialization
- API and browser validation
- Build troubleshooting
- CORS and port troubleshooting
- PostgreSQL password configuration

In project terms, the work moved the repository from a partially implemented scaffold with many page stubs to a functioning database-backed application whose main pages and workflows communicate with PostgreSQL through the REST API.

The strongest completed demonstration path is:

```text
Home
  -> Destinations
    -> Packages
      -> Package details
        -> Login
          -> Hotel selection
            -> Flight selection
              -> Booking insert
                -> Payment insert
                  -> Booking confirmation
                    -> My bookings JOIN
                      -> Review
                        -> Admin dashboard and DBMS pages
```

---

## 16. Run Instructions

### Start or verify PostgreSQL

The current machine has local PostgreSQL running. The configured connection is:

```text
Host: localhost
Port: 5432
Database: travelora_db
User: postgres
Password: use the locally configured PostgreSQL password
```

For a clean local initialization, create the database if necessary, then run:

```powershell
$env:PGPASSWORD='YOUR_LOCAL_POSTGRES_PASSWORD'
psql -h localhost -U postgres -d postgres -c "CREATE DATABASE travelora_db;"
psql -h localhost -U postgres -d travelora_db -f database/schema.sql
psql -h localhost -U postgres -d travelora_db -f database/seed.sql
```

Do not run the `CREATE DATABASE` command if the database already exists.

### Start backend

```powershell
cd backend
npm install
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

### Start frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173/
```

### Docker option

On a machine with Docker installed:

```powershell
docker compose down -v
docker compose up -d
```

The `-v` option resets the existing database volume so the initialization scripts run with the current schema, seed data, and configured PostgreSQL password.

---

## 17. Final Assessment

TRAVELORA is a functioning academic DBMS project with:

- A corrected relational model
- Real PostgreSQL persistence
- RESTful backend operations
- Database-backed React pages
- Authentication and role authorization
- Transactions
- Joins and aggregations
- Constraints and indexes
- Admin CRUD
- A visible DBMS demonstration surface
- A coherent modern travel-booking visual style

The remaining limitations are documented above and are mostly related to automated acceptance testing, production hardening, richer imagery, and Docker availability in the current environment. The core DA-2 database demonstration and the main user-facing travel workflow are implemented and operational against the local PostgreSQL database.
