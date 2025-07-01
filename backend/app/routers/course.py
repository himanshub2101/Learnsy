from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.db.postgres import get_db
from app.models.course import Course
from app.routers.schemas.course import CourseCreate, CourseOut, CourseUpdate
from app.core.deps import get_current_user, require_admin

router = APIRouter(prefix="/courses", tags=["courses"])

# ────────── PUBLIC ──────────
@router.get("/", response_model=list[CourseOut])
async def list_courses(
    search: str = Query(default="", alias="search"),
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    try:
        query = select(Course).where(Course.published == True)
        if search:
            query = query.where(Course.title.ilike(f"%{search}%"))
        result = await db.scalars(query.offset(skip).limit(limit))
        return result.all()
    except Exception as e:
        print("🔥 ERROR in /courses/:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/{course_id}", response_model=CourseOut)
async def get_course(course_id: str, db: AsyncSession = Depends(get_db)):
    course = await db.get(Course, course_id)
    if not course or not course.published:
        raise HTTPException(404, "Course not found")
    return course

# ────────── ADMIN ──────────
@router.post("/", response_model=CourseOut, status_code=201,
             dependencies=[Depends(require_admin)])
async def create_course(
    data: CourseCreate,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_user)
):
    if await db.scalar(select(Course).where(Course.slug == data.slug)):
        raise HTTPException(400, "Slug already exists")

    course = Course(**data.dict(), created_by=admin.id)
    db.add(course)
    await db.commit()
    await db.refresh(course)
    return course

@router.put("/{course_id}", response_model=CourseOut,
            dependencies=[Depends(require_admin)])
async def update_course(
    course_id: str,
    data: CourseUpdate,
    db: AsyncSession = Depends(get_db)
):
    course = await db.get(Course, course_id)
    if not course:
        raise HTTPException(404, "Course not found")

    if data.slug and data.slug != course.slug:
        existing = await db.scalar(select(Course).where(Course.slug == data.slug))
        if existing:
            raise HTTPException(400, "Slug already exists")

    for k, v in data.dict(exclude_unset=True).items():
        setattr(course, k, v)

    await db.commit()
    await db.refresh(course)
    return course

@router.delete("/{course_id}", status_code=204,
               dependencies=[Depends(require_admin)])
async def delete_course(course_id: str, db: AsyncSession = Depends(get_db)):
    course = await db.get(Course, course_id)
    if not course:
        raise HTTPException(404, "Course not found")
    await db.delete(course)
    await db.commit()
