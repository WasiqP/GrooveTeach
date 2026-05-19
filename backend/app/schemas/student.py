from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.schemas.common import SchemaBase


class StudentCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    email: EmailStr | None = None
    parent_email: EmailStr | None = None
    parent_phone: str | None = None
    class_id: str | None = None


class StudentUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    parent_email: EmailStr | None = None
    parent_phone: str | None = None


class StudentRead(SchemaBase):
    id: str
    name: str
    email: str | None
    parent_email: str | None
    parent_phone: str | None
    created_at: datetime
    updated_at: datetime
