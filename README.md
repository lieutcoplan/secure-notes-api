# Secure Notes App

A full-stack secure notes application built with Node.js, Express, and Prisma.

My goal of this project is to practice building a secure web application while learning about authentication, session management, and common web vulnerabilities.

I also use this project as a learning platform for web security and bug bounty practice.

## Features

- User registration
- User authentication with sessions
- Session storage with Redis database
- CSRF Protection
- Secure password hashing
- Create/Read/Update/Delete notes
- Access control (users can only access their own notes)
- Admin role management
- Rate limiter
- Logs
- Input validation with zod
- Secured headers with helmet

## Tech Stack

Backend
- Node.js
- Express
- Express-session
- Prisma ORM
- PostgreSQL
- Redis
- Connect-redis
- Rate-limiter-flexible
- Pino
- Pino-http
- PostgreSQL
- Helmet

Frontend
- HTML
- CSS
- JavaScript (Fetch API)

## Installation

git clone https://github.com/lieutcoplan/secure-notes-api.git

cd secure-notes-api

cd backend

npm install


Setting the environment variables(.env):

DATABASE_URL=postgresql://user:password@localhost:5432/notesdb

NODE_ENV=development_or_production

PORT=your_port

SESSION_SECRET=your_secret


npx prisma migrate dev

npm run dev

## API Endpoints

Authentication:

POST /api/register

POST /api/login

POST /api/logout

Notes:

GET /api/notes

POST /api/notes

DELETE /api/notes/:id

PUT /api/notes/:id

Admin:

PATCH /api/admin/users/:id/role

## Security Features

- Password hashing using bcrypt
- Session-based authentication
- HTTPOnly cookies
- Rate Limiter against some type of DoS attack
- CSRF Protection
- Access control checks on every note
- Input validation on backend with zod schema

## Learning Goals

- learn full-stack web development
- understand authentication systems
- practice secure coding
- experiment with common web vulnerabilities
- prepare for bug bounty and application security roles

## Future Improvements

- multi-language support
- better frontend UI
- search functionality
- email confirmation to register
- password forgotten functionality
- 2FA Authentication
- frontend with React
- typescript
