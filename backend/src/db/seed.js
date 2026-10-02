import bcrypt from 'bcryptjs';
import { query } from './pool.js';

const users = [
  [
    'System Administrator Account',
    'admin@roxiler.demo',
    'Admin@123',
    'Bhopal, Madhya Pradesh',
    'ADMIN',
  ],
  ['Roxiler Store Owner Account', 'owner@roxiler.demo', 'Owner@123', 'Pune, Maharashtra', 'OWNER'],
  [
    'Normal Platform User Account',
    'user@roxiler.demo',
    'User@123',
    'Bhopal, Madhya Pradesh',
    'USER',
  ],
  [
    'Second Platform User Account',
    'user2@roxiler.demo',
    'User@123',
    'Indore, Madhya Pradesh',
    'USER',
  ],
  [
    'Third Platform User Account',
    'user3@roxiler.demo',
    'User@123',
    'Jabalpur, Madhya Pradesh',
    'USER',
  ],
];

export async function seed() {
  const ids = {};

  for (const [name, email, password, address, role] of users) {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await query(
      `INSERT INTO users (name, email, password_hash, address, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE SET
         name = EXCLUDED.name,
         address = EXCLUDED.address,
         role = EXCLUDED.role
       RETURNING id`,
      [name, email, passwordHash, address, role]
    );
    ids[email] = result.rows[0].id;
  }

  const stores = [
    ['Roxiler Demo Store', 'store@roxiler.demo', 'Pune, Maharashtra', ids['owner@roxiler.demo']],
    [
      'Central Market Electronics',
      'central@roxiler.demo',
      'Bhopal, Madhya Pradesh',
      ids['owner@roxiler.demo'],
    ],
    ['Lakeview Home Supplies', 'lakeview@roxiler.demo', 'Indore, Madhya Pradesh', null],
  ];

  const storeIds = {};
  for (const [name, email, address, ownerId] of stores) {
    const result = await query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE SET
         name = EXCLUDED.name,
         address = EXCLUDED.address,
         owner_id = EXCLUDED.owner_id
       RETURNING id`,
      [name, email, address, ownerId]
    );
    storeIds[email] = result.rows[0].id;
  }

  const demoRatings = [
    [ids['user@roxiler.demo'], storeIds['store@roxiler.demo'], 5],
    [ids['user2@roxiler.demo'], storeIds['store@roxiler.demo'], 4],
    [ids['user3@roxiler.demo'], storeIds['store@roxiler.demo'], 5],
    [ids['user@roxiler.demo'], storeIds['central@roxiler.demo'], 4],
    [ids['user2@roxiler.demo'], storeIds['central@roxiler.demo'], 3],
  ];

  for (const [userId, storeId, rating] of demoRatings) {
    await query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, store_id) DO UPDATE SET rating = EXCLUDED.rating, updated_at = NOW()`,
      [userId, storeId, rating]
    );
  }
}
