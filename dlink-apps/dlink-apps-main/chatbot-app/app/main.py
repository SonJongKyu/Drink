from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from openai import BadRequestError, AuthenticationError, RateLimitError
from starlette.middleware.exceptions import ExceptionMiddleware

from app.api.routes import api_router
from app.core.config import settings
from app.utils.logger import logger


def create_app() -> FastAPI:
    """FastAPI 애플리케이션 생성 및 설정"""
    logger.info("애플리케이션 초기화 중...")
    
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description="DLink 알코올 추천 서비스를 위한 채팅 API",
        version="0.1.0",
    )
    
    # CORS 설정
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # 예외 처리 미들웨어 설정 - 스트리밍 응답에서 예외 발생 시 더 안전하게 처리
    app.add_middleware(
        ExceptionMiddleware,
        handlers=app.exception_handlers,
        debug=settings.DEBUG
    )
    
    # 전역 예외 핸들러 등록
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        logger.warning(f"요청 검증 오류: {str(exc)}")
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"detail": "요청 데이터 형식이 올바르지 않습니다.", "errors": exc.errors()},
        )
    
    @app.exception_handler(BadRequestError)
    async def openai_bad_request_handler(request: Request, exc: BadRequestError):
        logger.warning(f"OpenAI 요청 오류: {str(exc)}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST, 
            content={"detail": "OpenAI 요청 오류: " + str(exc)}
        )
    
    @app.exception_handler(AuthenticationError)
    async def openai_auth_handler(request: Request, exc: AuthenticationError):
        logger.error(f"OpenAI API 인증 오류: {str(exc)}")
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"detail": "OpenAI API 인증 오류. API 키를 확인하세요."},
        )
    
    @app.exception_handler(RateLimitError)
    async def openai_rate_limit_handler(request: Request, exc: RateLimitError):
        error_msg = str(exc).lower()
        
        # 할당량 초과 에러 확인
        if "insufficient_quota" in error_msg or "exceeded your current quota" in error_msg:
            logger.error(f"OpenAI API 할당량 초과: {str(exc)}")
            return JSONResponse(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                content={
                    "detail": "OpenAI API 할당량이 초과되었습니다. 결제 정보를 확인하세요.",
                    "error_code": "insufficient_quota"
                },
            )
        # 일반 속도 제한 에러
        else:
            logger.warning(f"OpenAI API 속도 제한: {str(exc)}")
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "detail": "OpenAI API 요청 제한에 도달했습니다. 잠시 후 다시 시도하세요.",
                    "error_code": "rate_limit_exceeded"
                },
            )
    
    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        logger.error(f"서버 오류: {str(exc)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": f"서버 오류: {str(exc)}"},
        )
    
    # API 라우터 등록
    app.include_router(api_router)
    
    logger.info("애플리케이션 초기화 완료")
    return app


# 앱 인스턴스 생성
app = create_app()