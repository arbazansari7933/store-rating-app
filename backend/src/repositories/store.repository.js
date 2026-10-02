import { query } from '../db/pool.js';

export async function createStore({ name, email, address, ownerId }) {
  const { rows } = await query(
    `INSERT INTO stores (name, email, address, owner_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, address, owner_id, created_at`,
    [name, email, address, ownerId]
  );
  return rows[0];
}

export async function findById(id) {
  const { rows } = await query(
    `SELECT s.id, s.name, s.email, s.address, s.owner_id,
      COALESCE(AVG(r.rating), 0)::numeric(3,2) AS overall_rating,
      COUNT(r.id)::int AS rating_count
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE s.id = $1
     GROUP BY s.id`,
    [id]
  );
  return rows[0] || null;
}

export async function listStores({
  search,
  sortBy = 'name',
  sortOrder = 'asc',
  page = 1,
  limit = 10,
  userId = null,
}) {
  const values = [];
  const conditions = [];
  if (search) {
    values.push(`%${search}%`);
    conditions.push(
      `(s.name ILIKE $${values.length} OR s.email ILIKE $${values.length} OR s.address ILIKE $${values.length})`
    );
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const allowed = {
    name: 's.name',
    email: 's.email',
    address: 's.address',
    overall_rating: 'overall_rating',
  };
  const order = allowed[sortBy] || allowed.name;
  const offset = (page - 1) * limit;
  const count = await query(`SELECT COUNT(*)::int AS total FROM stores s ${where}`, values);
  const dataValues = [...values, userId, limit, offset];
  const { rows } = await query(
    `SELECT s.id, s.name, s.email, s.address,
      COALESCE(AVG(r.rating), 0)::numeric(3,2) AS overall_rating,
      COUNT(r.id)::int AS rating_count,
      ur.rating AS user_rating
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = $${dataValues.length - 2}
     ${where}
     GROUP BY s.id, ur.rating
     ORDER BY ${order} ${sortOrder === 'desc' ? 'DESC' : 'ASC'}
     LIMIT $${dataValues.length - 1} OFFSET $${dataValues.length}`,
    dataValues
  );
  return { rows, total: count.rows[0].total };
}

export async function findOwnedStores(ownerId) {
  const { rows } = await query(
    `SELECT s.id, s.name, s.email, s.address,
      COALESCE(AVG(r.rating), 0)::numeric(3,2) AS average_rating,
      COUNT(r.id)::int AS rating_count
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE s.owner_id = $1
     GROUP BY s.id
     ORDER BY s.name ASC`,
    [ownerId]
  );
  return rows;
}
