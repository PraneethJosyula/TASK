import csv
from datetime import datetime, timedelta
import random

# Define the headers
headers = ['date', 'blood_glucose', 'carbs', 'protein', 'fat']

# Generate 500 records
records = []
start_date = datetime(2024, 1, 1, 9, 0)  # Starting from January 1st 2024 at 9:00

for i in range(500):
    records.append([
        (start_date + timedelta(days=i)).isoformat(),  # date
        random.randint(90, 130),                       # blood_glucose (slightly higher range)
        random.randint(45, 70),                        # carbs (higher range)
        random.randint(20, 35),                        # protein (higher range)
        random.randint(12, 22)                         # fat (higher range)
    ])

# Write to CSV file
with open('person_y.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(headers)  # Write headers first
    writer.writerows(records)  # Write all records