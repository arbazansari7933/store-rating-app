# Database

## Tables

### users
Stores platform identities and roles. `role` is an enum containing `ADMIN`, `USER`, and `OWNER`.

### stores
Stores registered store information and an optional `owner_id` reference to a user with the `OWNER` role.

### ratings
Stores one rating per user/store pair. The database enforces `UNIQUE(user_id, store_id)` and `CHECK(rating BETWEEN 1 AND 5)`.

### schema_migrations
Tracks applied SQL migrations so database initialization is repeatable.

## Relationships

- `users 1 -> many ratings`
- `stores 1 -> many ratings`
- `users (OWNER) 1 -> many stores`
- `ratings` belongs to one user and one store

Indexes cover role/email/name lookups, store ownership/name lookups, and rating foreign keys.
