import { query } from '../db/pool.js';

export async function getStats() {
  const { rows } = await query(`
    SELECT
      (SELECT COUNT(*)::int FROM users) AS total_users,
      (SELECT COUNT(*)::int FROM stores) AS total_stores,
      (SELECT COUNT(*)::int FROM ratings) AS total_ratings`);
  return rows[0];
}
