import { query } from '../db/connection';
import { Package, PackageWithDestination } from '../types';

export const packageService = {
  // Get all packages with destination names (demonstrates JOIN)
  async getAll() {
    const result = await query(`
      SELECT 
        p.package_id,
        p.title,
        p.duration,
        p.price,
        p.category,
        p.destination_id,
        p.admin_id,
        p.created_at,
        d.city,
        d.country,
        d.description as destination_description
      FROM package p
      JOIN destination d ON p.destination_id = d.destination_id
      ORDER BY p.title
    `);

    return result.rows;
  },

  // Get package by ID with destination
  async getById(id: number) {
    const result = await query(
      `
      SELECT 
        p.package_id,
        p.title,
        p.duration,
        p.price,
        p.category,
        p.destination_id,
        p.admin_id,
        p.created_at,
        d.city,
        d.country,
        d.description as destination_description,
        d.climate,
        d.best_season
      FROM package p
      JOIN destination d ON p.destination_id = d.destination_id
      WHERE p.package_id = $1
    `,
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Package not found');
    }

    return result.rows[0];
  },

  // Search packages
  async search(filters: { title?: string; category?: string; destination_id?: number; minPrice?: number; maxPrice?: number }) {
    let sql = `
      SELECT 
        p.package_id,
        p.title,
        p.duration,
        p.price,
        p.category,
        p.destination_id,
        p.created_at,
        d.city,
        d.country
      FROM package p
      JOIN destination d ON p.destination_id = d.destination_id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 1;

    if (filters.title) {
      sql += ` AND p.title ILIKE $${paramCount}`;
      params.push(`%${filters.title}%`);
      paramCount++;
    }

    if (filters.category) {
      sql += ` AND p.category = $${paramCount}`;
      params.push(filters.category);
      paramCount++;
    }

    if (filters.destination_id) {
      sql += ` AND p.destination_id = $${paramCount}`;
      params.push(filters.destination_id);
      paramCount++;
    }

    if (filters.minPrice !== undefined) {
      sql += ` AND p.price >= $${paramCount}`;
      params.push(filters.minPrice);
      paramCount++;
    }

    if (filters.maxPrice !== undefined) {
      sql += ` AND p.price <= $${paramCount}`;
      params.push(filters.maxPrice);
      paramCount++;
    }

    sql += ' ORDER BY p.price';
    const result = await query(sql, params);
    return result.rows;
  },

  // Create package
  async create(data: Omit<Package, 'package_id' | 'created_at'>) {
    const result = await query(
      `INSERT INTO package (title, duration, price, category, destination_id, admin_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [data.title, data.duration, data.price, data.category || null, data.destination_id, data.admin_id]
    );

    return result.rows[0];
  },

  // Update package
  async update(id: number, data: Partial<Omit<Package, 'package_id' | 'created_at'>>) {
    const setClause: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (data.title !== undefined) {
      setClause.push(`title = $${paramCount}`);
      params.push(data.title);
      paramCount++;
    }

    if (data.duration !== undefined) {
      setClause.push(`duration = $${paramCount}`);
      params.push(data.duration);
      paramCount++;
    }

    if (data.price !== undefined) {
      setClause.push(`price = $${paramCount}`);
      params.push(data.price);
      paramCount++;
    }

    if (data.category !== undefined) {
      setClause.push(`category = $${paramCount}`);
      params.push(data.category);
      paramCount++;
    }

    if (data.destination_id !== undefined) {
      setClause.push(`destination_id = $${paramCount}`);
      params.push(data.destination_id);
      paramCount++;
    }

    if (data.admin_id !== undefined) {
      setClause.push(`admin_id = $${paramCount}`);
      params.push(data.admin_id);
      paramCount++;
    }

    if (setClause.length === 0) {
      throw new Error('No fields to update');
    }

    params.push(id);
    const sql = `UPDATE package SET ${setClause.join(', ')} WHERE package_id = $${paramCount} RETURNING *`;

    const result = await query(sql, params);

    if (result.rows.length === 0) {
      throw new Error('Package not found');
    }

    return result.rows[0];
  },

  // Delete package
  async delete(id: number) {
    const result = await query('DELETE FROM package WHERE package_id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      throw new Error('Package not found');
    }

    return result.rows[0];
  },

  // Get packages by destination (demonstrates JOIN)
  async getByDestination(destinationId: number) {
    const result = await query(
      `
      SELECT 
        p.package_id,
        p.title,
        p.duration,
        p.price,
        p.category,
        p.destination_id,
        d.city,
        d.country
      FROM package p
      JOIN destination d ON p.destination_id = d.destination_id
      WHERE p.destination_id = $1
      ORDER BY p.price
    `,
      [destinationId]
    );

    return result.rows;
  },
};
