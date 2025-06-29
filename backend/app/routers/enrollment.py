from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.postgres import get_db
from app.models.enrollment import Enrollment
from app.models.course import Course
from app.core.deps import get_current_user, require_admin
from app.routers.schemas.enrollment import EnrollOut, ProgressUpdate, EnrollmentAdminOut
from app.services.certificates import maybe_mint_certificate

router = APIRouter(prefix="/courses/{course_id}", tags=["enrollments"])

# ----- user: enroll -----
@router.post("/enroll", response_model=EnrollOut, status_code=201)
async def enroll_course(
    course_id: str,
    user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # block duplicate enrollment
    existing = await db.scalar(
        select(Enrollment).where(
            Enrollment.course_id == course_id,
            Enrollment.user_id == user.id
        )
    )
    if existing:
        return existing

    course = await db.get(Course, course_id)
    if not course or not course.published:
        raise HTTPException(404, "Course not found")

    enrollment = Enrollment(user_id=user.id, course_id=course_id)
    db.add(enrollment)
    await db.commit()
    await db.refresh(enrollment)
    return enrollment


# ----- user: update progress -----
@router.post("/progress", response_model=EnrollOut)
async def update_progress(
    course_id: str,
    payload: ProgressUpdate,
    user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    enrollment: Enrollment | None = await db.scalar(
        select(Enrollment).where(
            Enrollment.course_id == course_id,
            Enrollment.user_id == user.id
        )
    )
    if not enrollment:
        raise HTTPException(404, "Not enrolled")

    # simple merge – customise as you like
    enrollment.progress = payload.completed_lessons
    # business rule: when progress meets course requirement mark completed
    if not enrollment.completed and _is_course_complete(enrollment, enrollment.course):
        enrollment.completed = True
        enrollment.completed_at = datetime.utcnow()
        await maybe_mint_certificate(enrollment, db)

    await db.commit()
    await db.refresh(enrollment)
    return enrollment


def _is_course_complete(enrollment: Enrollment, course: Course) -> bool:
    """
    Dummy checker – replace with your real 'all lessons done' logic.
    """
    # If your course.modules is a list of lessons:
    if isinstance(course.modules, list):
        return set(enrollment.progress) >= set(course.modules)
    # Otherwise implement your own comparison
    return False


# ----- admin: list enrollments -----
@router.get("/enrollments", response_model=list[EnrollmentAdminOut],
            dependencies=[Depends(require_admin)])
async def list_enrollments(course_id: str, db: AsyncSession = Depends(get_db)):
    rows = await db.scalars(select(Enrollment).where(Enrollment.course_id == course_id))
    return rows.all()
