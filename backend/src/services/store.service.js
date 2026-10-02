import * as stores from '../repositories/store.repository.js';
import * as ratings from '../repositories/rating.repository.js';
import { AppError } from '../utils/AppError.js';

export async function listForUser(filters, userId) {
  return stores.listStores({ ...filters, userId });
}

export async function submitRating(userId, storeId, rating) {
  const store = await stores.findById(storeId);

  if (!store) {
    throw new AppError(
      'Store not found.',
      404,
      'STORE_NOT_FOUND'
    );
  }

  return ratings.upsertRating({
    userId,
    storeId,
    rating,
  });
}

export async function ownerDashboard(
  ownerId,
  sortBy = 'updated_at',
  sortOrder = 'desc'
) {
  const ownedStores = await stores.findOwnedStores(ownerId);

  const submittedRatings = await ratings.findByStoreForOwner(
    ownerId,
    sortBy,
    sortOrder
  );

  return {
    stores: ownedStores,
    ratings: submittedRatings,
  };
}