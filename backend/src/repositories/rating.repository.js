import { query } from '../db/pool.js';

export async function upsertRating({ userId, storeId, rating }) {
  const { rows } = await query(
    `INSERT INTO ratings (user_id, store_id, rating)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, store_id)
     DO UPDATE SET
       rating = EXCLUDED.rating,
       updated_at = NOW()
     RETURNING id, user_id, store_id, rating, updated_at`,
    [userId, storeId, rating]
  );

  return rows[0];
}

export async function findByStoreForOwner(
  ownerId,
  sortBy = 'updated_at',
  sortOrder = 'desc'
) {
  const allowed = {
    store_name: 's.name',
    user_name: 'u.name',
    email: 'u.email',
    rating: 'r.rating',
    updated_at: 'r.updated_at',
  };

  const order = allowed[sortBy] || allowed.updated_at;
  const direction = sortOrder === 'asc' ? 'ASC' : 'DESC';

  const { rows } = await query(
    `
    SELECT
      s.id AS store_id,
      s.name AS store_name,
      u.id AS user_id,
      u.name AS user_name,
      u.email,
      u.address,
      r.rating,
      r.updated_at
    FROM stores s
    JOIN ratings r ON r.store_id = s.id
    JOIN users u ON u.id = r.user_id
    WHERE s.owner_id = $1
    ORDER BY ${order} ${direction}
    `,
    [ownerId]
  );

  return rows;
}