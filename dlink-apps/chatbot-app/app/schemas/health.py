from pydantic import BaseModel


class HealthResponse(BaseModel):
    """헬스 체크 응답을 위한 스키마"""
    status: str 