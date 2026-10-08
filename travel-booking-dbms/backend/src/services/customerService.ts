import { query } from '../db/connection';
import { Customer } from '../types';

export const customerService = {
  // Get all customers (admin only)
  async getAll() {
    const result = await query(
      'SELECT customer_id, name, email, phone, address, passport_no, created_at FROM customer ORDER BY created_at DESC'
    );

    return result.rows;
  },

  // Get customer by ID
  async getById(id: number) {
    const result = await query(
      'SELECT customer_id, name, email, phone, address, passport_no, created_at FROM customer WHERE customer_id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Customer not found');
    }

    return result.rows[0];
  },

  // Search customers
  async search(filters: { name?: string; email?: string; phone?: string }) {
    let sql = 'SELECT customer_id, name, email, phone, address, passport_no, created_at FROM customer WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (filters.name) {
      sql += ` AND name ILIKE $${paramCount}`;
      params.push(`%${filters.name}%`);
      paramCount++;
    }

    if (filters.email) {
      sql += ` AND email ILIKE $${paramCount}`;
      params.push(`%${filters.email}%`);
      paramCount++;
    }

    if (filters.phone) {
      sql += ` AND phone ILIKE $${paramCount}`;
      params.push(`%${filters.phone}%`);
      paramCount++;
    }

    sql += ' ORDER BY created_at DESC';
    const result = await query(sql, params);
    return result.rows;
  },

  // Update customer
  async update(id: number, data: Partial<Omit<Customer, 'customer_id' | 'password' | 'email' | 'created_at'>>) {
    const setClause: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      setClause.push(`name = $${paramCount}`);
      params.push(data.name);
      paramCount++;
    }

    if (data.phone !== undefined) {
      setClause.push(`phone = $${paramCount}`);
      params.push(data.phone);
      paramCount++;
    }

    if (data.address !== undefined) {
      setClause.push(`address = $${paramCount}`);
      params.push(data.address);
      paramCount++;
    }

    if (data.passport_no !== undefined) {
      setClause.push(`passport_no = $${paramCount}`);
      params.push(data.passport_no);
      paramCount++;
    }

    if (setClause.length === 0) {
      throw new Error('No fields to update');
    }

    params.push(id);
    const sql = `UPDATE customer SET ${setClause.join(', ')} WHERE customer_id = $${paramCount} RETURNING customer_id, name, email, phone, address, passport_no, created_at`;

    const result = await query(sql, params);

    if (result.rows.length === 0) {
      throw new Error('Customer not found');
    }

    return result.rows[0];
  },

  // Delete customer
  async delete(id: number) {
    const result = await query(
      'DELETE FROM customer WHERE customer_id = $1 RETURNING customer_id, name, email',
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Customer not found');
    }

    return result.rows[0];
  },

  // Get customer count
  async getCount() {
    const result = await query('SELECT COUNT(*) as count FROM customer');
    return result.rows[0].count;
  },

  // Get customer statistics
  async getStatistics() {
    const result = await query(`
      SELECT 
        COUNT(DISTINCT c.customer_id) as total_customers,
        COUNT(DISTINCT b.customer_id) as customers_with_bookings,
        COUNT(DISTINCT r.customer_id) as customers_with_reviews
      FROM customer c
      LEFT JOIN booking b ON c.customer_id = b.customer_id
      LEFT JOIN review r ON c.customer_id = r.customer_id
    `);

    return result.rows[0];
  },
};
