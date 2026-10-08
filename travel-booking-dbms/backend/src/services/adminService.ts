import { query } from '../db/connection';

export const adminService = {
  // Get dashboard statistics
  async getDashboardStats() {
    const result = await query(`
      SELECT 
        (SELECT COUNT(*) FROM customer) as total_customers,
        (SELECT COUNT(*) FROM destination) as total_destinations,
        (SELECT COUNT(*) FROM package) as total_packages,
        (SELECT COUNT(*) FROM hotel) as total_hotels,
        (SELECT COUNT(*) FROM flight) as total_flights,
        (SELECT COUNT(*) FROM booking) as total_bookings,
        (SELECT COUNT(*) FROM payment) as total_payments,
        (SELECT COUNT(*) FROM review) as total_reviews,
        (SELECT SUM(amount) FROM payment WHERE payment_status = 'SUCCESS') as total_revenue
    `);

    return result.rows[0];
  },

  // Get booking statistics
  async getBookingStats() {
    const result = await query(`
      SELECT 
        status,
        COUNT(*) as count,
        ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) as percentage
      FROM booking
      GROUP BY status
      ORDER BY count DESC
    `);

    return result.rows;
  },

  // Get popular destinations
  async getPopularDestinations(limit: number = 5) {
    const result = await query(
      `
      SELECT 
        d.destination_id,
        d.city,
        d.country,
        COUNT(b.booking_id) as total_bookings,
        COUNT(DISTINCT b.customer_id) as unique_customers
      FROM destination d
      LEFT JOIN package p ON d.destination_id = p.destination_id
      LEFT JOIN booking b ON p.package_id = b.package_id
      GROUP BY d.destination_id, d.city, d.country
      ORDER BY total_bookings DESC
      LIMIT $1
    `,
      [limit]
    );

    return result.rows;
  },

  // Get top customers
  async getTopCustomers(limit: number = 10) {
    const result = await query(
      `
      SELECT 
        c.customer_id,
        c.name,
        c.email,
        COUNT(b.booking_id) as total_bookings,
        SUM(CASE WHEN b.status = 'CONFIRMED' THEN 1 ELSE 0 END) as confirmed_bookings,
        SUM(CASE WHEN p.payment_status = 'SUCCESS' THEN p.amount ELSE 0 END) as total_spent
      FROM customer c
      LEFT JOIN booking b ON c.customer_id = b.customer_id
      LEFT JOIN payment p ON b.booking_id = p.booking_id
      GROUP BY c.customer_id, c.name, c.email
      ORDER BY total_bookings DESC
      LIMIT $1
    `,
      [limit]
    );

    return result.rows;
  },

  // Get payment statistics
  async getPaymentStats() {
    const result = await query(`
      SELECT 
        payment_method,
        COUNT(*) as count,
        SUM(CASE WHEN payment_status = 'SUCCESS' THEN amount ELSE 0 END) as revenue
      FROM payment
      GROUP BY payment_method
      ORDER BY revenue DESC
    `);

    return result.rows;
  },

  // Get all DBMS table info (for database schema page)
  async getTableInfo() {
    const result = await query(`
      SELECT 
        table_name,
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name IN ('admin', 'customer', 'destination', 'package', 'hotel', 'flight', 'booking', 'payment', 'review')
      ORDER BY table_name, ordinal_position
    `);

    return result.rows;
  },

  // Get sample complex queries for demonstration
  async getDemoQueries() {
    return [
      {
        name: 'Total Customers',
        query: 'SELECT COUNT(*) FROM customer;',
        description: 'Count all registered customers',
      },
      {
        name: 'Packages with Destinations',
        query: `SELECT p.title, d.city, d.country, p.price 
                FROM package p 
                JOIN destination d ON p.destination_id = d.destination_id
                LIMIT 5;`,
        description: 'Demonstrates JOIN between Package and Destination',
      },
      {
        name: 'Customer Booking History',
        query: `SELECT b.booking_id, c.name, p.title, d.city, b.status
                FROM booking b
                JOIN customer c ON b.customer_id = c.customer_id
                JOIN package p ON b.package_id = p.package_id
                JOIN destination d ON p.destination_id = d.destination_id
                LIMIT 5;`,
        description: 'Complex JOIN showing customer, booking, package, and destination',
      },
      {
        name: 'Payment Information',
        query: `SELECT p.transaction_id, p.amount, p.payment_method, p.payment_status, b.booking_date
                FROM payment p
                JOIN booking b ON p.booking_id = b.booking_id
                ORDER BY p.created_at DESC
                LIMIT 5;`,
        description: 'Shows payment records with booking information',
      },
      {
        name: 'Package Reviews and Ratings',
        query: `SELECT p.title, AVG(r.rating) as avg_rating, COUNT(r.review_id) as review_count
                FROM package p
                LEFT JOIN review r ON p.package_id = r.package_id
                GROUP BY p.package_id, p.title
                ORDER BY avg_rating DESC;`,
        description: 'Aggregation: Shows average rating and count of reviews per package',
      },
      {
        name: 'Booking Status Distribution',
        query: `SELECT status, COUNT(*) as count FROM booking GROUP BY status;`,
        description: 'Aggregation: Shows booking count by status',
      },
      {
        name: 'Total Revenue by Payment Method',
        query: `SELECT payment_method, SUM(amount) as total_revenue 
                FROM payment 
                WHERE payment_status = 'SUCCESS'
                GROUP BY payment_method;`,
        description: 'Aggregation: Revenue breakdown by payment method',
      },
      {
        name: 'Top Hotels by Bookings',
        query: `SELECT h.hotel_name, h.location, COUNT(b.booking_id) as bookings
                FROM hotel h
                LEFT JOIN booking b ON h.hotel_id = b.hotel_id
                GROUP BY h.hotel_id, h.hotel_name, h.location
                ORDER BY bookings DESC
                LIMIT 5;`,
        description: 'Shows most frequently booked hotels',
      },
    ];
  },

  // Execute sample query for demonstration
  async executeDemoQuery(queryName: string) {
    const queries: { [key: string]: string } = {
      'Total Customers': 'SELECT COUNT(*) as total FROM customer;',
      'Total Packages': 'SELECT COUNT(*) as total FROM package;',
      'Total Bookings': 'SELECT COUNT(*) as total FROM booking;',
      'Total Payments': 'SELECT COUNT(*) as total FROM payment;',
      'Total Reviews': 'SELECT COUNT(*) as total FROM review;',
      'Booking Status Distribution': 'SELECT status, COUNT(*) as count FROM booking GROUP BY status;',
      'Popular Destinations': `SELECT d.city, d.country, COUNT(b.booking_id) as bookings
                              FROM destination d
                              LEFT JOIN package p ON d.destination_id = p.destination_id
                              LEFT JOIN booking b ON p.package_id = b.package_id
                              GROUP BY d.destination_id, d.city, d.country
                              ORDER BY bookings DESC LIMIT 5;`,
    };

    const sql = queries[queryName];
    if (!sql) {
      throw new Error('Query not found');
    }

    const result = await query(sql);
    return result.rows;
  },
};
