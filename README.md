# Team Task Manager

A full-stack web application for team task management, featuring role-based access control. Built with React (Vite) and Python (FastAPI).

## Key Features
- **Authentication**: JWT-based secure signup and login.
- **Role-based Access**: Admin and Member roles.
  - Admins can create projects, assign tasks, and view everything.
  - Members can only view projects and update the status of tasks.
- **Dashboard**: High-level overview of projects and task statuses.
- **Task Board**: Kanban-style view of tasks.

## Tech Stack
- **Frontend**: React (Vite), React Router, Context API, Vanilla CSS.
- **Backend**: Python, FastAPI, SQLAlchemy, SQLite (Development) / MySQL/PostgreSQL (Production).

## Running Locally

### Backend Setup
1. `cd backend`
2. Create virtual environment: `python -m venv venv`
3. Activate virtual environment: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
4. Install dependencies: `pip install -r requirements.txt`
5. Run server: `uvicorn main:app --reload` (Runs on port 8000)

### Frontend Setup
1. `cd frontend`
2. Install dependencies: `npm install`
3. Run development server: `npm run dev` (Runs on port 5173)

## Deployment (Railway)

1. Create a GitHub repository and push this code.
2. Go to Railway and create a new project from your GitHub repo.
3. In Railway, add a PostgreSQL database service.
4. Set the `DATABASE_URL` environment variable in your backend service to the connection string provided by the database service.
5. Deploy both the frontend and backend services.
