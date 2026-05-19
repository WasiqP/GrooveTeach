from datetime import datetime

from sqlalchemy import JSON, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class Homework(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "homework"

    teacher_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True)
    class_id: Mapped[str] = mapped_column(String(36), ForeignKey("classes.id"), index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    due_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="assigned")
    attachment_url: Mapped[str | None] = mapped_column(String(512), nullable=True)

    class_ = relationship("ClassModel", back_populates="homework_items")
    submissions = relationship(
        "HomeworkSubmission", back_populates="homework", cascade="all, delete-orphan"
    )


class HomeworkSubmission(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "homework_submissions"

    homework_id: Mapped[str] = mapped_column(String(36), ForeignKey("homework.id"), index=True)
    student_id: Mapped[str] = mapped_column(String(36), ForeignKey("students.id"), index=True)
    content: Mapped[str | None] = mapped_column(Text, nullable=True)
    attachment_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    grade: Mapped[str | None] = mapped_column(String(32), nullable=True)
    feedback: Mapped[str | None] = mapped_column(Text, nullable=True)
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    homework = relationship("Homework", back_populates="submissions")
    student = relationship("Student", back_populates="homework_submissions")
