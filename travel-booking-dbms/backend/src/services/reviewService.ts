import { query } from '../db/connection';
import { Review, ReviewWithDetails } from '../types';

export const reviewService = {
  // Get all reviews with details (JOIN)
  async getAll() {
    const result = await query(`
      SELECT 
        r.review_id,
        r.customer_id,
        r.package_id,
        r.rating,
        r.comment,
        r.date,
        c.name as customer_name,
        c.email as customer_email,
        p.title as package_title,
        p.price as package_price,
        d.city as destination_city,
        d.country as destination_country
      FROM review r
      JOIN customer c ON r.customer_id = c.customer_id
      JOIN package p ON r.package_id = p.package_id
      JOIN destination d ON p.destination_id = d.destination_id
      ORDER BY r.date DESC
    `);

    return result.rows;
  },

  // Get review by ID
  async getById(id: number) {
    const result = await query(
      `
      SELECT 
        r.review_id,
        r.customer_id,
        r.package_id,
        r.rating,
        r.comment,
        r.date,
        c.name as customer_name,
        p.title as package_title
      FROM review r
      JOIN customer c ON r.customer_id = c.customer_id
      JOIN package p ON r.package_id = p.package_id
      WHERE r.review_id = $1
    `,
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Review not found');
    }

    return result.rows[0];
  },

  // Get reviews for a package
  async getByPackageId(packageId: number) {
    const result = await query(
      `
      SELECT 
        r.review_id,
        r.customer_id,
        r.package_id,
        r.rating,
        r.comment,
        r.date,
        c.name as customer_name,
        c.email as customer_email
      FROM review r
      JOIN customer c ON r.customer_id = c.customer_id
      WHERE r.package_id = $1
      ORDER BY r.date DESC
    `,
      [packageId]
    );

    return result.rows;
  },

  // Get reviews by customer
  async getByCustomerId(customerId: number) {
    const result = await query(
      `
      SELECT 
        r.review_id,
        r.customer_id,
        r.package_id,
        r.rating,
        r.comment,
        r.date,
        p.title as package_title,
        d.city as destination_city
      FROM review r
      JOIN package p ON r.package_id = p.package_id
      JOIN destination d ON p.destination_id = d.destination_id
      WHERE r.customer_id = $1
      ORDER BY r.date DESC
    `,
      [customerId]
    );

    return result.rows;
  },

  // Create review
  async create(data: Omit<Review, 'review_id'>) {
    const result = await query(
      `INSERT INTO review (customer_id, package_id, rating, comment, date)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       RETURNING *`,
      [data.customer_id, data.package_id, data.rating, data.comment || null]
    );

    return result.rows[0];
  },

  // Delete review
  async delete(id: number) {
    const result = await query('DELETE FROM review WHERE review_id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      throw new Error('Review not found');
    }

    return result.rows[0];
  },

  // Get average rating for a package
  async getPackageAverageRating(packageId: number) {
    const result = await query(
      `
      SELECT 
        AVG(rating)::DECIMAL(3,2) as average_rating,
        COUNT(*) as total_reviews
      FROM review
      WHERE package_id = $1
    `,
      [packageId]
    );

    return result.rows[0];
  },

  // Get top rated packages
  async getTopRatedPackages(limit: number = 5) {
    const result = await query(
      `
      SELECT 
        p.package_id,
        p.title,
        p.price,
        d.city,
        d.country,
        AVG(r.rating)::DECIMAL(3,2) as average_rating,
        COUNT(r.review_id) as total_reviews
      FROM package p
      JOIN destination d ON p.destination_id = d.destination_id
      LEFT JOIN review r ON p.package_id = r.package_id
      GROUP BY p.package_id, p.title, p.price, d.city, d.country
      ORDER BY average_rating DESC, total_reviews DESC
      LIMIT $1
    `,
      [limit]
    );

    return result.rows;
  },
};
