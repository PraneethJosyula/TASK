import sqlite3

# Connect to the database file
conn = sqlite3.connect("nutrition.db")
cursor = conn.cursor()

# List all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print("Tables in the database:", tables)

# Query the 'tasks' table
cursor.execute("SELECT * FROM tasks;")
tasks = cursor.fetchall()
print("Tasks table contents:")
for task in tasks:
    print(task)

# Query the 'data_rows' table
cursor.execute("SELECT * FROM data_rows;")
data_rows = cursor.fetchall()
print("Data Rows table contents:")
for row in data_rows:
    print(row)

conn.close()