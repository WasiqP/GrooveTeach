from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.api.deps import CurrentUser, DbSession
from app.models.lesson_plan import LessonPlan

router = APIRouter(prefix="/lesson-plans", tags=["lesson-plans"])


@router.get("")
def list_lesson_plans(db: DbSession, current_user: CurrentUser):
    rows = db.scalars(
        select(LessonPlan)
        .where(LessonPlan.teacher_id == current_user.id)
        .order_by(LessonPlan.created_at.desc())
    ).all()
    return rows


@router.post("", status_code=status.HTTP_201_CREATED)
def create_lesson_plan(payload: dict, db: DbSession, current_user: CurrentUser):
    plan = LessonPlan(teacher_id=current_user.id, **payload)
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan


@router.get("/{plan_id}")
def get_lesson_plan(plan_id: str, db: DbSession, current_user: CurrentUser):
    plan = db.get(LessonPlan, plan_id)
    if plan is None or plan.teacher_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson plan not found")
    return plan
