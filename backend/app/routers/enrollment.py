# app/routers/enrollment.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import uuid4

from app.db.postgres import get_db
from app.models.enrollment import Enrollment
from app.models.course import Course
from app.routers.schemas.enrollment import (
    EnrollmentCreate, EnrollmentOut, EnrollmentProgressUpdate
)
from app.core.deps import get_current_user, require_admin

router = APIRouter(prefix="/enrollments", tags=["enrollments"])

# learner enrols in a course
@router.post("/", response_model=EnrollmentOut, status_code=201)
async def enroll(
    payload: EnrollmentCreate,
    db: AsyncSession = Depends(get_db),
    user = Depends(get_current_user)
):
    # already enrolled?
    exists = await db.scalar(
        select(Enrollment).where(
            Enrollment.user_id == user.id,
            Enrollment.course_id == payload.course_id
        )
    )
    if exists:
        raise HTTPException(400, "Already enrolled")

    # course must exist and be published
    course = await db.get(Course, payload.course_id)
    if not course or not course.published:
        raise HTTPException(404, "Course not found")

    enrollment = Enrollment(
        id=str(uuid4()),
        user_id=user.id,
        course_id=payload.course_id
    )
    db.add(enrollment)
    await db.commit()
    await db.refresh(enrollment)
    return enrollment

# learner views their own enrollments
@router.get("/me", response_model=list[EnrollmentOut])
async def my_enrollments(
    db: AsyncSession = Depends(get_db),
    user = Depends(get_current_user)
):
    result = await db.scalars(
        select(Enrollment).where(Enrollment.user_id == user.id)
    )
    return result.all()

# learner updates progress
@router.patch("/{enrollment_id}", response_model=EnrollmentOut)
async def update_progress(
    enrollment_id: str,
    data: EnrollmentProgressUpdate,
    db: AsyncSession = Depends(get_db),
    user = Depends(get_current_user)
):
    enroll = await db.get(Enrollment, enrollment_id)
    if not enroll or enroll.user_id != user.id:
        raise HTTPException(404, "Enrollment not found")

    for k, v in data.dict(exclude_unset=True).items():
        setattr(enroll, k, v)

    # auto‑set completion flag
    if enroll.progress_pct is not None and enroll.progress_pct >= 100:
        enroll.completed = True
        from datetime import datetime as _dt
        enroll.completed_at = _dt.utcnow()

    await db.commit()
    await db.refresh(enroll)
    return enroll

# admin list
@router.get("/", response_model=list[EnrollmentOut], dependencies=[Depends(require_admin)])
async def all_enrollments(db: AsyncSession = Depends(get_db)):
    result = await db.scalars(select(Enrollment))
    return result.all()
