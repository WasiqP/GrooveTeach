from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.common import SchemaBase


class TaskCreate(BaseModel):
    class_id: str
    name: str = Field(min_length=1, max_length=255)
    task_type: str | None = None
    subject_id: str | None = None
    due_date: datetime | None = None
    visibility: str = "class-only"
    questions: list | None = None


class TaskUpdate(BaseModel):
    name: str | None = None
    task_type: str | None = None
    due_date: datetime | None = None
    visibility: str | None = None
    questions: list | None = None
    published: bool | None = None


class TaskRead(SchemaBase):
    id: str
    teacher_id: str
    class_id: str
    name: str
    task_type: str | None
    published: bool
    share_token: str | None
    created_at: datetime
    updated_at: datetime


class TaskSubmissionCreate(BaseModel):
    answers: dict
    student_id: str | None = None
    respondent_email: str | None = None
