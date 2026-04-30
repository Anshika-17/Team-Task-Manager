from sqlalchemy import Column, Integer, String, Enum as SQLAlchemyEnum, ForeignKey, Date
from sqlalchemy.orm import relationship
import enum
from database import Base

class RoleEnum(str, enum.Enum):
    admin = "admin"
    member = "member"

class StatusEnum(str, enum.Enum):
    todo = "Todo"
    in_progress = "In Progress"
    done = "Done"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(255))
    role = Column(SQLAlchemyEnum(RoleEnum), default=RoleEnum.member)

    projects_owned = relationship("Project", back_populates="owner")
    tasks_assigned = relationship("Task", back_populates="assignee")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True)
    description = Column(String(255))
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="projects_owned")
    tasks = relationship("Task", back_populates="project")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), index=True)
    description = Column(String(255))
    status = Column(SQLAlchemyEnum(StatusEnum), default=StatusEnum.todo)
    due_date = Column(Date, nullable=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    assignee_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    project = relationship("Project", back_populates="tasks")
    assignee = relationship("User", back_populates="tasks_assigned")
