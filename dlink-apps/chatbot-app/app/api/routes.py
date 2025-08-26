from fastapi import APIRouter
from app.api.endpoints import chat, health
from app.core.config import settings

# API 라우터 생성
api_router = APIRouter(prefix=settings.API_PREFIX)

# 엔드포인트 라우터 포함
api_router.include_router(chat.router, tags=["chat"])
api_router.include_router(health.router, tags=["system"]) 