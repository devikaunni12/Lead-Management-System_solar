"""
This is the main entry point of our FastAPI backend application.
It creates the app, enables CORS, creates tables, and includes all routes.
"""

from fastapi import FastAPI  # FastAPI is the framework that handles all our API routes.
from fastapi.middleware.cors import CORSMiddleware  # CORSMiddleware lets frontend call backend from another port.

from database import Base  # Base contains metadata for all SQLAlchemy table models.
from database import engine  # engine is the active database connection manager.
import models  # Importing models registers table definitions before create_all runs.
from routes import dashboard  # dashboard contains analytics endpoints.
from routes import leads  # leads contains lead CRUD endpoints.

# Create the FastAPI app instance with a readable API title.
app = FastAPI(title="Golden Ray Lead Management API")

# Create all tables if they do not exist yet.
# This is helpful for beginners so backend can start without manual SQL migration tools.
Base.metadata.create_all(bind=engine)

# Allow requests from the React frontend running on localhost:5173.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server URL.
    allow_methods=["*"],  # Allow GET, POST, PUT, PATCH, DELETE, and others.
    allow_headers=["*"],  # Allow all headers from frontend requests.
)

# Register leads routes under /api prefix.
app.include_router(leads.router, prefix="/api")

# Register dashboard routes under /api prefix.
app.include_router(dashboard.router, prefix="/api")
