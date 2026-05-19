"""
This file contains database operation functions (CRUD) for leads.
Each function does one small job so the route files stay simple.
"""

from datetime import datetime  # datetime helps us combine date values with time boundaries.
from datetime import time  # time helps us define start-of-day and end-of-day times.

from sqlalchemy.orm import Session  # Session type helps us type database session inputs.

from models import Lead  # Lead is the SQLAlchemy model class for the leads table.


def get_all_leads(db: Session, status=None, location=None, from_date=None, to_date=None):
    """
    Gets all leads from the database.
    If filter values are provided, only returns matching leads.

    Input:
    - db: open SQLAlchemy session.
    - status: optional status string filter.
    - location: optional location text filter.
    - from_date: optional start date filter.
    - to_date: optional end date filter.

    Returns:
    - A list of Lead model objects.
    """

    # Start with a base query for all lead rows.
    leads_query = db.query(Lead)

    # If status filter exists, apply exact status match.
    if status is not None and status != "":
        leads_query = leads_query.filter(Lead.status == status)

    # If location filter exists, apply a contains search for easier matching.
    if location is not None and location != "":
        leads_query = leads_query.filter(Lead.location.ilike(f"%{location}%"))

    # If from_date exists, convert it to start of that day (00:00:00).
    if from_date is not None and from_date != "":
        from_date_start_time = datetime.combine(from_date, time.min)
        leads_query = leads_query.filter(Lead.created_at >= from_date_start_time)

    # If to_date exists, convert it to end of that day (23:59:59.999999).
    if to_date is not None and to_date != "":
        to_date_end_time = datetime.combine(to_date, time.max)
        leads_query = leads_query.filter(Lead.created_at <= to_date_end_time)

    # Sort newest rows first so latest leads appear at the top.
    leads_query = leads_query.order_by(Lead.created_at.desc())

    # Execute query and return list of rows.
    lead_list = leads_query.all()
    return lead_list


def get_lead_by_id(db: Session, lead_id: int):
    """
    Gets one lead using its ID number. Returns None if not found.

    Input:
    - db: open SQLAlchemy session.
    - lead_id: integer ID of lead to fetch.

    Returns:
    - Lead object if found, otherwise None.
    """

    # Query the leads table for the matching ID and return first match.
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    return lead


def create_new_lead(db: Session, lead_data):
    """
    Creates a new lead row in the database and returns the saved lead.

    Input:
    - db: open SQLAlchemy session.
    - lead_data: validated LeadCreate schema object.

    Returns:
    - The newly created Lead object.
    """

    # Convert schema object into dictionary so we can pass values to Lead model.
    lead_data_dictionary = lead_data.dict()

    # Create a new Lead model object using validated values.
    new_lead = Lead(**lead_data_dictionary)

    # Add this new object to current transaction.
    db.add(new_lead)

    # Save transaction to database.
    db.commit()

    # Refresh object so it includes generated fields like id and timestamps.
    db.refresh(new_lead)

    # Return the created row object.
    return new_lead


def update_existing_lead(db: Session, lead_id: int, updated_data):
    """
    Updates a lead's details. Only changes fields that were provided.

    Input:
    - db: open SQLAlchemy session.
    - lead_id: ID of the lead we want to update.
    - updated_data: validated LeadUpdate schema object.

    Returns:
    - Updated Lead object, or None if lead is not found.
    """

    # First, find the lead row we want to update.
    lead_to_update = get_lead_by_id(db=db, lead_id=lead_id)

    # If no row is found, return None so route can send 404.
    if lead_to_update is None:
        return None

    # Convert only provided fields into dictionary.
    updated_data_dictionary = updated_data.dict(exclude_unset=True)

    # Loop through each provided field and update row value.
    for field_name, field_value in updated_data_dictionary.items():
        setattr(lead_to_update, field_name, field_value)

    # Save updated values to database.
    db.commit()

    # Refresh object to get latest values from database.
    db.refresh(lead_to_update)

    # Return updated row.
    return lead_to_update


def update_lead_status(db: Session, lead_id: int, new_status: str):
    """
    Changes only the status field of a lead.

    Input:
    - db: open SQLAlchemy session.
    - lead_id: ID of lead to update.
    - new_status: new status text.

    Returns:
    - Updated Lead object, or None if lead is not found.
    """

    # Find existing lead row by ID.
    lead_to_update = get_lead_by_id(db=db, lead_id=lead_id)

    # If no lead found, return None.
    if lead_to_update is None:
        return None

    # Update only the status field.
    lead_to_update.status = new_status

    # Commit status change.
    db.commit()

    # Refresh object to include newest updated_at value.
    db.refresh(lead_to_update)

    # Return updated lead object.
    return lead_to_update


def delete_lead(db: Session, lead_id: int):
    """
    Deletes a lead from the database by its ID.

    Input:
    - db: open SQLAlchemy session.
    - lead_id: ID of lead to delete.

    Returns:
    - The deleted Lead object, or None if lead is not found.
    """

    # Find the target lead row first.
    lead_to_delete = get_lead_by_id(db=db, lead_id=lead_id)

    # If row does not exist, return None.
    if lead_to_delete is None:
        return None

    # Mark this row for deletion.
    db.delete(lead_to_delete)

    # Commit delete transaction.
    db.commit()

    # Return deleted object so caller knows what was removed.
    return lead_to_delete
