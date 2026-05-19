"""
This file sets up the database connection for our FastAPI app.
It also provides a helper function to safely open and close database sessions.
"""

from sqlalchemy import create_engine  # this creates our connection to the database
from sqlalchemy.orm import sessionmaker  # this lets us open and close database sessions
from sqlalchemy.orm import declarative_base  # this is the base class all our table models will inherit from

# This tells SQLAlchemy where our SQLite database file lives.
# "sqlite:///./database/leads.db" means:
# - use SQLite
# - create or open a file named leads.db
# - file path is relative to where we run the backend command
DATABASE_URL = "sqlite:///./database/leads.db"

# This engine object is the main connection manager for SQLAlchemy.
# check_same_thread=False is needed for SQLite when FastAPI handles requests
# across different threads during development.
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

# SessionLocal is a factory.
# We use it to create one database session per request.
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# Base is the parent class used by all SQLAlchemy models.
Base = declarative_base()


def get_db():
    """
    Opens a database session, gives it to the route, and closes it afterward.

    Input:
    - No direct input arguments.

    Returns:
    - A generator that yields one database session object.
    """

    # Create a new database session object.
    database_session = SessionLocal()

    try:
        # Give the open session to the route function that depends on it.
        yield database_session
    finally:
        # Always close the session, even if an error happened.
        database_session.close()
