import { query, getClient } from '../db/connection';
import { Payment } from '../types';
import { generateMockTransactionId } from '../utils/crypto';

export const paymentService = {
  // Get all payments (admin only)
  async getAll() {
    const result = await query(`
      SELECT 
        p.payment_id,
        p.booking_id,
        p.amount,
        p.payment_method,
        p.payment_status,
        p.transaction_id,
        p.created_at,
        b.booking_date,
        c.name as customer_name,
        pk.title as package_title
      FROM payment p
      JOIN booking b ON p.booking_id = b.booking_id
      JOIN customer c ON b.customer_id = c.customer_id
      JOIN package pk ON b.package_id = pk.package_id
      ORDER BY p.created_at DESC
    `);

    return result.rows;
  },

  // Get payment by ID
  async getById(id: number) {
    const result = await query(
      `
      SELECT 
        p.payment_id,
        p.booking_id,
        p.amount,
        p.payment_method,
        p.payment_status,
        p.transaction_id,
        p.created_at,
        b.booking_date,
        c.name as customer_name,
        pk.title as package_title
      FROM payment p
      JOIN booking b ON p.booking_id = b.booking_id
      JOIN customer c ON b.customer_id = c.customer_id
      JOIN package pk ON b.package_id = pk.package_id
      WHERE p.payment_id = $1
    `,
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Payment not found');
    }

    return result.rows[0];
  },

  // Get payments by booking ID
  async getByBookingId(bookingId: number) {
    const result = await query('SELECT * FROM payment WHERE booking_id = $1 ORDER BY created_at DESC', [bookingId]);

    return result.rows;
  },

  // Create payment (simulated - no real payment gateway)
  async create(data: Omit<Payment, 'payment_id' | 'created_at' | 'transaction_id'>) {
    const client = await getClient();

    try {
      await client.query('BEGIN');

      const transactionId = generateMockTransactionId();

      const result = await client.query(
        `INSERT INTO payment (booking_id, amount, payment_method, payment_status, transaction_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [data.booking_id, data.amount, data.payment_method, data.payment_status || 'SUCCESS', transactionId]
      );

      const payment = result.rows[0];

      // Update booking status to CONFIRMED when payment is successful
      if (payment.payment_status === 'SUCCESS') {
        await client.query(
          'UPDATE booking SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE booking_id = $2',
          ['CONFIRMED', data.booking_id]
        );
      }

      await client.query('COMMIT');
      return payment;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Get statistics
  async getStatistics() {
    const result = await query(`
      SELECT 
        COUNT(*) as total_payments,
        COUNT(CASE WHEN payment_status = 'SUCCESS' THEN 1 END) as successful_payments,
        COUNT(CASE WHEN payment_status = 'FAILED' THEN 1 END) as failed_payments,
        COUNT(CASE WHEN payment_status = 'PENDING' THEN 1 END) as pending_payments,
        SUM(CASE WHEN payment_status = 'SUCCESS' THEN amount ELSE 0 END) as total_revenue
      FROM payment
    `);

    return result.rows[0];
  },
};
