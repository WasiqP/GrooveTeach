from datetime import date, datetime

from pydantic import BaseModel

from app.schemas.common import SchemaBase


class AttendanceMark(BaseModel):
    student_id: str
    status: str = "present"


class AttendanceBulkCreate(BaseModel):
    class_id: str
    date: date
    records: list[AttendanceMark]


class AttendanceRead(SchemaBase):
    id: str
    class_id: str
    student_id: str
    date: date
    status: str
    marked_by: str
    created_at: datetime
