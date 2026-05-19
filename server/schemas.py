"""
This file defines Pydantic schemas for validating API request and response data.
Schemas help us make sure incoming data is clean and expected.
"""

import re  # re is used to run regular expression checks for phone numbers.
from datetime import datetime  # datetime is used for created_at and updated_at types.
from typing import Optional  # Optional allows fields to be missing in update requests.

from pydantic import BaseModel  # BaseModel is the parent class for all schemas.
from pydantic import EmailStr  # EmailStr validates that a value is a proper email.
from pydantic import Field  # Field lets us add constraints like minimum and maximum values.
from pydantic import validator  # validator lets us run custom checks on schema fields.

# This list stores all allowed property type values.
ALLOWED_PROPERTY_TYPES = ["Residential", "Commercial", "Industrial"]

# This list stores all allowed lead source values.
ALLOWED_SOURCES = ["Website", "Referral", "Walk-in", "Social Media"]

# This list stores all allowed pipeline status values.
ALLOWED_STATUSES = [
    "New Lead",
    "Contacted",
    "Site Visit Scheduled",
    "Proposal Sent",
    "Won",
    "Lost",
]


class LeadCreate(BaseModel):
    """
    This schema validates data when creating a new lead.

    Input:
    - All lead fields are required.

    Returns:
    - A validated LeadCreate object if all rules pass.
    """

    # full_name is required and must be plain text.
    full_name: str

    # phone is required and must be exactly 10 digits.
    phone: str

    # email is required and must be a valid email format.
    email: EmailStr

    # location is required and stores city or area name.
    location: str

    # property_type is required and must be one allowed category.
    property_type: str

    # system_size_kw is required and must be between 1 and 100.
    system_size_kw: float = Field(..., ge=1, le=100)

    # source is required and must be one allowed source value.
    source: str

    # status is required and must be one allowed pipeline stage.
    status: str

    @validator("phone")
    def validate_phone_number(cls, value):
        """
        Validates that phone has exactly 10 digits.

        Input:
        - value: phone number string.

        Returns:
        - The same value if valid.
        """

        # This pattern means the value must be exactly 10 digits, nothing else.
        phone_pattern = r"^\d{10}$"

        # If the value does not match the pattern, raise a clear error.
        if re.match(phone_pattern, value) is None:
            raise ValueError("Phone number must be exactly 10 digits")

        # Return valid value so Pydantic can continue.
        return value

    @validator("system_size_kw")
    def validate_system_size(cls, value):
        """
        Validates that system size is between 1 and 100.

        Input:
        - value: system size as float.

        Returns:
        - The same value if valid.
        """

        # Check lower and upper range clearly for beginners.
        if value < 1 or value > 100:
            raise ValueError("System size must be between 1 and 100")

        # Return valid value.
        return value

    @validator("property_type")
    def validate_property_type(cls, value):
        """
        Validates property_type against allowed values.

        Input:
        - value: property type string.

        Returns:
        - The same value if valid.
        """

        # Ensure value is one of the allowed options.
        if value not in ALLOWED_PROPERTY_TYPES:
            raise ValueError("Property type must be Residential, Commercial, or Industrial")

        # Return valid value.
        return value

    @validator("source")
    def validate_source(cls, value):
        """
        Validates source against allowed values.

        Input:
        - value: source string.

        Returns:
        - The same value if valid.
        """

        # Ensure source comes from the approved list.
        if value not in ALLOWED_SOURCES:
            raise ValueError("Source must be Website, Referral, Walk-in, or Social Media")

        # Return valid value.
        return value

    @validator("status")
    def validate_status(cls, value):
        """
        Validates status against the 6 allowed pipeline stages.

        Input:
        - value: status string.

        Returns:
        - The same value if valid.
        """

        # Ensure status is one of the expected stage values.
        if value not in ALLOWED_STATUSES:
            raise ValueError(
                "Status must be New Lead, Contacted, Site Visit Scheduled, Proposal Sent, Won, or Lost"
            )

        # Return valid value.
        return value


class LeadUpdate(BaseModel):
    """
    This schema validates data when updating an existing lead.

    Input:
    - Every field is optional, so user can update only what they need.

    Returns:
    - A validated LeadUpdate object with only provided fields.
    """

    # full_name is optional in updates.
    full_name: Optional[str] = None

    # phone is optional in updates.
    phone: Optional[str] = None

    # email is optional in updates.
    email: Optional[EmailStr] = None

    # location is optional in updates.
    location: Optional[str] = None

    # property_type is optional in updates.
    property_type: Optional[str] = None

    # system_size_kw is optional in updates.
    system_size_kw: Optional[float] = Field(None, ge=1, le=100)

    # source is optional in updates.
    source: Optional[str] = None

    # status is optional in updates.
    status: Optional[str] = None

    @validator("phone")
    def validate_phone_number(cls, value):
        """
        Validates phone when phone is provided in update payload.

        Input:
        - value: phone number or None.

        Returns:
        - Same value if valid.
        """

        # If phone was not provided, skip validation.
        if value is None:
            return value

        # Reuse the same 10-digit check as create schema.
        phone_pattern = r"^\d{10}$"
        if re.match(phone_pattern, value) is None:
            raise ValueError("Phone number must be exactly 10 digits")

        # Return valid value.
        return value

    @validator("system_size_kw")
    def validate_system_size(cls, value):
        """
        Validates system size when provided in update payload.

        Input:
        - value: system size float or None.

        Returns:
        - Same value if valid.
        """

        # If no system size was provided, skip this check.
        if value is None:
            return value

        # Validate allowed range.
        if value < 1 or value > 100:
            raise ValueError("System size must be between 1 and 100")

        # Return valid value.
        return value

    @validator("property_type")
    def validate_property_type(cls, value):
        """
        Validates property_type when provided in update payload.

        Input:
        - value: property type string or None.

        Returns:
        - Same value if valid.
        """

        # If property_type was not sent, skip validation.
        if value is None:
            return value

        # Ensure value is in allowed list.
        if value not in ALLOWED_PROPERTY_TYPES:
            raise ValueError("Property type must be Residential, Commercial, or Industrial")

        # Return valid value.
        return value

    @validator("source")
    def validate_source(cls, value):
        """
        Validates source when provided in update payload.

        Input:
        - value: source string or None.

        Returns:
        - Same value if valid.
        """

        # If source was not sent, skip validation.
        if value is None:
            return value

        # Ensure source is valid.
        if value not in ALLOWED_SOURCES:
            raise ValueError("Source must be Website, Referral, Walk-in, or Social Media")

        # Return valid value.
        return value

    @validator("status")
    def validate_status(cls, value):
        """
        Validates status when provided in update payload.

        Input:
        - value: status string or None.

        Returns:
        - Same value if valid.
        """

        # If status was not sent, skip validation.
        if value is None:
            return value

        # Ensure status is one of 6 allowed stages.
        if value not in ALLOWED_STATUSES:
            raise ValueError(
                "Status must be New Lead, Contacted, Site Visit Scheduled, Proposal Sent, Won, or Lost"
            )

        # Return valid value.
        return value


class LeadStatusUpdate(BaseModel):
    """
    This schema validates status-only updates.

    Input:
    - status field only.

    Returns:
    - A validated LeadStatusUpdate object.
    """

    # status is required for this patch endpoint.
    status: str

    @validator("status")
    def validate_status(cls, value):
        """
        Validates status against the 6 allowed pipeline stages.

        Input:
        - value: status string.

        Returns:
        - Same value if valid.
        """

        # Ensure status is from allowed values.
        if value not in ALLOWED_STATUSES:
            raise ValueError(
                "Status must be New Lead, Contacted, Site Visit Scheduled, Proposal Sent, Won, or Lost"
            )

        # Return valid status value.
        return value


class LeadResponse(BaseModel):
    """
    This schema describes lead data returned from API responses.

    Input:
    - Data usually comes from SQLAlchemy model objects.

    Returns:
    - A response-safe object with all lead fields.
    """

    # id is the unique lead identifier.
    id: int

    # full_name is the customer's full name.
    full_name: str

    # phone is the customer's 10-digit number.
    phone: str

    # email is the customer's email address.
    email: EmailStr

    # location is the city or area value.
    location: str

    # property_type is Residential / Commercial / Industrial.
    property_type: str

    # system_size_kw is the requested solar size.
    system_size_kw: float

    # source is where the lead came from.
    source: str

    # status is current pipeline stage.
    status: str

    # created_at is when row was first inserted.
    created_at: datetime

    # updated_at is when row was last updated.
    updated_at: datetime

    class Config:
        # orm_mode=True tells Pydantic it can read SQLAlchemy model objects directly.
        orm_mode = True

        # from_attributes=True is the newer equivalent used by newer Pydantic versions.
        from_attributes = True
