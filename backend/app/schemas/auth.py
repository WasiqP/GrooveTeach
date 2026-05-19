from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.schemas.common import SchemaBase


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    name: str = Field(min_length=1, max_length=255)
    school_name: str | None = None
    institution_name: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: str | None = None
    school_name: str | None = None
    institution_name: str | None = None
    subjects: list[str] | None = None
    avatar_url: str | None = None


class UserRead(SchemaBase):
    id: str
    email: EmailStr
    name: str
    school_name: str | None = None
    institution_name: str | None = None
    subjects: list[str] | None = None
    avatar_url: str | None = None
    is_active: bool
    created_at: datetime
    updated_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead
