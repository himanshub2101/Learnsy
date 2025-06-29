from datetime import datetime
from typing import Dict, List, Optional
from sqlalchemy import DateTime, Boolean, JSON, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, new_uuid
from .user import User
from .course import Course

class Enrollment(Base):
    __tablename__ = "enrollments"

    id: Mapped[str]      = mapped_column(primary_key=True, default=new_uuid)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    course_id: Mapped[str] = mapped_column(ForeignKey("courses.id"), nullable=False, index=True)

    # progress keeps a list of completed lesson IDs (or any structure you want)
    progress: Mapped[Dict | List] = mapped_column(JSON, default=list)

    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime)

    # NFT certificate info (fill after mint)
    certificate_tx: Mapped[Optional[str]]
    certificate_uri: Mapped[Optional[str]]

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # relationships (optional back‑refs)
    user: Mapped[User] = relationship()
    course: Mapped[Course] = relationship()
