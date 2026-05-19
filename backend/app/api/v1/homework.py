from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.api.deps import CurrentUser, DbSession
from app.models.homework import Homework

router = APIRouter(prefix="/homework", tags=["homework"])


@router.get("")
def list_homework(db: DbSession, current_user: CurrentUser, class_id: str | None = None):
    query = select(Homework).where(Homework.teacher_id == current_user.id)
    if class_id:
        query = query.where(Homework.class_id == class_id)
    rows = db.scalars(query.order_by(Homework.created_at.desc())).all()
    return rows


@router.post("", status_code=status.HTTP_201_CREATED)
def create_homework(payload: dict, db: DbSession, current_user: CurrentUser):
    homework = Homework(teacher_id=current_user.id, **payload)
    db.add(homework)
    db.commit()
    db.refresh(homework)
    return homework


@router.get("/{homework_id}")
def get_homework(homework_id: str, db: DbSession, current_user: CurrentUser):
    homework = db.get(Homework, homework_id)
    if homework is None or homework.teacher_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Homework not found")
    return homework
