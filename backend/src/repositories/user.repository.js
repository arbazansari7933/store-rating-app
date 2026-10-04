import { query } from '../db/pool.js';

export async function findByEmail(email) {
  const { rows } = await query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
  return rows[0] || null;
}

export async function findById(id) {
  const { rows } = await query('SELECT id, name, email, address, role, created_at FROM users WHERE id = $1 LIMIT 1', [id]);
  return rows[0] || null;
}

export async function findAuthById(id) {
  const { rows } = await query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
  return rows[0] || null;
}

export async function findDetailsById(id) {
  const { rows } = await query(`
    SELECT u.id, u.name, u.email, u.address, u.role, u.created_at,
      COALESCE(AVG(CASE WHEN s.owner_id = u.id THEN r.rating END), 0)::numeric(3,2) AS owner_rating
    FROM users u
    LEFT JOIN stores s ON s.owner_id = u.id
    LEFT JOIN ratings r ON r.store_id = s.id
    WHERE u.id = $1
    GROUP BY u.id`, [id]);
  return rows[0] || null;
}

export async function createUser({ name, email, passwordHash, address, role }) {
  const { rows } = await query(
    `INSERT INTO users (name, email, password_hash, address, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, address, role, created_at`,
    [name, email, passwordHash, address, role]
  );
  return rows[0];
}

export async function updatePassword(id, passwordHash) {
  await query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [passwordHash, id]);
}

export async function listUsers({ search, name, email, address, role, sortBy, sortOrder, page, limit }) {
  const values = [];
  const conditions = [];
  if (search) {
    values.push(`%${search}%`);
    conditions.push(`(u.name ILIKE $${values.length} OR u.email ILIKE $${values.length} OR u.address ILIKE $${values.length})`);
  }
  if (name) {
    values.push(`%${name}%`);
    conditions.push(`u.name ILIKE $${values.length}`);
  }
  if (email) {
    values.push(`%${email}%`);
    conditions.push(`u.email ILIKE $${values.length}`);
  }
  if (address) {
    values.push(`%${address}%`);
    conditions.push(`u.address ILIKE $${values.length}`);
  }
  if (role && ['ADMIN', 'USER', 'OWNER'].includes(role)) {
    values.push(role);
    conditions.push(`u.role = $${values.length}`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const allowed = { name: 'u.name', email: 'u.email', address: 'u.address', role: 'u.role', created_at: 'u.created_at' };
  const order = allowed[sortBy] || allowed.created_at;
  const offset = (page - 1) * limit;

  const count = await query(`SELECT COUNT(*)::int AS total FROM users u ${where}`, values);
  const dataValues = [...values, limit, offset];
  const { rows } = await query(
    `SELECT u.id, u.name, u.email, u.address, u.role, u.created_at,
      COALESCE(AVG(CASE WHEN s.owner_id = u.id THEN r.rating END), 0)::numeric(3,2) AS owner_rating
     FROM users u
     LEFT JOIN stores s ON s.owner_id = u.id
     LEFT JOIN ratings r ON r.store_id = s.id
     ${where}
     GROUP BY u.id
     ORDER BY ${order} ${sortOrder === 'desc' ? 'DESC' : 'ASC'}
     LIMIT $${dataValues.length - 1} OFFSET $${dataValues.length}`,
    dataValues
  );
  return { rows, total: count.rows[0].total };
}