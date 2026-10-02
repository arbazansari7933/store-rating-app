import * as auth from '../services/auth.service.js';
import * as userService from '../services/user.service.js';
import { success } from '../utils/response.js';

export async function login(req, res) {
  const result = await auth.login(req.validated.email, req.validated.password);
  return success(res, result, 'Login successful.');
}

export async function signup(req, res) {
  const result = await auth.signup(req.validated);
  return success(res, result, 'Account created.', 201);
}

export async function me(req, res) {
  return success(res, await userService.profile(req.user.id));
}

export async function changePassword(req, res) {
  await auth.changePassword(req.user.id, req.validated.currentPassword, req.validated.newPassword);
  return success(res, null, 'Password updated.');
}
