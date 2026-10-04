import * as store from '../services/store.service.js';
import { success } from '../utils/response.js';

export async function list(req, res) {
  const result = await store.listForUser(req.validated, req.user.id);

  return success(res, {
    ...result,
    page: req.validated.page,
    limit: req.validated.limit,
  });
}

export async function rate(req, res) {
  const result = await store.submitRating(req.user.id, req.validated.storeId, req.validated.rating);

  return success(res, result, 'Rating submitted.');
}

export async function ownerDashboard(req, res) {
  return success(
    res,
    await store.ownerDashboard(req.user.id, req.validated.sortBy, req.validated.sortOrder)
  );
}
