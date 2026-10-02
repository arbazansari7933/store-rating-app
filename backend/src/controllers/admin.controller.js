import * as admin from '../services/admin.service.js';
import * as userService from '../services/user.service.js';
import { success } from '../utils/response.js';

export async function stats(req, res) {
  return success(res, await admin.getStats());
}

export async function users(req, res) {
  const result = await admin.listUsers(req.validated);
  return success(res, { ...result, page: req.validated.page, limit: req.validated.limit });
}

export async function userDetails(req, res) {
  return success(res, await userService.profile(req.params.id));
}

export async function createUser(req, res) {
  return success(res, await admin.createUser(req.validated), 'User created.', 201);
}

export async function stores(req, res) {
  const result = await admin.listStores({ ...req.validated, userId: null });
  return success(res, { ...result, page: req.validated.page, limit: req.validated.limit });
}

export async function createStore(req, res) {
  return success(res, await admin.createStore(req.validated), 'Store created.', 201);
}
