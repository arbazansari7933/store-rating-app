export function getPagination(query) {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 10, 1), 100);
  return { page, limit, offset: (page - 1) * limit };
}

export function getSort(query, allowed, fallback) {
  const field = allowed.includes(query.sortBy) ? query.sortBy : fallback;
  const direction = String(query.sortOrder).toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  return { field, direction };
}
