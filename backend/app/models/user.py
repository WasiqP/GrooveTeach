from sqlalchemy import JSON, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class User(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    school_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    institution_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    subjects: Mapped[list | None] = mapped_column(JSON, nullable=True, default=list)
    avatar_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True)

    classes = relationship("ClassModel", back_populates="teacher", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="teacher", cascade="all, delete-orphan")
    forms = relationship("Form", back_populates="teacher", cascade="all, delete-orphan")
    lesson_plans = relationship("LessonPlan", back_populates="teacher", cascade="all, delete-orphan")
    schedule_events = relationship(
        "ScheduleEvent", back_populates="teacher", cascade="all, delete-orphan"
    )
