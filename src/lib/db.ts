
import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL!;

if (!DATABASE_URL) {
  console.warn('DATABASE_URL is not defined. PostgreSQL functionality will be unavailable.');
}

const sql = postgres(DATABASE_URL, {
  ssl: 'require',
  max: 10,
});

export default sql;

/**
 * Expected SQL Schema:
 * 
 * CREATE TABLE IF NOT EXISTS users (
 *   id SERIAL PRIMARY KEY,
 *   email TEXT UNIQUE NOT NULL,
 *   password TEXT NOT NULL,
 *   name TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
 * );
 */
