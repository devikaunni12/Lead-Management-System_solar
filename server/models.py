"""
This file defines what the "leads" table looks like in Python code.
Each class attribute maps to one column in the database table.
"""

from sqlalchemy import Column  # Column is used to define a table column.
from sqlalchemy import Integer  # Integer is used for whole number values.
from sqlalchemy import String  # String is used for text values.
from sqlalchemy import Float  # Float is used for decimal number values.
from sqlalchemy import DateTime  # DateTime is used for date and time values.
from sqlalchemy.sql import func  # func.now() gives current time for timestamp columns.

from database import Base  # Base is the parent class from database.py.


class Lead(Base):
    """
    This class maps to the "leads" table in SQLite.
    SQLAlchemy uses this class to create and read table rows.
    """

    # __tablename__ tells SQLAlchemy which table this class maps to.
    __tablename__ = "leads"

    # id is the unique ID for each lead and is automatically generated.
    id = Column(Integer, primary_key=True, index=True)

    # full_name stores the customer's full name and cannot be empty.
    full_name = Column(String, nullable=False)

    # phone stores a 10-digit phone number as text and cannot be empty.
    phone = Column(String(10), nullable=False)

    # email stores the customer's email address and cannot be empty.
    email = Column(String, nullable=False)

    # location stores the customer's city or area and cannot be empty.
    location = Column(String, nullable=False)

    # property_type stores Residential / Commercial / Industrial.
    property_type = Column(String, nullable=False)

    # system_size_kw stores requested solar system size in kilowatts.
    system_size_kw = Column(Float, nullable=False)

    # source stores where this lead came from.
    source = Column(String, nullable=False)

    # status stores current pipeline stage and defaults to "New Lead".
    status = Column(String, nullable=False, default="New Lead")

    # created_at stores when this lead row was first created.
    created_at = Column(DateTime, default=func.now())

    # updated_at stores when this lead row was last updated.
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
