from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class Form(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "forms"

    teacher_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    icon_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    fields: Mapped[list | None] = mapped_column(JSON, nullable=True, default=list)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    shareable_link: Mapped[str | None] = mapped_column(String(512), nullable=True)
    response_count: Mapped[int] = mapped_column(default=0)

    teacher = relationship("User", back_populates="forms")
    responses = relationship("FormResponse", back_populates="form", cascade="all, delete-orphan")


class FormResponse(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "form_responses"

    form_id: Mapped[str] = mapped_column(String(36), ForeignKey("forms.id"), index=True)
    answers: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    respondent_email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    form = relationship("Form", back_populates="responses")
