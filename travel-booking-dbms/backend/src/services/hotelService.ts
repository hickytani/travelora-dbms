import { query } from '../db/connection';
import { Hotel } from '../types';

export const hotelService = {
  // Get all hotels
  async getAll() {
    const result = await query('SELECT * FROM hotel ORDER BY hotel_name');
    return result.rows;
  },

  // Get hotel by ID
  async getById(id: number) {
    const result = await query('SELECT * FROM hotel WHERE hotel_id = $1', [id]);

    if (result.rows.length === 0) {
      throw new Error('Hotel not found');
    }

    return result.rows[0];
  },

  // Search hotels
  async search(filters: { hotel_name?: string; location?: string; minRating?: number }) {
    let sql = 'SELECT * FROM hotel WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (filters.hotel_name) {
      sql += ` AND hotel_name ILIKE $${paramCount}`;
      params.push(`%${filters.hotel_name}%`);
      paramCount++;
    }

    if (filters.location) {
      sql += ` AND location ILIKE $${paramCount}`;
      params.push(`%${filters.location}%`);
      paramCount++;
    }

    if (filters.minRating) {
      sql += ` AND rating >= $${paramCount}`;
      params.push(filters.minRating);
      paramCount++;
    }

    sql += ' ORDER BY rating DESC';
    const result = await query(sql, params);
    return result.rows;
  },

  // Create hotel
  async create(data: Omit<Hotel, 'hotel_id' | 'created_at'>) {
    const result = await query(
      `INSERT INTO hotel (hotel_name, rating, location, price_per_night)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.hotel_name, data.rating || null, data.location || null, data.price_per_night]
    );

    return result.rows[0];
  },

  // Update hotel
  async update(id: number, data: Partial<Omit<Hotel, 'hotel_id' | 'created_at'>>) {
    const setClause: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (data.hotel_name !== undefined) {
      setClause.push(`hotel_name = $${paramCount}`);
      params.push(data.hotel_name);
      paramCount++;
    }

    if (data.rating !== undefined) {
      setClause.push(`rating = $${paramCount}`);
      params.push(data.rating);
      paramCount++;
    }

    if (data.location !== undefined) {
      setClause.push(`location = $${paramCount}`);
      params.push(data.location);
      paramCount++;
    }

    if (data.price_per_night !== undefined) {
      setClause.push(`price_per_night = $${paramCount}`);
      params.push(data.price_per_night);
      paramCount++;
    }

    if (setClause.length === 0) {
      throw new Error('No fields to update');
    }

    params.push(id);
    const sql = `UPDATE hotel SET ${setClause.join(', ')} WHERE hotel_id = $${paramCount} RETURNING *`;

    const result = await query(sql, params);

    if (result.rows.length === 0) {
      throw new Error('Hotel not found');
    }

    return result.rows[0];
  },

  // Delete hotel
  async delete(id: number) {
    const result = await query('DELETE FROM hotel WHERE hotel_id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      throw new Error('Hotel not found');
    }

    return result.rows[0];
  },
};
