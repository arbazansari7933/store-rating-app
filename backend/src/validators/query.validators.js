export function listQuerySchema(query) {
  const allowedSort = [
    'name',
    'email',
    'address',
    'role',
    'created_at',
    'overall_rating',
    'owner_rating',
    'store_name',
    'user_name',
    'rating',
    'updated_at',
  ];

  const sortBy = allowedSort.includes(query.sortBy)
    ? query.sortBy
    : 'created_at';

  const sortOrder =
    String(query.sortOrder).toLowerCase() === 'desc'
      ? 'desc'
      : 'asc';

  const page = Math.max(
    Number.parseInt(query.page, 10) || 1,
    1
  );

  const limit = Math.min(
    Math.max(Number.parseInt(query.limit, 10) || 10, 1),
    100
  );

  return {
    value: {
      search: String(query.search || '').trim(),
      role: String(query.role || '').toUpperCase(),
      sortBy,
      sortOrder,
      page,
      limit,
    },
  };
}