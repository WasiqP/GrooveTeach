from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class Task(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "tasks"

    teacher_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True)
    class_id: Mapped[str] = mapped_column(String(36), ForeignKey("classes.id"), index=True)
    subject_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    task_type: Mapped[str | None] = mapped_column(String(64), nullable=True)
    due_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    expected_time: Mapped[int | None] = mapped_column(nullable=True)
    time_unit: Mapped[str | None] = mapped_column(String(16), nullable=True)
    visibility: Mapped[str] = mapped_column(String(32), default="class-only")
    require_identification: Mapped[bool] = mapped_column(Boolean, default=False)
    marking_criteria: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    permissions: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    display_mode: Mapped[str | None] = mapped_column(String(64), nullable=True)
    questions: Mapped[list | None] = mapped_column(JSON, nullable=True, default=list)
    published: Mapped[bool] = mapped_column(Boolean, default=False)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    share_token: Mapped[str | None] = mapped_column(String(64), unique=True, nullable=True, index=True)

    teacher = relationship("User", back_populates="tasks")
    class_ = relationship("ClassModel", back_populates="tasks")
    submissions = relationship("TaskSubmission", back_populates="task", cascade="all, delete-orphan")


class TaskSubmission(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "task_submissions"

    task_id: Mapped[str] = mapped_column(String(36), ForeignKey("tasks.id"), index=True)
    student_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("students.id"), nullable=True)
    answers: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    score: Mapped[float | None] = mapped_column(nullable=True)
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    graded_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    respondent_email: Mapped[str | None] = mapped_column(String(255), nullable=True)

    task = relationship("Task", back_populates="submissions")
