from pydantic import BaseModel, HttpUrl, Field
from typing import Dict, List, Any, Optional

class CourseBase(BaseModel):
    title: str
    slug: str = Field(..., pattern=r"^[a-z0-9-]+$")   # ← replace regex= with pattern=
    description_md: str = Field(..., max_length=5000)
    price_usd: float = 0.0
    thumbnail_url: Optional[HttpUrl] = None
    modules: Dict | List[Any] = []

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    title: Optional[str]
    description_md: Optional[str]
    price_usd: Optional[float]
    thumbnail_url: Optional[HttpUrl]
    modules: Optional[Dict | List[Any]]
    published: Optional[bool]

class CourseOut(CourseBase):
    id: str
    published: bool
    created_at: str

    class Config:
        orm_mode = True
