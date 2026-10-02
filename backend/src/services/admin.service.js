import bcrypt from 'bcryptjs';
import * as users from '../repositories/user.repository.js';
import * as stores from '../repositories/store.repository.js';
import * as dashboard from '../repositories/dashboard.repository.js';
import { AppError } from '../utils/AppError.js';

export async function getStats() {
  return dashboard.getStats();
}

export async function listUsers(filters) {
  return users.listUsers(filters);
}

export async function createUser(data) {
  if (await users.findByEmail(data.email))
    throw new AppError('An account with this email already exists.', 409, 'EMAIL_EXISTS');
  const passwordHash = await bcrypt.hash(data.password, 10);
  return users.createUser({ ...data, passwordHash });
}

export async function listStores(filters) {
  return stores.listStores(filters);
}

export async function createStore(data) {
  if (data.ownerId) {
    const owner = await users.findById(data.ownerId);
    if (!owner || owner.role !== 'OWNER')
      throw new AppError('Selected owner must be a valid store owner.', 400, 'INVALID_OWNER');
  }
  return stores.createStore(data);
}
