# Team Task Management System – Full Stack Application

A modern Full Stack Team Collaboration & Task Management Platform built using React, Node.js, Express, PostgreSQL, and Prisma ORM.

---

# 🌐 Live Links

Frontend: https://hrms-lite-frontend-seven.vercel.app/

Backend API: https://hrms-lite-backend-czi9.onrender.com/

---

# 📌 Overview

Team Task Management System is a full-stack collaborative productivity platform that helps teams manage projects, assign tasks, track progress, and monitor work efficiently through a responsive modern dashboard.

The application supports authentication, project collaboration, task assignment, task status tracking, and dashboard analytics.

---

# ✨ Features

## Frontend Features

- User Authentication (Login/Register)
- Protected Routes
- Dashboard Analytics
- Create & Manage Projects
- Create & Assign Tasks
- Update Task Status
- Project Member Management
- Responsive UI
- Real-time API Integration
- Toast Notifications
- Loading & Error States

---

## Backend Features

- JWT Authentication
- RESTful APIs
- Prisma ORM with PostgreSQL
- Project Management APIs
- Task Management APIs
- Dashboard Statistics APIs
- Validation & Error Handling
- Protected Routes Middleware
- Secure Password Hashing

---

# 🏗️ Project Structure

```bash
project-root/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── routes/
│   │   ├── layouts/
│   │   ├── App.js
│   │   └── index.js
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# 🛠️ Tech Stack

## Frontend

- React.js
- React Router DOM
- Axios
- Tailwind CSS
- React Hot Toast
- React Icons
- Vercel (Deployment)

---

## Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcryptjs
- express-validator
- dotenv
- CORS
- Render / Railway Deployment

---

# 🚀 Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR-USERNAME/task-management-system.git
cd task-management-system
```

---

# ⚙️ Backend Setup

## 2️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 3️⃣ Create `.env` File

```env
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_secret_key"
PORT=5000
```

---

## 4️⃣ Run Prisma Migration

```bash
npx prisma migrate dev
```

---

## 5️⃣ Generate Prisma Client

```bash
npx prisma generate
```

---

## 6️⃣ Start Backend Server

```bash
npm start
```

Server runs on:

```bash
http://localhost:5000
```

---

# 💻 Frontend Setup

## 7️⃣ Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## 8️⃣ Create Frontend `.env`

```env
REACT_APP_API_URL=https://hrms-lite-backend-czi9.onrender.com/api
```

---

## 9️⃣ Start Frontend

```bash
npm start
```

Frontend runs on:

```bash
http://localhost:3000
```

---

# 🔌 API Configuration

File:

```bash
src/api/api.js
```

Example:

```js
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export default API;
```

---

# 📡 API Endpoints

# 🔐 Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

---

# 📁 Projects

```http
GET    /api/projects
POST   /api/projects
PUT    /api/projects/:projectId
DELETE /api/projects/:projectId
POST   /api/projects/:projectId/members
DELETE /api/projects/:projectId/members/:userId
```

---

# ✅ Tasks

```http
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:taskId
PATCH  /api/tasks/:taskId/status
DELETE /api/tasks/:taskId
```

---

# 📊 Dashboard

```http
GET /api/dashboard/stats
```

---

# 🧪 Test Workflow

1. Register a new user
2. Login using credentials
3. Create a project
4. Add team members
5. Create tasks
6. Assign tasks
7. Update task status
8. View dashboard analytics

---

# 🗄️ Database

PostgreSQL with Prisma ORM

Open Prisma Studio:

```bash
npx prisma studio
```

---

# 🚀 Deployment

## Frontend Deployment (Vercel)

1. Push frontend to GitHub
2. Import project into Vercel
3. Add environment variable:

```env
REACT_APP_API_URL=https://hrms-lite-backend-czi9.onrender.com/api
```

4. Deploy

---

## Backend Deployment (Render / Railway)

1. Push backend to GitHub
2. Create Web Service
3. Add environment variables:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
PORT=5000
```

4. Build Command:

```bash
npm install && npx prisma generate
```

5. Start Command:

```bash
node server.js
```

---

# 🔒 Important Notes

- Never commit `.env` files
- Keep JWT secret private
- Add to `.gitignore`:

```bash
.env
node_modules
build
```

---

# 👨‍💻 Author

Ashutosh Kumar

Full Stack Developer

GitHub:
https://github.com/Ashu-ux

---

# ⭐ Project Highlights

- Full Stack MERN-style Architecture
- PostgreSQL + Prisma ORM
- JWT Authentication
- RESTful APIs
- Modern Responsive UI
- Production Deployment Ready
- Team Collaboration Features

---
