# Architecture

The application is split into two independently buildable applications and a PostgreSQL service.

## Request flow

`React page -> API client -> Express route -> middleware -> controller -> service -> repository -> PostgreSQL`

Controllers translate HTTP requests into service calls. Services contain business rules. Repositories own SQL and database access. This keeps HTTP, business logic and persistence concerns separate without introducing unnecessary abstractions.

## Authentication

The API issues a signed JWT after login or signup. Protected routes verify the token before the controller runs. Role checks are performed on the server with authorization middleware.

## Database

PostgreSQL enforces rating bounds, user/store relationships and the unique `(user_id, store_id)` rating rule. Migrations are applied at backend startup before seed data is loaded.

## Frontend

Pages own route-level composition. Reusable UI components handle presentation. API modules are the only layer that knows endpoint paths. `AuthContext` owns the current session and role-aware routing.

## Deployment

Docker Compose starts PostgreSQL, waits for database health, starts the backend, waits for the backend health endpoint, then starts the Nginx-served React application. Nginx proxies `/api` requests to the backend service, so the browser uses one origin.
