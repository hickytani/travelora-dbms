import { query } from '../db/connection';
import { Destination } from '../types';

export const destinationService = {
  // Get all destinations
  async getAll() {
    const result = await query('SELECT * FROM destination ORDER BY city');
    return result.rows;
  },

  // Get destination by ID
  async getById(id: number) {
    const result = await query('SELECT * FROM destination WHERE destination_id = $1', [id]);

    if (result.rows.length === 0) {
      throw new Error('Destination not found');
    }

    return result.rows[0];
  },

  // Search destinations
  async search(filters: { city?: string; country?: string; climate?: string }) {
    let sql = 'SELECT * FROM destination WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (filters.city) {
      sql += ` AND city ILIKE $${paramCount}`;
      params.push(`%${filters.city}%`);
      paramCount++;
    }

    if (filters.country) {
      sql += ` AND country ILIKE $${paramCount}`;
      params.push(`%${filters.country}%`);
      paramCount++;
    }

    if (filters.climate) {
      sql += ` AND climate ILIKE $${paramCount}`;
      params.push(`%${filters.climate}%`);
      paramCount++;
    }

    sql += ' ORDER BY city';
    const result = await query(sql, params);
    return result.rows;
  },

  // Create destination
  async create(data: Omit<Destination, 'destination_id' | 'created_at'>) {
    const result = await query(
      `INSERT INTO destination (city, country, description, climate, best_season)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.city, data.country, data.description || null, data.climate || null, data.best_season || null]
    );

    return result.rows[0];
  },

  // Update destination
  async update(id: number, data: Partial<Omit<Destination, 'destination_id' | 'created_at'>>) {
    const setClause: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (data.city !== undefined) {
      setClause.push(`city = $${paramCount}`);
      params.push(data.city);
      paramCount++;
    }

    if (data.country !== undefined) {
      setClause.push(`country = $${paramCount}`);
      params.push(data.country);
      paramCount++;
    }

    if (data.description !== undefined) {
      setClause.push(`description = $${paramCount}`);
      params.push(data.description);
      paramCount++;
    }

    if (data.climate !== undefined) {
      setClause.push(`climate = $${paramCount}`);
      params.push(data.climate);
      paramCount++;
    }

    if (data.best_season !== undefined) {
      setClause.push(`best_season = $${paramCount}`);
      params.push(data.best_season);
      paramCount++;
    }

    if (setClause.length === 0) {
      throw new Error('No fields to update');
    }

    params.push(id);
    const sql = `UPDATE destination SET ${setClause.join(', ')} WHERE destination_id = $${paramCount} RETURNING *`;

    const result = await query(sql, params);

    if (result.rows.length === 0) {
      throw new Error('Destination not found');
    }

    return result.rows[0];
  },

  // Delete destination
  async delete(id: number) {
    const result = await query('DELETE FROM destination WHERE destination_id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      throw new Error('Destination not found');
    }

    return result.rows[0];
  },
};
