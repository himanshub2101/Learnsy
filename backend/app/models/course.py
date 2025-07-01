# app/models/course.py  (final tweaks)

from __future__ import annotations
from datetime import datetime
from typing import Dict, List, Optional

from sqlalchemy import (
    DateTime, Float, Boolean, JSON, func,
    String, ForeignKey
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, new_uuid
from .user import User
from .category import Category, Subcategory


class Course(Base):
    __tablename__ = "courses"

    # ────────── CORE ──────────
    id:   Mapped[str] = mapped_column(primary_key=True, default=new_uuid)
    title: Mapped[str] = mapped_column(String(128), nullable=False)
    slug:  Mapped[str] = mapped_column(
        String(140), unique=True, index=True, nullable=False
    )

    description_md: Mapped[Optional[str]] = mapped_column(nullable=True)
    curriculum_md:  Mapped[Optional[str]] = mapped_column(nullable=True)

    price_usd:     Mapped[float] = mapped_column(Float, default=0.0)
    thumbnail_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    modules: Mapped[Dict | List] = mapped_column(
        JSON, default=list, nullable=False          # fresh list per row
    )

    published:  Mapped[bool]     = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )

    # ────────── RELATIONSHIPS ──────────
    created_by: Mapped[Optional[str]] = mapped_column(ForeignKey("users.id"))
    creator:    Mapped[Optional[User]] = relationship(back_populates="courses")

    category_id:    Mapped[Optional[str]] = mapped_column(ForeignKey("categories.id"))
    subcategory_id: Mapped[Optional[str]] = mapped_column(ForeignKey("subcategories.id"))

    category:    Mapped[Optional[Category]]    = relationship(back_populates="courses")
    subcategory: Mapped[Optional[Subcategory]] = relationship(back_populates="courses")


    enrollments: Mapped[list["Enrollment"]] = relationship(
        back_populates="course",
        cascade="all, delete-orphan"
    )
    # helpful for debugging
    def __repr__(self) -> str:
        return f"<Course {self.id} {self.title!r}>"
