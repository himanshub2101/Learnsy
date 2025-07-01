# app/routers/schemas/enrollment.py
from datetime import datetime
from typing import Optional, Dict
from pydantic import BaseModel, Field

class EnrollmentBase(BaseModel):
    course_id: str

class EnrollmentCreate(EnrollmentBase):
    pass  # nothing extra for now

class EnrollmentProgressUpdate(BaseModel):
    progress_pct: Optional[float] = Field(None, ge=0, le=100)
    progress_meta: Optional[Dict]

class EnrollmentOut(EnrollmentBase):
    id: str
    user_id: str
    progress_pct: float
    completed: bool
    completed_at: Optional[datetime]
    nft_token_id: Optional[str]
    certificate_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
