# API overview

Base URL: `/api`

## Auth

- `POST /auth/login`
- `POST /auth/signup`
- `POST /auth/change-password`

## Admin

Requires `ADMIN` role.

- `GET /admin/stats`
- `GET /admin/users`
- `GET /admin/users/:id`
- `POST /admin/users`
- `GET /admin/stores`
- `POST /admin/stores`

## Stores

- `GET /stores` - authenticated users
- `POST /stores/:storeId/ratings` - normal users
- `GET /stores/owner/dashboard` - store owners

## User

- `GET /users/me`
