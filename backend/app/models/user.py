from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import DateTime, func
from datetime import datetime
from .base import Base, new_uuid

class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(primary_key=True, default=new_uuid)
    first_name: Mapped[str]
    last_name: Mapped[str]
    email: Mapped[str] = mapped_column(unique=True, index=True)
    phone: Mapped[str]
    password_hash: Mapped[str]
    wallet_address: Mapped[str | None]
    role: Mapped[str] = mapped_column(default="user")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
