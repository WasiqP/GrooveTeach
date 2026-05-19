from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.api.deps import CurrentUser, DbSession
from app.models.class_model import ClassModel
from app.schemas.class_schema import ClassCreate, ClassRead, ClassUpdate

router = APIRouter(prefix="/classes", tags=["classes"])


@router.get("", response_model=list[ClassRead])
def list_classes(db: DbSession, current_user: CurrentUser):
    rows = db.scalars(
        select(ClassModel).where(ClassModel.teacher_id == current_user.id).order_by(ClassModel.created_at.desc())
    ).all()
    return [ClassRead.model_validate(row) for row in rows]


@router.post("", response_model=ClassRead, status_code=status.HTTP_201_CREATED)
def create_class(data: ClassCreate, db: DbSession, current_user: CurrentUser):
    class_ = ClassModel(teacher_id=current_user.id, **data.model_dump())
    db.add(class_)
    db.commit()
    db.refresh(class_)
    return ClassRead.model_validate(class_)


@router.get("/{class_id}", response_model=ClassRead)
def get_class(class_id: str, db: DbSession, current_user: CurrentUser):
    class_ = _get_owned_class(db, current_user.id, class_id)
    return ClassRead.model_validate(class_)


@router.patch("/{class_id}", response_model=ClassRead)
def update_class(class_id: str, data: ClassUpdate, db: DbSession, current_user: CurrentUser):
    class_ = _get_owned_class(db, current_user.id, class_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(class_, field, value)
    db.add(class_)
    db.commit()
    db.refresh(class_)
    return ClassRead.model_validate(class_)


@router.delete("/{class_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_class(class_id: str, db: DbSession, current_user: CurrentUser):
    class_ = _get_owned_class(db, current_user.id, class_id)
    db.delete(class_)
    db.commit()


def _get_owned_class(db: DbSession, teacher_id: str, class_id: str) -> ClassModel:
    class_ = db.get(ClassModel, class_id)
    if class_ is None or class_.teacher_id != teacher_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Class not found")
    return class_
