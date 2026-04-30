from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from datetime import timedelta

import models
import schemas
import auth
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Team Task Manager API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, this should be restricted
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("email")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except auth.InvalidTokenError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user

def get_current_active_user(current_user: models.User = Depends(get_current_user)):
    return current_user

def require_admin(current_user: models.User = Depends(get_current_active_user)):
    if current_user.role != models.RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user



@app.post("/api/auth/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        name=user.name, 
        email=user.email, 
        hashed_password=hashed_password,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/api/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(
        data={"email": user.email, "role": user.role.value},
        expires_delta=timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_active_user)):
    return current_user

@app.get("/api/users", response_model=List[schemas.UserResponse])
def get_users(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    return db.query(models.User).all()



@app.post("/api/projects", response_model=schemas.ProjectResponse)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    db_project = models.Project(**project.model_dump(), owner_id=current_user.id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.get("/api/projects", response_model=List[schemas.ProjectResponse])
def get_projects(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    return db.query(models.Project).all()

@app.get("/api/projects/{project_id}", response_model=schemas.ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

# --- TASK ENDPOINTS ---

@app.post("/api/projects/{project_id}/tasks", response_model=schemas.TaskResponse)
def create_task(project_id: int, task: schemas.TaskCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    if project.owner_id != current_user.id and current_user.role != models.RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Only the project owner can create tasks")
    
    task_data = task.model_dump()
    if not task_data.get("assignee_id"):
        task_data["assignee_id"] = current_user.id
    
    db_task = models.Task(**task_data, project_id=project_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.get("/api/projects/{project_id}/tasks", response_model=List[schemas.TaskResponse])
def get_tasks(project_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    return db.query(models.Task).filter(models.Task.project_id == project_id).all()

@app.put("/api/tasks/{task_id}", response_model=schemas.TaskResponse)
def update_task(task_id: int, task_update: schemas.TaskUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    db_project = db.query(models.Project).filter(models.Project.id == db_task.project_id).first()
    
    is_owner = db_project and db_project.owner_id == current_user.id
    
    # Check permissions (strictly admin or project owner)
    if current_user.role != models.RoleEnum.admin and not is_owner:
        raise HTTPException(status_code=403, detail="Only the project owner can update this task")
    
    update_data = task_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_task, key, value)
        
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/api/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    db_project = db.query(models.Project).filter(models.Project.id == db_task.project_id).first()
    
    is_owner = db_project and db_project.owner_id == current_user.id
    
    # Check permissions (strictly admin or project owner)
    if current_user.role != models.RoleEnum.admin and not is_owner:
        raise HTTPException(status_code=403, detail="Only the project owner can delete this task")
        
    db.delete(db_task)
    db.commit()
    return None

# --- DASHBOARD ENDPOINT ---
@app.get("/api/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_active_user)):
    total_projects = db.query(models.Project).count()
    total_tasks = db.query(models.Task).count()
    todo_tasks = db.query(models.Task).filter(models.Task.status == models.StatusEnum.todo).count()
    in_progress_tasks = db.query(models.Task).filter(models.Task.status == models.StatusEnum.in_progress).count()
    done_tasks = db.query(models.Task).filter(models.Task.status == models.StatusEnum.done).count()
        
    return {
        "role": current_user.role,
        "total_projects": total_projects,
        "total_tasks": total_tasks,
        "todo": todo_tasks,
        "in_progress": in_progress_tasks,
        "done": done_tasks
    }
