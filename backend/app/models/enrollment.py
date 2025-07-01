# app/models/enrollment.py
from __future__ import annotations
from datetime import datetime
from typing import Optional, Dict

from sqlalchemy import DateTime, Boolean, Float, ForeignKey, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, new_uuid
from .user import User
from .course import Course

class Enrollment(Base):
    """
    One row per learner ↔ course.
    Use it for progress tracking, grades, NFT‑certificate, etc.
    """
    __tablename__ = "enrollments"

    id: Mapped[str] = mapped_column(primary_key=True, default=new_uuid)

    user_id:   Mapped[str] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    course_id: Mapped[str] = mapped_column(ForeignKey("courses.id"), index=True, nullable=False)

    # ─── learner progress ───
    progress_pct:  Mapped[float] = mapped_column(Float, default=0.0)      # 0‒100
    completed:     Mapped[bool]  = mapped_column(Boolean, default=False)
    completed_at:  Mapped[Optional[datetime]] = mapped_column(DateTime)

    # optional free‑form data (e.g. quiz scores per module)
    progress_meta: Mapped[Dict] = mapped_column(JSON, default=dict)

    # ─── certificate/NFT info ───
    nft_token_id:  Mapped[Optional[str]]
    nft_tx_hash:   Mapped[Optional[str]]
    certificate_url: Mapped[Optional[str]]     # IPFS / Arweave / S3 pointer

    created_at:    Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # ─── relationships back to parent tables ───
    learner: Mapped[User]   = relationship(back_populates="enrollments")
    course:  Mapped[Course] = relationship(back_populates="enrollments")

    __table_args__ = (
        # one active enrollment per learner‑course
        {"sqlite_autoincrement": True},
    )
