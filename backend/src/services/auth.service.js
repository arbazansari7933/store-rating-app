import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import * as users from '../repositories/user.repository.js';
import { AppError } from '../utils/AppError.js';

function createToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email, name: user.name },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

export async function login(email, password) {
  const user = await users.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
  }
  return {
    token: createToken(user),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
    },
  };
}

export async function signup(data) {
  const existing = await users.findByEmail(data.email);
  if (existing)
    throw new AppError('An account with this email already exists.', 409, 'EMAIL_EXISTS');
  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await users.createUser({ ...data, passwordHash, role: 'USER' });
  return { token: createToken(user), user };
}

export async function changePassword(userId, currentPassword, newPassword) {
  const user = await users.findAuthById(userId);
  if (!user || !(await bcrypt.compare(currentPassword, user.password_hash))) {
    throw new AppError('Current password is incorrect.', 400, 'INVALID_PASSWORD');
  }
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await users.updatePassword(userId, passwordHash);
}
