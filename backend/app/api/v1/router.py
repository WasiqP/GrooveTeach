from fastapi import APIRouter

from app.api.v1 import (
    attendance,
    auth,
    classes,
    forms,
    health,
    homework,
    lesson_plans,
    schedule,
    students,
    tasks,
)

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(classes.router)
api_router.include_router(students.router)
api_router.include_router(tasks.router)
api_router.include_router(attendance.router)
api_router.include_router(homework.router)
api_router.include_router(schedule.router)
api_router.include_router(forms.router)
api_router.include_router(lesson_plans.router)
