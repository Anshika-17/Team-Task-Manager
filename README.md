<div align="center">
  <h1>🚀 Team Task Manager</h1>
  <p>A full-stack, role-based project and task management application to streamline team collaboration.</p>

  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
</div>

<br />

## ✨ Features

- **🔐 Secure Authentication**: JWT-based secure signup and login.
- **🛡️ Role-Based Access Control**:
  - **Admins & Project Owners**: Full control over projects, including creating tasks, editing task details, assigning users, and deleting tasks.
  - **Members**: Can view assigned projects and update their task statuses (To Do → In Progress → Done).
- **📊 Real-Time Dashboard**: High-level statistical overview of your organization's projects and task statuses.
- **📋 Kanban-Style Task Board**: Intuitive visual task management separated by status columns.
- **🎨 Modern Glassmorphism UI**: Beautiful, fully responsive frontend with premium aesthetics.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Routing**: React Router DOM v7
- **State Management**: React Context API
- **HTTP Client**: Axios (with custom interceptors)
- **Styling**: Vanilla CSS (Glassmorphism design language)

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite (Development) / PostgreSQL (Production ready)
- **ORM**: SQLAlchemy
- **Security**: bcrypt password hashing, PyJWT authentication

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- Python (3.9+)

### 1. Backend Setup
Navigate to the backend directory, set up your virtual environment, and run the FastAPI server:
```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server (runs on http://127.0.0.1:8000)
uvicorn main:app --reload
