# HRMS Lite – Full Stack Application

Employee & Attendance Management System

---

##  Live Links
Frontend: https://hrms-lite-frontend-seven.vercel.app/
Backend API: https://hrms-lite-backend-czi9.onrender.com/

---

Overview

HRMS Lite is a full-stack Employee & Attendance Management System that allows organizations to manage employees, track attendance, and monitor daily activity through a simple and responsive interface.

---

## Features

### Frontend

- View all employees
- Add employees
- Check-in / Check-out functionality
- Attendance records dashboard
- Filter attendance by date
- Responsive UI
- Connected to live backend API

### Backend

- Add employee
- Get all employees
- Delete employee
- Check-in / Check-out tracking
- Attendance by employee
- RESTful API
- Prisma ORM with PostgreSQL

---

## Project Structure

```
project-root/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

##  Tech Stack

### Frontend

- React.js
- Axios
- CSS
- Vercel (Deployment)

### Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- Render (Deployment)
- dotenv, CORS

---

## 🚀 Installation & Setup

### 1. Clone Repository

```
git clone https://github.com/YOUR-USERNAME/hrms-lite.git
cd hrms-lite
```

---

### 2. Setup Backend

```
cd backend
npm install
```

Create `.env` file:

```
DATABASE_URL="your_postgresql_connection_string"
PORT=5000
```

Run migrations:

```
npx prisma migrate dev
npx prisma generate
```

Start server:

```
npm start
```

Server runs on:

```
http://localhost:5000
```

---

### 3. Setup Frontend

```
cd frontend
npm install
npm start
```

---

##  API Configuration (Frontend)

File: `src/api/api.js`

```
import axios from "axios";

const API = axios.create({
  baseURL: "https://hrms-lite-backend-czi9.onrender.com"
});

export default API;
```

---

##  API Endpoints

### Root

```
GET /
```

### Employees

```
POST   /employees
GET    /employees
DELETE /employees/:id
```

### Attendance

```
POST /attendance/checkin
POST /attendance/checkout
GET  /attendance/:employeeId
```

---

##  Test Steps

1. Open frontend URL
2. Add a new employee
3. Perform Check-In
4. Perform Check-Out
5. View attendance dashboard

---

##  Database

* PostgreSQL with Prisma ORM

Open Prisma Studio:

```
npx prisma studio
```

---

##  Deployment

### Frontend (Vercel)

1. Push repo to GitHub
2. Import project into Vercel
3. Deploy

### Backend (Render)

1. Push backend to GitHub
2. Create Web Service on Render
3. Add environment variable:

   ```
   DATABASE_URL=your_database_url
   ```
4. Build Command:

   ```
   npm install && npx prisma generate
   ```
5. Start Command:

   ```
   node server.js
   ```

---

##  Important Notes

- Never commit `.env` file
- Keep database credentials private
- Add to `.gitignore`:

```
.env
node_modules
```

* Backend is deployed on Render free tier

---

##  Author

Ashutosh Kumar
HRMS Lite – Full Stack

---
