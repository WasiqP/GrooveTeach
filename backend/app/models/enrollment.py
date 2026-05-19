from sqlalchemy import ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class Enrollment(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "enrollments"
    __table_args__ = (UniqueConstraint("class_id", "student_id", name="uq_class_student"),)

    class_id: Mapped[str] = mapped_column(String(36), ForeignKey("classes.id"), index=True)
    student_id: Mapped[str] = mapped_column(String(36), ForeignKey("students.id"), index=True)

    class_ = relationship("ClassModel", back_populates="enrollments")
    student = relationship("Student", back_populates="enrollments")
