# backend/app/main.py
from fastapi import FastAPI, HTTPException, Request, Query
from fastapi.responses import JSONResponse
from typing import List, Optional
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from .database import engine, SessionLocal
from .models import Base, Task, DataRow
from .schemas import TaskCreate, TaskResponse, DataRowResponse
from .tasks import add_task_to_queue

# Create the FastAPI app
app = FastAPI(title="Nutritionist Dashboard Backend")

# Set up CORS middleware (adjust allowed origins for production)
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update for your production domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the rate limiter using SlowAPI (100 requests per minute per IP)
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

# Exception handler for rate limiting errors
@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded. Please try again later."}
    )

# Create database tables if they don't exist
Base.metadata.create_all(bind=engine)

# ---------------------------
# Endpoint Definitions (No API Key Verification)
# ---------------------------

# 1. Create a new task
@app.post("/tasks/", response_model=TaskResponse)
@limiter.limit("100/minute")
async def create_task(request: Request, task_create: TaskCreate):
    db = SessionLocal()
    try:
        # Create a new task entry with initial status "pending"
        task = Task(status="pending")
        db.add(task)
        db.commit()
        db.refresh(task)

        # Start background processing of the task (simulate data ingestion)
        add_task_to_queue(task.id, task_create.start_date, task_create.end_date)
        return task
    finally:
        db.close()

# 2. Get a specific task by task ID (for status checking)
@app.get("/tasks/{task_id}", response_model=TaskResponse)
@limiter.limit("100/minute")
async def get_task(request: Request, task_id: int):
    db = SessionLocal()
    try:
        task = db.query(Task).filter(Task.id == task_id).first()
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        return task
    finally:
        db.close()

# 3. Get all tasks (Task History)
@app.get("/tasks/", response_model=List[TaskResponse])
@limiter.limit("100/minute")
async def get_all_tasks(request: Request):
    db = SessionLocal()
    try:
        tasks = db.query(Task).order_by(Task.created_at.desc()).all()
        return tasks
    finally:
        db.close()

# 4. Get data rows filtered by task ID and optionally by person
@app.get("/data", response_model=List[DataRowResponse])
@limiter.limit("100/minute")
async def get_data(
    request: Request,
    task_id: Optional[int] = Query(None, description="Task ID to filter data"),
    person: Optional[str] = Query(None, description="Filter by person (e.g., 'Person X' or 'Person Y')")
):
    db = SessionLocal()
    try:
        query = db.query(DataRow)
        if task_id is not None:
            query = query.filter(DataRow.task_id == task_id)
        if person:
            query = query.filter(DataRow.person == person)
        data_rows = query.all()
        return data_rows
    finally:
        db.close()