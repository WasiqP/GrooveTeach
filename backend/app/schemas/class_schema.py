from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.common import SchemaBase


class ClassCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    class_type: str = "single-subject"
    subject: str | None = None
    subjects: list[dict] | None = None
    parent_id: str | None = None
    education_level: str | None = None
    grade_level: str | None = None
    schedule: dict | None = None
    room_number: str | None = None
    location: str | None = None
    institution_name: str | None = None


class ClassUpdate(BaseModel):
    name: str | None = None
    class_type: str | None = None
    subject: str | None = None
    subjects: list[dict] | None = None
    education_level: str | None = None
    grade_level: str | None = None
    schedule: dict | None = None
    room_number: str | None = None
    location: str | None = None
    institution_name: str | None = None


class ClassRead(SchemaBase):
    id: str
    teacher_id: str
    name: str
    class_type: str
    subject: str | None
    subjects: list | None
    parent_id: str | None
    child_class_ids: list | None
    education_level: str | None
    grade_level: str | None
    schedule: dict | None
    room_number: str | None
    location: str | None
    institution_name: str | None
    created_at: datetime
    updated_at: datetime
