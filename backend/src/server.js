import { app } from './app.js';
import { env } from './config/env.js';
import { pool } from './db/pool.js';
import { migrate } from './db/migrate.js';
import { seed } from './db/seed.js';
let server;
async function start() {
  try {
    await pool.query('SELECT 1');
    await migrate();
    await seed();
    server = app.listen(env.port, () => console.log(`API listening on ${env.port}`));
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
}
async function shutdown(signal) {
  console.log(`${signal} received, shutting down`);
  if (server) await new Promise((resolve) => server.close(resolve));
  await pool.end();
  process.exit(0);
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
start();
