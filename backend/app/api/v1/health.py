from fastapi import APIRouter

from app.core.config import settings

router = APIRouter(tags=["health"])


@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }


@router.get("/")
def root():
    return {
        "status": 200,
        "message": "GrooveTeach API is running",
        "docs": "/docs",
        "api_v1": settings.API_V1_PREFIX,
    }
