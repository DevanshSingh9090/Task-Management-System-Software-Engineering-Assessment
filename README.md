# Task Management System Software Engineering Assessment

A full-stack production-ready task manager built with:

## 🚀 Tech Stack

Frontend:
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Zustand
- Axios

Backend:
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- JWT (Access + Refresh)
- HttpOnly Cookies

---

## 🔐 Authentication

- Access token (short-lived)
- Refresh token (rotated)
- HttpOnly cookies
- Secure logout (DB invalidation)

---

## 🧱 Architecture

Backend follows modular clean architecture:

src/
- modules/
  - auth/
  - task/
- middleware/
- utils/
- config/

---

## 📦 Features

- User Registration (name + email + password)
- Login
- JWT refresh rotation
- Logout
- Create Task
- View Tasks
- Secure API routes

---

## 🛠 Run Locally

### Backend

cd backend  
npm install  
npx prisma migrate dev  
npm run dev  

### Frontend

cd frontend  
npm install  
npm run dev  

---

## 👨‍💻 Author

Devansh Singh
