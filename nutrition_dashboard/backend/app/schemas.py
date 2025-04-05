# app/schemas.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DataRowResponse(BaseModel):
    id: int
    task_id: int
    person: str
    date: datetime
    blood_glucose: float
    carbs: float
    protein: float
    fat: float
    diet_type: str
class TaskCreate(BaseModel):
    start_date: datetime
    end_date: datetime
    # You can add extra filters, e.g., specific food macros or person filter

class TaskResponse(BaseModel):
    id: int
    status: str
    created_at: datetime

    class Config:
        orm_mode = True