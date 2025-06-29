from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

slug_regex = r"^[a-z0-9]+(-[a-z0-9]+)*$"

class CourseBase(BaseModel):
    title: str                = Field(..., min_length=3, max_length=128)
    description: Optional[str]
    price: float              = Field(ge=0)
    is_published: bool        = False

class CourseCreate(CourseBase):
    slug: Optional[str]       = Field(None, pattern=slug_regex)

class CourseUpdate(BaseModel):
    title: Optional[str]      = Field(None, min_length=3, max_length=128)
    description: Optional[str]
    price: Optional[float]    = Field(None, ge=0)
    is_published: Optional[bool]
    slug: Optional[str]       = Field(None, pattern=slug_regex)

class CourseOut(CourseBase):
    id: str
    slug: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
