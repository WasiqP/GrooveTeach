from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class ScheduleEvent(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "schedule_events"

    teacher_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True)
    class_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("classes.id"), nullable=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    end_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    color: Mapped[str | None] = mapped_column(String(32), nullable=True)

    teacher = relationship("User", back_populates="schedule_events")
    class_ = relationship("ClassModel", back_populates="schedule_events")
