from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.api.deps import CurrentUser, DbSession
from app.models.enrollment import Enrollment
from app.models.student import Student
from app.schemas.student import StudentCreate, StudentRead, StudentUpdate

router = APIRouter(prefix="/students", tags=["students"])


@router.get("", response_model=list[StudentRead])
def list_students(db: DbSession, current_user: CurrentUser, class_id: str | None = None):
    if class_id:
        rows = db.scalars(
            select(Student)
            .join(Enrollment, Enrollment.student_id == Student.id)
            .where(Enrollment.class_id == class_id)
        ).all()
    else:
        rows = db.scalars(select(Student).order_by(Student.created_at.desc())).all()
    return [StudentRead.model_validate(row) for row in rows]


@router.post("", response_model=StudentRead, status_code=status.HTTP_201_CREATED)
def create_student(data: StudentCreate, db: DbSession, current_user: CurrentUser):
    student = Student(
        name=data.name,
        email=data.email,
        parent_email=data.parent_email,
        parent_phone=data.parent_phone,
    )
    db.add(student)
    db.flush()
    if data.class_id:
        db.add(Enrollment(class_id=data.class_id, student_id=student.id))
    db.commit()
    db.refresh(student)
    return StudentRead.model_validate(student)


@router.get("/{student_id}", response_model=StudentRead)
def get_student(student_id: str, db: DbSession, current_user: CurrentUser):
    student = _get_student(db, student_id)
    return StudentRead.model_validate(student)


@router.patch("/{student_id}", response_model=StudentRead)
def update_student(student_id: str, data: StudentUpdate, db: DbSession, current_user: CurrentUser):
    student = _get_student(db, student_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(student, field, value)
    db.add(student)
    db.commit()
    db.refresh(student)
    return StudentRead.model_validate(student)


@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(student_id: str, db: DbSession, current_user: CurrentUser):
    student = _get_student(db, student_id)
    db.delete(student)
    db.commit()


def _get_student(db: DbSession, student_id: str) -> Student:
    student = db.get(Student, student_id)
    if student is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    return student
