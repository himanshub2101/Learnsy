from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey
from .base import Base, new_uuid

class Category(Base):
    __tablename__ = "categories"
    id: Mapped[str] = mapped_column(primary_key=True, default=new_uuid)
    name: Mapped[str] = mapped_column(unique=True, index=True)
    slug: Mapped[str] = mapped_column(unique=True, index=True)

    # Fix: define this to match Course.category
    subcategories: Mapped[list["Subcategory"]] = relationship(back_populates="category")
    courses: Mapped[list["Course"]] = relationship(back_populates="category")  # ✅ ADD THIS


class Subcategory(Base):
    __tablename__ = "subcategories"
    id: Mapped[str] = mapped_column(primary_key=True, default=new_uuid)
    name: Mapped[str]
    slug: Mapped[str] = mapped_column(unique=True, index=True)
    category_id: Mapped[str] = mapped_column(ForeignKey("categories.id"))
    category: Mapped["Category"] = relationship(back_populates="subcategories")

    # Fix: define this to match Course.subcategory
    courses: Mapped[list["Course"]] = relationship(back_populates="subcategory")  # ✅ ADD THIS
