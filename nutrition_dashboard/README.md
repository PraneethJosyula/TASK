# Narravance Task

This repository contains a full-stack data sourcing and visualization web application built as part of the Narravance Task. The application allows users to create tasks to retrieve data from two external sources, process and merge the data into a unified database, and then visualize the analytics on the frontend.

## Table of Contents

- [Overview](#overview)
- [High-Level Architecture & Design](#high-level-architecture--design)
- [Implementation Details](#implementation-details)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)

## Overview

The web application is designed to:
- **Ingest Data:** Pull records from two external sources:
  - **Source A:** A JSON file (e.g., Person X data)
  - **Source B:** A CSV file (e.g., Person Y data)
- **Task Creation & Job Queue:** Allow users to create tasks by specifying filtering parameters (e.g., a date range). When a task is submitted, it is processed in the background (simulated using an in-memory job queue) and the retrieved data is stored in a unified relational database (SQLite using SQLAlchemy).
- **Data Visualization:** Once a task is completed, users can view interactive analytics. The frontend uses D3.js for charts and Material UI for a modern, responsive layout.
- **Task History:** Users can view a list of previous tasks and drill down into the analytics for a specific task.

## High-Level Architecture & Design

### Data Ingestion and Storage
- **Multiple Sources:** Data is sourced from a local JSON file and a CSV file.
- **Unified Schema:** Both sources have overlapping fields (e.g., date, blood glucose, food macros) and are merged into a single SQLite database table. Each record is associated with a task ID.
- **Job Queue:** A simple in-memory job queue (simulated with Python’s `asyncio.sleep`) processes tasks asynchronously. Each task moves from _pending_ to _in progress_ to _completed_.

### API Endpoints
- **Task Creation:**  
  `POST /tasks/` creates a new task, triggers data processing, and returns a task ID.
- **Task Status and History:**  
  `GET /tasks/{task_id}` returns the status of a specific task; `GET /tasks/` retrieves all tasks (task history).
- **Data Retrieval:**  
  `GET /data` retrieves data rows filtered by task ID (and optionally by person).

### Frontend and Visualization
- **User Experience (UX):**  
  - **Task Form:** Users create tasks by selecting a date range and (optionally) a person filter.
  - **Interactive Analytics:** The Analytics page displays multiple charts:
    - A scrollable line chart for blood glucose levels (with interactive tooltips).
    - Bar charts for aggregated food macros.
    - A grouped bar chart for glucose range breakdown.
  - **Task History:** A dedicated page allows users to review and select previous tasks.
- **Technology Stack:**  
  - **React** with Material UI for UI components and layout.
  - **D3.js** for interactive data visualizations.

## Implementation Details

### Backend
- **Framework:** FastAPI
- **Database:** SQLite with SQLAlchemy ORM
- **Job Management:** Simulated in-memory job queue that processes tasks asynchronously.
- **Endpoints:**  
  See the [main.py](backend/app/main.py) file for details.
- **Security & Rate Limiting:**  
  Initially, API key authentication was implemented but later removed for simplicity. A rate limiter (using SlowAPI) is configured for protection.

### Frontend
- **Framework:** React (created with Create React App)
- **Styling:** Material UI for a modern look and responsiveness.
- **Data Fetching:** Axios is used to communicate with the backend API. The API base URL is stored in environment variables.
- **Visualization:**  
  - **GlucoseChart:** A scrollable line chart with tooltips.
  - **MacroChart & GlucoseRangeChart:** Bar charts that display aggregated data.
- **Routing:** React Router is used to navigate between the Home, Analytics, and Task History pages.

## Setup & Installation

### Prerequisites
- Python 3.10+ (for FastAPI)
- Node.js (for the React frontend)
- Git

### Backend Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/TASK.git
   cd Narravance-Task/backend
    
2. **Initialize a Virtual Environment:**
    ```bash
    python -m venv venv
    ```
3. **Activate the Virtual Environment:**
    - **Windows:**
        ```bash
        venv\Scripts\activate
        ```
    - **macOS/Linux:**
        ```bash
        source venv/bin/activate
        ```
4. **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
5. **(Optional) Set up Environment Variables:**
    Create a `.env` file in the backend directory if needed (e.g., for sensitive data).

6. **Run the Backend Server:**
    ```bash
    uvicorn app.main:app --reload
    ```
    This starts your backend at [http://127.0.0.1:8000](http://127.0.0.1:8000).

### Frontend Setup & Running
1. **Navigate to the Frontend Directory:**
    ```bash
    cd ../frontend
    ```
2. **Install Frontend Dependencies:**
    ```bash
    npm install
    ```
3. **Set up Environment Variables:**
    Create a `.env` file in the frontend directory with:
    ```bash
    REACT_APP_API_URL=http://127.0.0.1:8000
    ```
4. **Run the Frontend Application:**
    ```bash
    npm start
    ```
    This starts your frontend at [http://localhost:3000](http://localhost:3000).

### Usage
- **Home Page:** Provides an overview of the app and example tasks.
- **Analytics Page:**
    - Create a new task by specifying a date range (and optionally a person filter).
    - When the task finishes, charts display the ingested data (blood glucose, food macros, etc.) with interactive filtering.
- **Task History:** View previous tasks and click to load analytics for a specific task.