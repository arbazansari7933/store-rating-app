export function ratingSchema(body, query, params) {
  const rating = Number(body?.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    return { error: 'Rating must be an integer between 1 and 5.' };
  if (!params?.storeId) return { error: 'Store id is required.' };
  return { value: { storeId: params.storeId, rating } };
}
