# task-manager backend

## Setup

1. Copy `.env.example` to `.env` and fill values (DATABASE_URL, JWT secrets).
2. Install dependencies:
   ```
   cd backend
   npm install
   ```
3. Generate Prisma client and run migrations:
   ```
   npx prisma generate
   npx prisma migrate dev --name init
   ```
4. Run dev server:
   ```
   npm run dev
   ```

API endpoints:
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- GET /auth/me
- POST /auth/logout
- Protected /tasks endpoints (use cookies; backend reads httpOnly cookies)
