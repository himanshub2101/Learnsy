# app/routers/schemas/course.py

from pydantic import BaseModel, Field
from typing import Optional, Union
from datetime import datetime

slug_regex = r"^[a-z0-9]+(-[a-z0-9]+)*$"

class CourseBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=128)
    slug: Optional[str] = Field(None, pattern=slug_regex)
    description_md: Optional[str] = None
    curriculum_md: Optional[str] = None
    price_usd: float = Field(default=0, ge=0)
    thumbnail_url: Optional[str] = None
    modules: Union[dict, list] = Field(default_factory=list)
    published: bool = False
    category_id: Optional[str] = None
    subcategory_id: Optional[str] = None


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=128)
    slug: Optional[str] = Field(None, pattern=slug_regex)
    description_md: Optional[str] = None
    curriculum_md: Optional[str] = None
    price_usd: Optional[float] = Field(None, ge=0)
    thumbnail_url: Optional[str] = None
    modules: Optional[Union[dict, list]] = None
    published: Optional[bool] = None
    category_id: Optional[str] = None
    subcategory_id: Optional[str] = None


class CourseOut(CourseBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
