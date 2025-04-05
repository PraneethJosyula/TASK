# app/tasks.py
import asyncio
import csv
import json
import datetime
from app.database import SessionLocal
from app.models import Task, DataRow

# In-memory job queue (a simple list for this demo)
job_queue = []

async def process_task(task_id: int, start_date: datetime.datetime, end_date: datetime.datetime):
    db = SessionLocal()
    try:
        # Simulate delay: pending -> in progress
        task = db.query(Task).filter(Task.id == task_id).first()
        task.status = "in progress"
        db.commit()

        # Delay to simulate processing time
        await asyncio.sleep(5)

        # Read and process Person X JSON data (assume located in app/data/)
        with open("app/data/person_x.json", "r") as f:
            person_x_data = json.load(f)

        # Filter records by date range and add them to the DB
        for record in person_x_data:
            record_date = datetime.datetime.fromisoformat(record["date"]).replace(tzinfo=None)
            if start_date.replace(tzinfo=None) <= record_date <= end_date.replace(tzinfo=None):
                data_row = DataRow(
                    task_id=task_id,
                    person="Person X",
                    date=record_date,
                    blood_glucose=record["blood_glucose"],
                    carbs=record["carbs"],
                    protein=record["protein"],
                    fat=record["fat"],
                    diet_type="Vegetarian"
                )
                db.add(data_row)

        # Read and process Person Y CSV data
        with open("app/data/person_y.csv", "r") as f:
            reader = csv.DictReader(f)
            for row in reader:
                record_date = datetime.datetime.fromisoformat(row["date"]).replace(tzinfo=None)
                if start_date.replace(tzinfo=None) <= record_date <= end_date.replace(tzinfo=None):
                    data_row = DataRow(
                        task_id=task_id,
                        person="Person Y",
                        date=record_date,
                        blood_glucose=float(row["blood_glucose"]),
                        carbs=float(row["carbs"]),
                        protein=float(row["protein"]),
                        fat=float(row["fat"]),
                        diet_type="Non Veg"
                    )
                    db.add(data_row)

        db.commit()

        # Final delay to simulate task completion time
        await asyncio.sleep(3)

        # Mark task as complete
        task.status = "completed"
        db.commit()

    except Exception as e:
        print(f"Error processing task {task_id}: {e}")
    finally:
        db.close()

def add_task_to_queue(task_id: int, start_date, end_date):
    # In a real application, you might push this to an async task queue like Celery.
    # Here we simply run the background processing in the event loop.
    asyncio.create_task(process_task(task_id, start_date, end_date))