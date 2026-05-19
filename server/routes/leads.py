"""
This file contains all API endpoints related to lead records.
Each endpoint calls one CRUD function so route logic stays easy to read.
"""

from datetime import date  # date lets us accept simple YYYY-MM-DD values from frontend filter inputs.
from typing import List  # List helps define response type as a list of leads.
from typing import Optional  # Optional lets query params be left empty.

from fastapi import APIRouter  # APIRouter groups related endpoints in one file.
from fastapi import Depends  # Depends lets FastAPI inject shared objects like db session.
from fastapi import HTTPException  # HTTPException lets us return clean error responses.
from sqlalchemy.orm import Session  # Session is the database session type.

import crud  # crud contains all database operation helper functions.
from database import get_db  # get_db opens and closes one database session per request.
from schemas import LeadCreate  # LeadCreate validates request body for creating leads.
from schemas import LeadResponse  # LeadResponse controls output structure for lead responses.
from schemas import LeadStatusUpdate  # LeadStatusUpdate validates status-only update body.
from schemas import LeadUpdate  # LeadUpdate validates body for editing existing leads.

# Create a router object to hold all lead-related endpoints.
router = APIRouter()


# This endpoint returns all leads, with optional filters from query params.
@router.get("/leads", response_model=List[LeadResponse])
def read_all_leads(
    status: Optional[str] = None,
    location: Optional[str] = None,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    db: Session = Depends(get_db),
):
    """
    Reads all leads, optionally filtered by status, location, and date range.

    Input:
    - status: optional status filter.
    - location: optional location filter.
    - from_date: optional created_at start.
    - to_date: optional created_at end.
    - db: database session injected by FastAPI.

    Returns:
    - List of lead rows.
    """

    # Call CRUD function to fetch filtered or unfiltered lead list.
    lead_list = crud.get_all_leads(
        db=db,
        status=status,
        location=location,
        from_date=from_date,
        to_date=to_date,
    )

    # Return result list directly.
    return lead_list


# This endpoint creates a brand-new lead row in the database.
@router.post("/leads", response_model=LeadResponse)
def create_lead(lead_data: LeadCreate, db: Session = Depends(get_db)):
    """
    Creates one lead using validated input data.

    Input:
    - lead_data: LeadCreate body data.
    - db: database session.

    Returns:
    - Newly created lead row.
    """

    # Call CRUD helper to insert new row.
    created_lead = crud.create_new_lead(db=db, lead_data=lead_data)

    # Return the saved lead object.
    return created_lead


# This endpoint returns one lead by its ID number.
@router.get("/leads/{lead_id}", response_model=LeadResponse)
def read_one_lead(lead_id: int, db: Session = Depends(get_db)):
    """
    Gets one lead by ID.

    Input:
    - lead_id: target lead ID from URL.
    - db: database session.

    Returns:
    - Lead row if found.
    """

    # Get lead object from database.
    lead = crud.get_lead_by_id(db=db, lead_id=lead_id)

    # If lead does not exist, return 404 error.
    if lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")

    # Return found lead.
    return lead


# This endpoint updates one lead using provided fields.
@router.put("/leads/{lead_id}", response_model=LeadResponse)
def update_lead(lead_id: int, updated_data: LeadUpdate, db: Session = Depends(get_db)):
    """
    Updates one lead by ID.

    Input:
    - lead_id: target lead ID.
    - updated_data: fields to update.
    - db: database session.

    Returns:
    - Updated lead row.
    """

    # Call CRUD helper to update the row.
    updated_lead = crud.update_existing_lead(db=db, lead_id=lead_id, updated_data=updated_data)

    # If lead does not exist, return 404.
    if updated_lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")

    # Return updated lead object.
    return updated_lead


# This endpoint updates only the status of one lead.
@router.patch("/leads/{lead_id}/status", response_model=LeadResponse)
def patch_lead_status(lead_id: int, status_data: LeadStatusUpdate, db: Session = Depends(get_db)):
    """
    Updates status field of one lead.

    Input:
    - lead_id: target lead ID.
    - status_data: body containing new status.
    - db: database session.

    Returns:
    - Updated lead row.
    """

    # Call CRUD helper for status-only update.
    updated_lead = crud.update_lead_status(db=db, lead_id=lead_id, new_status=status_data.status)

    # If target row does not exist, return 404.
    if updated_lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")

    # Return updated row.
    return updated_lead


# This endpoint deletes one lead by ID.
@router.delete("/leads/{lead_id}")
def remove_lead(lead_id: int, db: Session = Depends(get_db)):
    """
    Deletes one lead by ID.

    Input:
    - lead_id: target lead ID.
    - db: database session.

    Returns:
    - Simple success message.
    """

    # Call CRUD helper to delete row.
    deleted_lead = crud.delete_lead(db=db, lead_id=lead_id)

    # If target row does not exist, return 404.
    if deleted_lead is None:
        raise HTTPException(status_code=404, detail="Lead not found")

    # Return confirmation message after successful delete.
    return {"message": "Lead deleted successfully"}
