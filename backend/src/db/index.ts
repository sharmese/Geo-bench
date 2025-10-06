import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function initializeDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined.');
  }

  console.log('--- Database: Starting connection and initialization... ---');

  try {
    await pool.query('SELECT 1');
    console.log('Database: Connection successful.');

    await pool.query('CREATE EXTENSION IF NOT EXISTS postgis;');
    console.log('Database: PostGIS extension ensured.');

    const userTableSql = `
      CREATE TABLE IF NOT EXISTS "users" (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(userTableSql);
    console.log('Database: Table "user" ensured.');

    const markerTableSql = `
      CREATE TABLE IF NOT EXISTS "marker" (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES "users"(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          -- ГЕОПРОСТРАНСТВЕННОЕ ПОЛЕ
          location GEOMETRY('Point', 4326) NOT NULL, 
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS marker_gix ON "marker" USING GIST (location);
    `;
    await pool.query(markerTableSql);
    console.log('Database: Table "marker" ensured.');
    console.log('--- Database initialization finished successfully. ---');
  } catch (err) {
    console.error('--- FATAL: Database initialization failed ---', err);
    throw new Error('Database initialization failed.');
  }
}
