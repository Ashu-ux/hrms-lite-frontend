# HRMS Lite – Frontend

Employee & Attendance Management System (React Frontend)

Live App:
[https://hrms-lite-frontend-seven.vercel.app/](https://hrms-lite-frontend-seven.vercel.app/)

Backend API:
[https://hrms-lite-backend-czi9.onrender.com/](https://hrms-lite-backend-czi9.onrender.com/)

---

## Features

* View all employees
* Add employees
* Check-in / Check-out
* Attendance records
* Dashboard summary
* Filter attendance by date
* Connected to live backend
* Responsive UI

---

## Tech Stack

* React.js
* Axios
* CSS
* Vercel (deployment)
* Express + Prisma backend
* PostgreSQL database

---

## Project Structure

src/
├── api/
│    └── api.js
├── App.js
├── index.js
└── components/

---

## Local Setup

Clone repo:
git clone https://github.com/YOUR-USERNAME/hrms-lite-frontend.git
cd hrms-lite-frontend


Install dependencies:
npm install

Run locally:
npm start


## API Configuration

File: `src/api/api.js`

import axios from "axios";
const API = axios.create({
  baseURL: "https://hrms-lite-backend-czi9.onrender.com"
});
export default API;

---
## Deployment

Frontend deployed using Vercel

Steps:

1. Push repo to GitHub
2. Import in Vercel
3. Deploy

---

## Test Steps

1. Open website
2. Add employee
3. Click Check-In
4. Click Check-Out
5. View attendance dashboard

---

## Author

Ashutosh
HRMS Lite Full-Stack Assignment Submission

---

## Notes

* Backend is on Render free tier
* Use live link for testing
