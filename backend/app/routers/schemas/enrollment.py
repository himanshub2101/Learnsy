from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime

class EnrollOut(BaseModel):
    id: str
    course_id: str
    progress: List | Dict
    completed: bool
    certificate_uri: Optional[str]

    class Config:
        from_attributes = True

class ProgressUpdate(BaseModel):
    # e.g. ["lesson1", "lesson2"] or { "module1": ["l1","l2"] }
    completed_lessons: List[str] | Dict

class EnrollmentAdminOut(EnrollOut):
    user_id: str
    completed_at: Optional[datetime]
    certificate_tx: Optional[str]
