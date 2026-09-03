import { query } from '../db/connection';
import { Flight } from '../types';

export const flightService = {
  // Get all flights
  async getAll() {
    const result = await query('SELECT * FROM flight ORDER BY airline');
    return result.rows;
  },

  // Get flight by ID
  async getById(id: number) {
    const result = await query('SELECT * FROM flight WHERE flight_id = $1', [id]);

    if (result.rows.length === 0) {
      throw new Error('Flight not found');
    }

    return result.rows[0];
  },

  // Search flights
  async search(filters: { airline?: string; departure?: string; arrival?: string }) {
    let sql = 'SELECT * FROM flight WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (filters.airline) {
      sql += ` AND airline ILIKE $${paramCount}`;
      params.push(`%${filters.airline}%`);
      paramCount++;
    }

    if (filters.departure) {
      sql += ` AND departure ILIKE $${paramCount}`;
      params.push(`%${filters.departure}%`);
      paramCount++;
    }

    if (filters.arrival) {
      sql += ` AND arrival ILIKE $${paramCount}`;
      params.push(`%${filters.arrival}%`);
      paramCount++;
    }

    sql += ' ORDER BY airline';
    const result = await query(sql, params);
    return result.rows;
  },

  // Create flight
  async create(data: Omit<Flight, 'flight_id' | 'created_at'>) {
    const result = await query(
      `INSERT INTO flight (airline, departure, arrival, departure_time, arrival_time)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.airline, data.departure, data.arrival, data.departure_time || null, data.arrival_time || null]
    );

    return result.rows[0];
  },

  // Update flight
  async update(id: number, data: Partial<Omit<Flight, 'flight_id' | 'created_at'>>) {
    const setClause: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (data.airline !== undefined) {
      setClause.push(`airline = $${paramCount}`);
      params.push(data.airline);
      paramCount++;
    }

    if (data.departure !== undefined) {
      setClause.push(`departure = $${paramCount}`);
      params.push(data.departure);
      paramCount++;
    }

    if (data.arrival !== undefined) {
      setClause.push(`arrival = $${paramCount}`);
      params.push(data.arrival);
      paramCount++;
    }

    if (data.departure_time !== undefined) {
      setClause.push(`departure_time = $${paramCount}`);
      params.push(data.departure_time);
      paramCount++;
    }

    if (data.arrival_time !== undefined) {
      setClause.push(`arrival_time = $${paramCount}`);
      params.push(data.arrival_time);
      paramCount++;
    }

    if (setClause.length === 0) {
      throw new Error('No fields to update');
    }

    params.push(id);
    const sql = `UPDATE flight SET ${setClause.join(', ')} WHERE flight_id = $${paramCount} RETURNING *`;

    const result = await query(sql, params);

    if (result.rows.length === 0) {
      throw new Error('Flight not found');
    }

    return result.rows[0];
  },

  // Delete flight
  async delete(id: number) {
    const result = await query('DELETE FROM flight WHERE flight_id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      throw new Error('Flight not found');
    }

    return result.rows[0];
  },
};
