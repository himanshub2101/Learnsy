from datetime import datetime
from typing import Dict, List

from sqlalchemy import DateTime, Float, Boolean, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey

from .base import Base, new_uuid
from .user import User  # so you can FK to creator if you like

class Course(Base):
    __tablename__ = "courses"

    id: Mapped[str] = mapped_column(primary_key=True, default=new_uuid)
    title: Mapped[str]
    slug: Mapped[str] = mapped_column(unique=True, index=True)
    description_md: Mapped[str]
    price_usd: Mapped[float] = mapped_column(Float, default=0.0)
    thumbnail_url: Mapped[str | None]

    # store arbitrary module/lesson structure as JSON (Postgres jsonb)
    modules: Mapped[Dict | List] = mapped_column(JSON)

    published: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # Optional FK to the user who created it
created_by: Mapped[str | None] = mapped_column(ForeignKey("users.id"))
courses: Mapped[list["Course"]] = relationship(back_populates="creator")
