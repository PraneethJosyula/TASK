# app/models.py
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
import datetime

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationship: one task can have many data rows
    data_rows = relationship("DataRow", back_populates="task")

class DataRow(Base):
    __tablename__ = "data_rows"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    person = Column(String)         # "Person X" or "Person Y"
    date = Column(DateTime)
    blood_glucose = Column(Float)
    carbs = Column(Float)
    protein = Column(Float)
    fat = Column(Float)
    diet_type = Column(String)       # "Vegetarian" or "Non Veg"

    task = relationship("Task", back_populates="data_rows")