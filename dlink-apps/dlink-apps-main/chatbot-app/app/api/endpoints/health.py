from fastapi import APIRouter

from app.schemas.health import HealthResponse
from app.utils.logger import setup_logger

# 헬스 체크 전용 로거 설정
logger = setup_logger("health_endpoint")

# 라우터 설정
router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    서비스 헬스 체크 엔드포인트
    
    시스템이 정상 작동 중인지 확인합니다.
    
    Returns:
        상태 정보
    """
    logger.debug("헬스 체크 요청 수신")
    return HealthResponse(status="healthy") 