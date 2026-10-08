import { query, getClient } from '../db/connection';
import { Booking, BookingWithDetails } from '../types';

export const bookingService = {
  // Get all bookings with details (complex JOIN)
  async getAll() {
    const result = await query(`
      SELECT 
        b.booking_id,
        b.booking_date,
        b.status,
        b.customer_id,
        b.package_id,
        b.hotel_id,
        b.flight_id,
        b.admin_id,
        b.created_at,
        b.updated_at,
        c.name as customer_name,
        c.email as customer_email,
        p.title as package_title,
        p.price as package_price,
        d.city as destination_city,
        d.country as destination_country,
        h.hotel_name,
        h.price_per_night as hotel_price,
        f.airline,
        f.departure as flight_departure,
        f.arrival as flight_arrival
      FROM booking b
      JOIN customer c ON b.customer_id = c.customer_id
      JOIN package p ON b.package_id = p.package_id
      JOIN destination d ON p.destination_id = d.destination_id
      JOIN hotel h ON b.hotel_id = h.hotel_id
      JOIN flight f ON b.flight_id = f.flight_id
      ORDER BY b.created_at DESC
    `);

    return result.rows;
  },

  // Get booking by ID with details
  async getById(id: number) {
    const result = await query(
      `
      SELECT 
        b.booking_id,
        b.booking_date,
        b.status,
        b.customer_id,
        b.package_id,
        b.hotel_id,
        b.flight_id,
        b.admin_id,
        b.created_at,
        b.updated_at,
        c.name as customer_name,
        c.email as customer_email,
        p.title as package_title,
        p.duration as package_duration,
        p.price as package_price,
        p.category as package_category,
        d.city as destination_city,
        d.country as destination_country,
        h.hotel_name,
        h.rating as hotel_rating,
        h.location as hotel_location,
        h.price_per_night as hotel_price,
        f.airline,
        f.departure as flight_departure,
        f.arrival as flight_arrival,
        f.departure_time,
        f.arrival_time
      FROM booking b
      JOIN customer c ON b.customer_id = c.customer_id
      JOIN package p ON b.package_id = p.package_id
      JOIN destination d ON p.destination_id = d.destination_id
      JOIN hotel h ON b.hotel_id = h.hotel_id
      JOIN flight f ON b.flight_id = f.flight_id
      WHERE b.booking_id = $1
    `,
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Booking not found');
    }

    return result.rows[0];
  },

  // Get customer bookings with details
  async getCustomerBookings(customerId: number) {
    const result = await query(
      `
      SELECT 
        b.booking_id,
        b.booking_date,
        b.status,
        b.customer_id,
        b.package_id,
        b.hotel_id,
        b.flight_id,
        b.admin_id,
        b.created_at,
        b.updated_at,
        c.name as customer_name,
        p.title as package_title,
        p.price as package_price,
        d.city as destination_city,
        d.country as destination_country,
        h.hotel_name,
        f.airline
      FROM booking b
      JOIN customer c ON b.customer_id = c.customer_id
      JOIN package p ON b.package_id = p.package_id
      JOIN destination d ON p.destination_id = d.destination_id
      JOIN hotel h ON b.hotel_id = h.hotel_id
      JOIN flight f ON b.flight_id = f.flight_id
      WHERE b.customer_id = $1
      ORDER BY b.created_at DESC
    `,
      [customerId]
    );

    return result.rows;
  },

  // Create booking with transaction
  async create(data: Omit<Booking, 'booking_id' | 'created_at' | 'updated_at'>) {
    const client = await getClient();

    try {
      await client.query('BEGIN');

      const result = await client.query(
        `INSERT INTO booking (booking_date, status, customer_id, package_id, hotel_id, flight_id, admin_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [data.booking_date, data.status, data.customer_id, data.package_id, data.hotel_id, data.flight_id, data.admin_id]
      );

      const booking = result.rows[0];

      await client.query('COMMIT');
      return booking;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Update booking status
  async updateStatus(id: number, status: string) {
    const result = await query(
      'UPDATE booking SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE booking_id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      throw new Error('Booking not found');
    }

    return result.rows[0];
  },

  // Cancel booking
  async cancel(id: number, customerId?: number) {
    if (customerId === undefined) {
      return this.updateStatus(id, 'CANCELLED');
    }

    const result = await query(
      `UPDATE booking
       SET status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP
       WHERE booking_id = $1 AND customer_id = $2
       RETURNING *`,
      [id, customerId]
    );

    if (result.rows.length === 0) {
      throw new Error('Booking not found');
    }

    return result.rows[0];
  },

  // Get booking count by status
  async getStatusCount() {
    const result = await query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM booking
      GROUP BY status
    `);

    return result.rows;
  },

  // Get total revenue
  async getTotalRevenue() {
    const result = await query(`
      SELECT 
        SUM(p.amount) as total_revenue,
        COUNT(p.payment_id) as total_payments
      FROM payment p
      WHERE p.payment_status = 'SUCCESS'
    `);

    return result.rows[0];
  },
};
