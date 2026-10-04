# Roxiler Store Rating Platform

A full-stack implementation of the Roxiler Systems Full Stack Developer Intern coding challenge.

The application is a store-rating platform with three role-based experiences:

- System Administrator
- Normal User
- Store Owner

The project uses React for the frontend, Node.js/Express for the backend, and PostgreSQL for persistent data.

---

## Features

### Administrator

- Admin login
- Dashboard with total users, stores and ratings
- Create normal users
- Create administrators
- Create stores
- Assign store owners
- Search and filter users and stores
- View user details
- View store rating information
- Sort tabular data in ascending/descending order
- Logout

### Normal User

- Public signup
- Login
- Browse all stores
- Search stores by name or address
- View overall store rating
- View personal rating
- Submit a rating from 1 to 5
- Update an existing rating
- Change password
- Logout

### Store Owner

- Owner login
- Owner dashboard
- View store's average rating
- View users who rated the store
- View customer rating activity
- Change password
- Logout

### Security and Validation

- JWT-based authentication
- Role-based authorization
- Password hashing
- Protected API routes
- Server-side validation
- Client-side validation
- Parameterized SQL queries
- PostgreSQL constraints
- Centralized error handling
- HTTP security headers
- CORS configuration
- Rate limiting
- No plaintext passwords stored in the database

---

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express.js
- JWT
- bcrypt
- REST APIs

### Database

- PostgreSQL

### Infrastructure

- Docker
- Docker Compose
- Nginx

---

## Project Structure

```text
roxiler-store-rating-assessment/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── db/
│   │   │   ├── migrations/
│   │   │   ├── pool.js
│   │   │   ├── migrate.js
│   │   │   └── seed.js
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── router/
│   │   ├── styles/
│   │   ├── utils/
│   │   └── main.jsx
│   │
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── docs/
│   ├── architecture.md
│   ├── API.md
│   └── database.md
│
├── docker-compose.yml
├── .env.example
├── .gitignore
├── ASSESSMENT-CHECKLIST.md
└── README.md
```

---

# Getting Started

There are two ways to run the project.

### Option 1 — Docker Compose

Recommended for the quickest setup.

### Option 2 — Local Development Without Docker

Useful if Docker is not installed or if you want to run PostgreSQL, backend and frontend independently.

---

# Option 1: Run With Docker

## Prerequisites

Install:

- Docker Desktop
- Git

Make sure Docker Desktop is running.

Verify:

```bash
docker --version
docker compose version
```

---

## Start the Application

From the project root:

```bash
docker compose up --build
```

Docker Compose starts:

- PostgreSQL
- Backend API
- Frontend/Nginx

The PostgreSQL database is initialized automatically.

---

## Open the Application

Frontend:

```text
http://localhost:5173
```

Backend API:

```text
http://localhost:5000
```

The frontend communicates with the backend through the configured API route.

---

## Stop the Application

Press:

```text
Ctrl + C
```

Or run:

```bash
docker compose down
```

---

## Reset the Database

If you want to completely remove the PostgreSQL Docker volume and recreate the database:

```bash
docker compose down -v
docker compose up --build
```

> Warning: `docker compose down -v` deletes the PostgreSQL data stored in the Docker volume.

---

# Option 2: Local Setup Without Docker

This setup runs PostgreSQL, the Express backend and the React frontend directly on your machine.

## Prerequisites

Install:

- Node.js 18+ recommended
- npm
- PostgreSQL 14+
- Git

Verify:

```bash
node --version
npm --version
psql --version
```

---

# Step 1: Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd roxiler-store-rating-assessment
```

If you already downloaded the project, simply open a terminal in the project root.

---

# Step 2: Create the PostgreSQL Database

Start your local PostgreSQL server.

Create a database:

```sql
CREATE DATABASE roxiler_store_rating;
```

You can also create it using the PostgreSQL command line:

```bash
createdb roxiler_store_rating
```

Make sure your PostgreSQL username and password are available.

---

# Step 3: Configure the Backend

Go to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

### Windows

```cmd
copy .env.example .env
```

### macOS/Linux

```bash
cp .env.example .env
```

Open:

```text
backend/.env
```

Configure the PostgreSQL connection and application settings according to the values required by your local PostgreSQL installation.

Example:

```env
PORT=5000

DATABASE_URL=postgresql://postgres:your_password@localhost:5432/roxiler_store_rating

JWT_SECRET=replace_with_a_secure_random_secret

CORS_ORIGIN=http://localhost:5173
```

Do not commit the `.env` file to GitHub.

---

# Step 4: Run Database Migrations

From the `backend` directory:

```bash
npm run db:migrate
```

This creates the required database tables, constraints and indexes.

---

# Step 5: Seed Demo Data

Run:

```bash
npm run db:seed
```

This creates demo users, stores and ratings for testing.

The seed operation is intended for development/evaluation environments.

---

# Step 6: Start the Backend

From:

```text
backend/
```

run:

```bash
npm run dev
```

The API should start on:

```text
http://localhost:5000
```

Keep this terminal running.

---

# Step 7: Configure the Frontend

Open a second terminal.

From the project root:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

### Windows

```cmd
copy .env.example .env
```

### macOS/Linux

```bash
cp .env.example .env
```

Configure the frontend API URL according to the values provided in `frontend/.env.example`.

For a normal local setup, the frontend should point to the locally running backend.

---

# Step 8: Start the Frontend

From:

```text
frontend/
```

run:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

# Demo Accounts

The seed script creates demo accounts for each role.

### Administrator

```text
Email: admin@roxiler.demo
Password: Admin@123
```

### Store Owner

```text
Email: owner@roxiler.demo
Password: Owner@123
```

### Normal User

```text
Email: user@roxiler.demo
Password: User@123
```

All roles use the same login page.

The user's role is determined by the authenticated account and the application routes the user to the appropriate dashboard.

---

# Normal User Signup

A new user can also create an account from:

```text
/signup
```

Public signup creates a normal user account only.

Role selection is intentionally not exposed on the public signup form.

---

# Authentication and Authorization

The application uses a single login flow.

After authentication:

```text
Login
  ↓
Backend verifies credentials
  ↓
JWT generated
  ↓
Role included in authenticated user context
  ↓
Frontend routes user to the appropriate dashboard
```

Supported roles:

```text
ADMIN
OWNER
USER
```

Backend authorization is enforced server-side.

The frontend does not determine or grant user permissions.

---

# Validation Rules

The application validates user input on both the frontend and backend.

### User Name

```text
Minimum: 20 characters
Maximum: 60 characters
```

### Address

```text
Maximum: 400 characters
```

### Password

```text
8–16 characters
At least one uppercase letter
At least one special character
```

### Email

A standard email format is required.

### Rating

```text
1–5
```

A user can have only one rating for a particular store. An existing rating can be updated.

---

# API

The backend exposes REST APIs for:

- Authentication
- User management
- Store management
- Ratings
- Administrator operations

Detailed API information is available in:

```text
docs/API.md
```

---

# Backend Architecture

The backend follows a layered architecture:

```text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
PostgreSQL
```

### Routes

Define API endpoints and attach middleware.

### Middleware

Handles concerns such as:

- Authentication
- Authorization
- Validation
- Rate limiting
- Error handling

### Controllers

Handle HTTP requests and responses.

### Services

Contain application/business logic.

### Repositories

Handle database access and SQL queries.

### Database

PostgreSQL stores users, stores and ratings with relational constraints.

This separation keeps business logic independent from HTTP and database implementation details.

---

# Database

The database contains the core entities required by the application:

```text
Users
Stores
Ratings
```

Relationships and constraints ensure:

- Valid user references
- Valid store references
- Valid ratings
- One rating per user/store combination
- Proper owner/store relationships

Database migrations are located in:

```text
backend/src/db/migrations/
```

Database documentation:

```text
docs/database.md
```

---

# Sorting

All applicable tables support ascending and descending sorting.

Sorting is handled through controlled query parameters and validated server-side rather than directly interpolating arbitrary SQL values.

---

# Environment Variables

Environment-specific configuration is kept outside the source code.

Example files are provided:

```text
.env.example
backend/.env.example
frontend/.env.example
```

Create your own `.env` files locally.

Never commit:

```text
.env
```

or production secrets to GitHub.

---

# Development Commands

## Backend

From `backend/`:

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

For a production-style start:

```bash
npm start
```

---

## Frontend

From `frontend/`:

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

# Docker Commands

Build and start:

```bash
docker compose up --build
```

Start in detached mode:

```bash
docker compose up -d --build
```

Stop:

```bash
docker compose down
```

Stop and remove database volume:

```bash
docker compose down -v
```

View running containers:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs
```

View backend logs:

```bash
docker compose logs backend
```

View frontend logs:

```bash
docker compose logs frontend
```

---

# Troubleshooting

## PostgreSQL Connection Error

If running locally, verify:

- PostgreSQL service is running
- Database exists
- PostgreSQL username is correct
- PostgreSQL password is correct
- Port is correct
- `DATABASE_URL` is correct

Example:

```text
postgresql://postgres:password@localhost:5432/roxiler_store_rating
```

---

## Port Already in Use

If port `5000` or `5173` is already being used, stop the process using that port or change the corresponding configuration.

For PostgreSQL, make sure the configured port matches your local PostgreSQL installation.

---

## Docker Database Not Updating

If you changed database migrations during development and need a clean database:

```bash
docker compose down -v
docker compose up --build
```

This removes the existing database volume and recreates the database.

---

## Frontend Cannot Reach Backend

Check:

1. Backend is running.
2. Backend is listening on the expected port.
3. Frontend API configuration is correct.
4. CORS configuration allows the frontend origin.
5. Docker services are running if using Docker.

---

# Assessment Coverage

The implementation covers the main requirements of the Roxiler Store Rating coding challenge:

- Three user roles
- Single login flow
- Normal user signup
- Administrator dashboard
- Store management
- User management
- Store owner dashboard
- Store ratings
- Rating updates
- Search and filtering
- Table sorting
- Password change
- Authentication
- Role-based authorization
- Validation
- PostgreSQL database
- REST APIs
- React frontend
- Dockerized deployment

A detailed requirement mapping is available in:

```text
ASSESSMENT-CHECKLIST.md
```

---

# Project Documentation

Additional documentation:

```text
docs/
├── architecture.md
├── API.md
└── database.md
```

---

# Security Notes

This repository contains example/demo credentials for evaluation.

For a real production deployment:

- Use strong randomly generated secrets.
- Use environment-specific credentials.
- Use HTTPS.
- Rotate JWT secrets appropriately.
- Do not expose database credentials.
- Do not commit `.env` files.
- Replace demo seed credentials with secure accounts.

---

# Submission Notes

The project is structured so that it can be evaluated either through Docker Compose or by running the PostgreSQL database, backend and frontend independently.

For evaluation, the recommended setup is:

```bash
docker compose up --build
```

Then open:

```text
http://localhost:5173
```

---

## Author

**Arbaz Ansari**

Full Stack Developer

GitHub:

```text
https://github.com/arbazansari7933
```