from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from openai import BadRequestError, AuthenticationError, RateLimitError
from typing import Callable, Any
from app.utils.logger import setup_logger

# 에러 핸들러 전용 로거 설정
logger = setup_logger("error_handler")

async def error_handler_middleware(request: Request, call_next: Callable) -> Any:
    """
    전역 에러 핸들링 미들웨어
    모든 예외를 캐치하여 적절한 응답으로 변환
    """
    try:
        return await call_next(request)
    except RequestValidationError as e:
        logger.warning(f"요청 검증 오류: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"detail": "요청 데이터 형식이 올바르지 않습니다.", "errors": e.errors()},
        )
    except BadRequestError as e:
        logger.warning(f"OpenAI 요청 오류: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST, 
            content={"detail": "OpenAI 요청 오류: " + str(e)}
        )
    except AuthenticationError as e:
        logger.error(f"OpenAI API 인증 오류: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"detail": "OpenAI API 인증 오류. API 키를 확인하세요."},
        )
    except RateLimitError as e:
        error_msg = str(e).lower()
        
        # 할당량 초과 에러 확인
        if "insufficient_quota" in error_msg or "exceeded your current quota" in error_msg:
            logger.error(f"OpenAI API 할당량 초과: {str(e)}")
            return JSONResponse(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                content={
                    "detail": "OpenAI API 할당량이 초과되었습니다. 결제 정보를 확인하세요.",
                    "error_code": "insufficient_quota"
                },
            )
        # 일반 속도 제한 에러
        else:
            logger.warning(f"OpenAI API 속도 제한: {str(e)}")
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "detail": "OpenAI API 요청 제한에 도달했습니다. 잠시 후 다시 시도하세요.",
                    "error_code": "rate_limit_exceeded"
                },
            )
    except Exception as e:
        logger.error(f"서버 오류: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": f"서버 오류: {str(e)}"},
        ) 