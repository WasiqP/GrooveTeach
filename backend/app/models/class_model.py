from sqlalchemy import JSON, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class ClassModel(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "classes"

    teacher_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    class_type: Mapped[str] = mapped_column(String(32), default="single-subject")
    subject: Mapped[str | None] = mapped_column(String(255), nullable=True)
    subjects: Mapped[list | None] = mapped_column(JSON, nullable=True)
    parent_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("classes.id"), nullable=True)
    child_class_ids: Mapped[list | None] = mapped_column(JSON, nullable=True)
    education_level: Mapped[str | None] = mapped_column(String(32), nullable=True)
    grade_level: Mapped[str | None] = mapped_column(String(64), nullable=True)
    schedule: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    room_number: Mapped[str | None] = mapped_column(String(64), nullable=True)
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    institution_name: Mapped[str | None] = mapped_column(String(255), nullable=True)

    teacher = relationship("User", back_populates="classes")
    enrollments = relationship("Enrollment", back_populates="class_", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="class_", cascade="all, delete-orphan")
    attendance_records = relationship(
        "AttendanceRecord", back_populates="class_", cascade="all, delete-orphan"
    )
    homework_items = relationship("Homework", back_populates="class_", cascade="all, delete-orphan")
    schedule_events = relationship("ScheduleEvent", back_populates="class_")
