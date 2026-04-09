import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL;

/**
 * Initialize Postgres client.
 * For localhost, we disable SSL. For hosted services like Neon/Supabase, 
 * we use rejectUnauthorized: false to allow self-signed certificates.
 */
const isLocal = DATABASE_URL?.includes('localhost') || DATABASE_URL?.includes('127.0.0.1');

const sql = DATABASE_URL 
  ? postgres(DATABASE_URL, {
      ssl: isLocal ? false : { rejectUnauthorized: false },
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