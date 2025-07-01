# app/routers/schemas/category.py

from pydantic import BaseModel

class SubcategoryOut(BaseModel):
    id: str
    name: str
    slug: str
    category_id: str

    class Config:
        orm_mode = True

class CategoryOut(BaseModel):
    id: str
    name: str
    slug: str
    subcategories: list[SubcategoryOut] = []

    class Config:
        orm_mode = True
