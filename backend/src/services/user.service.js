import * as users from '../repositories/user.repository.js';
import { AppError } from '../utils/AppError.js';

export async function profile(userId) {
  const user = await users.findDetailsById(userId);
  if (!user) throw new AppError('User not found.', 404, 'USER_NOT_FOUND');
  return user;
}
