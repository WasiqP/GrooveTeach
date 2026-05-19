import secrets
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.api.deps import CurrentUser, DbSession
from app.models.task import Task, TaskSubmission
from app.schemas.task import TaskCreate, TaskRead, TaskSubmissionCreate, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=list[TaskRead])
def list_tasks(db: DbSession, current_user: CurrentUser, class_id: str | None = None):
    query = select(Task).where(Task.teacher_id == current_user.id)
    if class_id:
        query = query.where(Task.class_id == class_id)
    rows = db.scalars(query.order_by(Task.created_at.desc())).all()
    return [TaskRead.model_validate(row) for row in rows]


@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(data: TaskCreate, db: DbSession, current_user: CurrentUser):
    task = Task(teacher_id=current_user.id, **data.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return TaskRead.model_validate(task)


@router.get("/{task_id}", response_model=TaskRead)
def get_task(task_id: str, db: DbSession, current_user: CurrentUser):
    task = _get_owned_task(db, current_user.id, task_id)
    return TaskRead.model_validate(task)


@router.patch("/{task_id}", response_model=TaskRead)
def update_task(task_id: str, data: TaskUpdate, db: DbSession, current_user: CurrentUser):
    task = _get_owned_task(db, current_user.id, task_id)
    updates = data.model_dump(exclude_unset=True)
    if updates.get("published") and not task.share_token:
        task.share_token = secrets.token_urlsafe(16)
        task.published_at = datetime.now(timezone.utc)
    for field, value in updates.items():
        setattr(task, field, value)
    db.add(task)
    db.commit()
    db.refresh(task)
    return TaskRead.model_validate(task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: str, db: DbSession, current_user: CurrentUser):
    task = _get_owned_task(db, current_user.id, task_id)
    db.delete(task)
    db.commit()


@router.post("/{task_id}/submissions", status_code=status.HTTP_201_CREATED)
def submit_task(task_id: str, data: TaskSubmissionCreate, db: DbSession):
    task = db.get(Task, task_id)
    if task is None or not task.published:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found or not published")
    submission = TaskSubmission(
        task_id=task_id,
        student_id=data.student_id,
        answers=data.answers,
        respondent_email=data.respondent_email,
        submitted_at=datetime.now(timezone.utc),
    )
    db.add(submission)
    db.commit()
    return {"id": submission.id, "message": "Submission recorded"}


def _get_owned_task(db: DbSession, teacher_id: str, task_id: str) -> Task:
    task = db.get(Task, task_id)
    if task is None or task.teacher_id != teacher_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task
