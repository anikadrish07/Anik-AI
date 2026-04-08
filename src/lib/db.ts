
import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL;

/**
 * Initialize Postgres client lazily and safely.
 * rejectUnauthorized: false is often required for hosted databases like Neon/Supabase 
 * when connecting from certain cloud environments.
 */
const sql = DATABASE_URL 
  ? postgres(DATABASE_URL, {
      ssl: { rejectUnauthorized: false },
      max: 10,
      connect_timeout: 10,
    }) 
  : null;

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
