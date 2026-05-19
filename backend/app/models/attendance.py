from datetime import date

from sqlalchemy import Date, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class AttendanceRecord(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "attendance_records"
    __table_args__ = (
        UniqueConstraint("class_id", "date", "student_id", name="uq_attendance_class_date_student"),
    )

    class_id: Mapped[str] = mapped_column(String(36), ForeignKey("classes.id"), index=True)
    student_id: Mapped[str] = mapped_column(String(36), ForeignKey("students.id"), index=True)
    date: Mapped[date] = mapped_column(Date, index=True)
    status: Mapped[str] = mapped_column(String(16), default="present")
    marked_by: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"))

    class_ = relationship("ClassModel", back_populates="attendance_records")
    student = relationship("Student", back_populates="attendance_records")
