# Roxiler Store Rating Platform

A full-stack store rating application built for the Roxiler Systems Full Stack Developer Intern coding assessment.

## Tech Stack

- Frontend: React, Vite
- Backend: Node.js, Express.js
- Database: PostgreSQL
- Authentication: JWT, bcrypt
- Deployment: Docker, Docker Compose, Nginx

## Features

### Admin
- Dashboard with users, stores and ratings
- Create users, admins and stores
- Search and filter users/stores
- View user and store details
- Sort tables ASC/DESC

### Normal User
- Signup and login
- Browse and search stores
- View store ratings
- Submit and update ratings
- Change password

### Store Owner
- Login
- View store average rating
- View users who rated the store
- View rating activity
- Change password

## Project Structure

```text
backend/       Express.js API
frontend/      React application
docs/          Project documentation
docker-compose.yml
```

## Run with Docker

### Requirements

- Docker Desktop
- Git

Run from the project root:

```bash
docker compose up --build
```

Open:

```text
http://localhost:5173
```

To stop:

```bash
docker compose down
```

To reset the database:

```bash
docker compose down -v
docker compose up --build
```

> `docker compose down -v` removes the PostgreSQL data volume.

## Run Locally Without Docker

### Requirements

- Node.js 18+
- npm
- PostgreSQL

### 1. Create Database

Create a PostgreSQL database:

```sql
CREATE DATABASE roxiler_store_rating;
```

### 2. Backend

```bash
cd backend
npm install
```

Create `.env` from `.env.example` and configure the PostgreSQL connection.

Then run:

```bash
npm run db:migrate
npm run db:seed
npm run dev
```

Backend:

```text
http://localhost:5000
```

### 3. Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create `.env` from `.env.example` and configure the backend API URL.

Then run:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Demo Accounts

### Admin

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

## Validation

- Name: 20–60 characters
- Address: maximum 400 characters
- Password: 8–16 characters, uppercase letter and special character required
- Rating: 1–5
- Standard email validation

## Documentation

Additional documentation is available in:

```text
docs/
├── architecture.md
├── API.md
└── database.md
```

## Author

**Arbaz Ansari**

GitHub:  
https://github.com/arbazansari7933