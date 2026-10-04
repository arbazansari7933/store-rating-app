const ALLOWED_SORT = ['name', 'email', 'address', 'role', 'created_at', 'overall_rating'];

const clean = (value) => String(value ?? '').trim();

export function listQuerySchema(query) {
  const sortBy = ALLOWED_SORT.includes(query.sortBy) ? query.sortBy : 'created_at';
  const sortOrder = String(query.sortOrder).toLowerCase() === 'desc' ? 'desc' : 'asc';
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 10, 1), 100);

  return {
    value: {
      search: clean(query.search),
      name: clean(query.name),
      email: clean(query.email),
      address: clean(query.address),
      role: clean(query.role).toUpperCase(),
      sortBy,
      sortOrder,
      page,
      limit,
    },
  };
}