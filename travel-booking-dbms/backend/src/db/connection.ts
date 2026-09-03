import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'my-worldos-password-123',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'travelora_db',
});

pool.on('error', (err) => {
  console.error('Unexpected pool error:', err);
});

pool.on('connect', () => {
  console.log('✓ Database connection established');
});

export const query = (text: string, params?: any[]): Promise<QueryResult> => {
  return pool.query(text, params);
};

export const getClient = async () => {
  return await pool.connect();
};

export default pool;
