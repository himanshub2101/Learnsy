# app/routers/categories.py

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.postgres import get_db
from app.models.category import Category
from sqlalchemy.future import select
from app.routers.schemas.category import CategoryOut

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("/", response_model=list[CategoryOut])
async def get_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category).options(selectinload(Category.subcategories)))
    return result.scalars().all()
