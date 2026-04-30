<div align="center">
  <h1>🚀 Team Task Manager</h1>
  <p>A high-performance, full-stack task management application with role-based access control and modern glassmorphism design.</p>

  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=neon&logoColor=black" alt="Neon" />
</div>

<br />

## ✨ Features

- **🔐 Secure Authentication**: JWT-based secure signup and login with hashed passwords.
- **🛡️ Role-Based Access Control (RBAC)**:
  - **Admins & Project Owners**: Can manage projects, create tasks, assign members, and delete resources.
  - **Members**: Can view assigned projects and update task statuses (To Do → In Progress → Done).
- **🐘 Cloud Database**: Powered by **Neon PostgreSQL** for scalable and reliable data storage.
- **📊 Interactive Dashboard**: Real-time statistical overview of project progress and task distribution.
- **🎨 Premium UI/UX**: Sleek Glassmorphism design language, fully responsive for all devices.
- **⚡ Smart Cold Start Handling**: UI-integrated loading states and automatic notifications when the backend is "waking up" on free-tier hosting.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Routing**: React Router DOM v7
- **Deployment**: Vercel
- **Styling**: Vanilla CSS (Modern Design Tokens)

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL (Neon Cloud)
- **ORM**: SQLAlchemy
- **Deployment**: Render

---

## 🚀 Deployment Guide

### 1. Backend (Render)
1. Link your GitHub repository to **Render**.
2. Set the **Environment Variables**:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string.
   - `SECRET_KEY`: A secure random string for JWT.
3. Use the following Build & Start commands:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`

### 2. Frontend (Vercel)
1. Link the project to **Vercel**.
2. Set the **Environment Variable**:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://your-app.onrender.com/api`).
3. Deploy! The `vercel.json` ensures React Router works correctly on page refreshes.

---

## 🛠️ Local Development

### Prerequisites
- Node.js (v18+)
- Python (3.9+)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Activate venv (Windows: venv\Scripts\activate | Mac: source venv/bin/activate)
pip install -r requirements.txt
# Create a .env file with your DATABASE_URL
uvicorn main:app --reload
cd frontend
npm install
# Create a .env file with VITE_API_URL=http://localhost:8000/api
npm run dev

Built with ❤️ for teams that value productivity and design
