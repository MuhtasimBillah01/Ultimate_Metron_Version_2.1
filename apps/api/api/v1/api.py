from fastapi import APIRouter
from api.v1.endpoints import general

api_router = APIRouter()

# Include General Routes (Health, Root) - Tags for Swagger UI grouping
api_router.include_router(general.router, tags=["General"])
