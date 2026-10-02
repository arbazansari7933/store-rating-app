import pg from 'pg';
import { env } from '../config/env.js';
const { Pool } = pg;
export const pool = new Pool({
  connectionString: env.databaseUrl,
  max: 15,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});
pool.on('error', (error) => console.error('Unexpected PostgreSQL pool error:', error));
export const query = (text, params) => pool.query(text, params);
