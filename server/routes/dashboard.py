"""
This file contains the dashboard analytics endpoint.
It calculates totals, status breakdown, conversion rate, and recent leads.
"""

from fastapi import APIRouter  # APIRouter groups dashboard endpoints in one file.
from fastapi import Depends  # Depends injects a database session from get_db.
from sqlalchemy.orm import Session  # Session is the SQLAlchemy database session type.

from database import get_db  # get_db safely opens and closes database sessions.
from models import Lead  # Lead model lets us query lead rows from database.

# Create router object for dashboard endpoints.
router = APIRouter()


# This endpoint returns summary data for the dashboard page.
@router.get("/dashboard")
def get_dashboard_data(db: Session = Depends(get_db)):
    """
    Builds dashboard statistics for frontend display.

    Input:
    - db: open database session.

    Returns:
    - Dictionary with totals, status counts, conversion rate, and recent leads.
    """

    # Count all lead rows in the table.
    total_leads_count = db.query(Lead).count()

    # Create a dictionary with all expected status keys and default count 0.
    lead_count_by_status = {
        "New Lead": 0,
        "Contacted": 0,
        "Site Visit Scheduled": 0,
        "Proposal Sent": 0,
        "Won": 0,
        "Lost": 0,
    }

    # Load all leads so we can count each status manually step by step.
    all_leads = db.query(Lead).all()

    # Loop through each lead and increase the matching status count by 1.
    for each_lead in all_leads:
        current_status = each_lead.status
        if current_status in lead_count_by_status:
            lead_count_by_status[current_status] = lead_count_by_status[current_status] + 1

    # Read won_count from the status dictionary.
    won_leads_count = lead_count_by_status["Won"]

    # Start conversion rate with default 0.0 to avoid divide-by-zero.
    conversion_rate_percent = 0.0

    # Only calculate conversion rate if total leads is more than zero.
    if total_leads_count > 0:
        raw_conversion_rate = (won_leads_count / total_leads_count) * 100
        conversion_rate_percent = round(raw_conversion_rate, 2)
    else:
        conversion_rate_percent = 0.0

    # Fetch the 5 most recent leads using created_at in descending order.
    recent_lead_rows = db.query(Lead).order_by(Lead.created_at.desc()).limit(5).all()

    # Build and return the final dashboard response dictionary.
    return {
        "total_leads": total_leads_count,
        "by_status": lead_count_by_status,
        "conversion_rate": conversion_rate_percent,
        "recent_leads": recent_lead_rows,
    }
