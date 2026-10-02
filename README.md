# Roxiler Store Rating Platform

A submission-ready implementation of the Roxiler Systems Full Stack Developer Intern coding challenge.

The application uses React, Express and PostgreSQL with a layered backend, role-based JWT authentication, server-side validation, Docker Compose and an Nginx reverse proxy.

## Run

Requirements: Docker Desktop with Compose v2.

From the repository root:

```bash
docker compose up --build
```

Open **http://localhost:5173**.

The browser uses Nginx to proxy `/api` requests to the backend. No local Node or PostgreSQL installation is required.

Stop:

```bash
docker compose down
```

Reset the database and demo data:

```bash
docker compose down -v
docker compose up --build
```

## Demo accounts

These credentials are for local evaluation only.

| Role | Email | Password |
| --- | --- | --- |
| Administrator | admin@roxiler.demo | Admin@123 |
| Store Owner | owner@roxiler.demo | Owner@123 |
| Normal User | user@roxiler.demo | User@123 |

## Architecture

```text
frontend/                 backend/                    PostgreSQL
React + Vite              Express                     relational data
     |                        |                              |
     +-- API client --------> route                        |
                              -> middleware                 |
                              -> controller                 |
                              -> service                    |
                              -> repository --------------> |
```

### Backend

```text
backend/src/
  config/          environment configuration
  controllers/     HTTP request/response handling
  db/              pool, migrations and seed
  middleware/      auth, validation, security, errors
  repositories/    parameterized PostgreSQL queries
  routes/          REST endpoint definitions
  services/        business rules
  utils/           shared helpers
  validators/      request validation
```

### Frontend

```text
frontend/src/
  api/             centralized HTTP modules
  components/      reusable UI
  context/         authentication state
  hooks/           reusable behavior
  layouts/         authenticated application shell
  pages/           route-level screens
  router/          route protection and navigation
  styles/          application design system
  utils/           validation and error helpers
```

## Database

- `users`
- `stores`
- `ratings`
- `schema_migrations`

The database enforces user-name length, rating bounds, foreign keys and one rating per user/store pair. See `docs/database.md`.

## Security

- bcrypt password hashing
- JWT authentication
- server-side role authorization
- parameterized SQL
- request validation
- Helmet
- CORS configuration
- API and authentication rate limits
- safe production error responses
- no secrets committed to the repository

## Assessment coverage

See `ASSESSMENT-CHECKLIST.md` for a requirement-by-requirement mapping to implementation areas.

## Documentation

- `docs/architecture.md`
- `docs/api.md`
- `docs/database.md`

## Verification

The repository can be syntax-checked without external services. Full integration verification should be performed with Docker Desktop using the one-command startup above. If Docker is unavailable on the development machine, the container runtime itself cannot be verified there.

## UI direction

The UI uses an original, restrained engineering-product visual language: compact navigation, clear hierarchy, strong typography, white content surfaces, a controlled blue accent and focused interaction states. The direction is informed by Roxiler's public emphasis on customer-centric design, scalable architecture, robust engineering and polished React interfaces, without copying Roxiler pages or assets.
