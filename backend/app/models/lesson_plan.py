from sqlalchemy import JSON, Boolean, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class LessonPlan(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "lesson_plans"

    teacher_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True)
    class_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("classes.id"), nullable=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    subject: Mapped[str | None] = mapped_column(String(255), nullable=True)
    grade_level: Mapped[str | None] = mapped_column(String(64), nullable=True)
    objectives: Mapped[list | None] = mapped_column(JSON, nullable=True, default=list)
    activities: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    materials: Mapped[list | None] = mapped_column(JSON, nullable=True, default=list)
    duration_minutes: Mapped[int | None] = mapped_column(nullable=True)
    ai_generated: Mapped[bool] = mapped_column(Boolean, default=False)
    content: Mapped[str | None] = mapped_column(Text, nullable=True)

    teacher = relationship("User", back_populates="lesson_plans")
