from fastapi import APIRouter
from core.config import settings

router = APIRouter()

@router.get("/")
def read_root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "status": "active",
        "version": "2.0.0"
    }

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "services": {
            "api": "online",
            "database": "checking...", # TODO: Implement real DB check
            "redis": "checking..."     # TODO: Implement real Redis check
        }
    }
