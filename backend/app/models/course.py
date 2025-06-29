from datetime import datetime
from typing import Dict, List, Optional
from sqlalchemy import DateTime, Float, Boolean, JSON, func, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, new_uuid
from .user import User

class Course(Base):
    __tablename__ = "courses"

    id: Mapped[str] = mapped_column(primary_key=True, default=new_uuid)
    title: Mapped[str] = mapped_column(String(128), nullable=False)
    slug: Mapped[str] = mapped_column(String(140), unique=True, index=True, nullable=False)
    description_md: Mapped[str] = mapped_column(nullable=True)
    price_usd: Mapped[float] = mapped_column(Float, default=0.0)
    thumbnail_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    modules: Mapped[Dict | List] = mapped_column(JSON, default=list)

    published: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # ───── Relationship to User ─────
    created_by: Mapped[Optional[str]] = mapped_column(ForeignKey("users.id"))
    creator: Mapped[Optional[User]] = relationship(back_populates="courses")
