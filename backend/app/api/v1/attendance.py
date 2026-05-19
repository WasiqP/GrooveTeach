from fastapi import APIRouter, status
from sqlalchemy import select

from app.api.deps import CurrentUser, DbSession
from app.models.attendance import AttendanceRecord
from app.schemas.attendance import AttendanceBulkCreate, AttendanceRead

router = APIRouter(prefix="/attendance", tags=["attendance"])


@router.get("", response_model=list[AttendanceRead])
def list_attendance(db: DbSession, current_user: CurrentUser, class_id: str, date: str | None = None):
    query = select(AttendanceRecord).where(AttendanceRecord.class_id == class_id)
    if date:
        query = query.where(AttendanceRecord.date == date)
    rows = db.scalars(query).all()
    return [AttendanceRead.model_validate(row) for row in rows]


@router.post("/bulk", response_model=list[AttendanceRead], status_code=status.HTTP_201_CREATED)
def mark_attendance_bulk(data: AttendanceBulkCreate, db: DbSession, current_user: CurrentUser):
    created: list[AttendanceRecord] = []
    for record in data.records:
        row = AttendanceRecord(
            class_id=data.class_id,
            date=data.date,
            student_id=record.student_id,
            status=record.status,
            marked_by=current_user.id,
        )
        db.add(row)
        created.append(row)
    db.commit()
    for row in created:
        db.refresh(row)
    return [AttendanceRead.model_validate(row) for row in created]
