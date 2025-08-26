from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import StreamingResponse, JSONResponse
from starlette.background import BackgroundTask
from openai import RateLimitError, BadRequestError, AuthenticationError
import asyncio

from app.schemas.chat import ChatRequest
from app.services.openai_service import OpenAIService
from app.utils.logger import setup_logger

# 엔드포인트 전용 로거 설정
logger = setup_logger("chat_endpoint")

# 라우터 설정
router = APIRouter()

# 서비스 인스턴스 생성
openai_service = OpenAIService()


def get_openai_service() -> OpenAIService:
    """OpenAI 서비스 의존성 주입"""
    return openai_service


async def stream_with_fallback_error(request: ChatRequest, service: OpenAIService):
    """
    채팅 스트림을 생성하거나 에러 발생 시 에러 메시지를 반환하는 스트림
    
    이 접근 방식은 스트리밍 응답이 시작된 후 에러가 발생해도
    클라이언트에게 적절한 에러 메시지를 전달할 수 있게 합니다.
    """
    error_occurred = False
    error_message = None
    
    try:
        # 스트리밍 전 API 상태 확인 (할당량 초과 등)
        # 여기서 문제가 발생하면 스트리밍 시작 전에 에러를 잡아냄
        if not request.message or not request.message.strip():
            raise ValueError("메시지는 비어있을 수 없습니다.")
            
        # 스트림 생성
        chat_stream = service.generate_chat_stream(
            message=request.message,
            history=request.history
        )
        
        # 정상적인 스트리밍 응답 반환
        for token in chat_stream:
            yield token
            # 비동기 처리를 위한 짧은 대기
            await asyncio.sleep(0)
            
    except RateLimitError as e:
        error_occurred = True
        error_msg = str(e).lower()
        if "insufficient_quota" in error_msg or "exceeded your current quota" in error_msg:
            error_message = "\n\n[오류: OpenAI API 할당량이 초과되었습니다. 관리자에게 문의하세요.]"
        else:
            error_message = "\n\n[오류: OpenAI API 요청 제한에 도달했습니다. 잠시 후 다시 시도하세요.]"
        logger.error(f"OpenAI API 속도 제한 오류: {str(e)}")
    
    except AuthenticationError as e:
        error_occurred = True
        error_message = "\n\n[오류: OpenAI API 인증 오류가 발생했습니다. 관리자에게 문의하세요.]"
        logger.error(f"OpenAI API 인증 오류: {str(e)}")
    
    except BadRequestError as e:
        error_occurred = True
        error_message = "\n\n[오류: 잘못된 요청 형식입니다. 다시 시도하세요.]"
        logger.error(f"OpenAI API 요청 오류: {str(e)}")
        
    except Exception as e:
        error_occurred = True
        error_message = f"\n\n[오류: 서비스에 문제가 발생했습니다. 잠시 후 다시 시도하세요.]"
        logger.error(f"채팅 스트림 생성 중 오류: {str(e)}")
    
    # 에러가 발생했고 에러 메시지가 설정되었다면 클라이언트에게 에러 메시지 전송
    if error_occurred and error_message:
        yield error_message


@router.post("/chat")
async def chat(request: Request, chat_request: ChatRequest, service: OpenAIService = Depends(get_openai_service)):
    """
    채팅 응답을 스트리밍 형태로 반환하는 엔드포인트
    
    Args:
        request: FastAPI 요청 객체
        chat_request: 채팅 요청 (메시지 및 대화 기록)
        
    Returns:
        스트리밍 텍스트 응답
    """
    logger.info(f"채팅 요청 수신: {chat_request.message[:30]}...")
    
    # 스트리밍 응답 생성 (에러 처리 포함)
    return StreamingResponse(
        stream_with_fallback_error(chat_request, service),
        media_type="text/plain"
    ) 