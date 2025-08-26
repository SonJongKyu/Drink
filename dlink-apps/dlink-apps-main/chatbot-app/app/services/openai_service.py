from typing import List, Optional, Iterator, Dict
from openai import OpenAI, RateLimitError
import httpx
import time
from functools import wraps

from app.core.config import settings
from app.utils.logger import setup_logger

# 서비스 전용 로거 설정
logger = setup_logger("openai_service")


def retry_on_rate_limit(max_retries=3, initial_delay=1, backoff_factor=2):
    """
    OpenAI API 요청 시 속도 제한에 걸렸을 때 재시도하는 데코레이터
    할당량 초과(insufficient_quota) 에러는 재시도하지 않음
    
    Args:
        max_retries: 최대 재시도 횟수
        initial_delay: 초기 대기 시간(초)
        backoff_factor: 대기 시간 증가 비율
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            delay = initial_delay
            
            for retry in range(max_retries + 1):
                try:
                    return func(*args, **kwargs)
                except RateLimitError as e:
                    # 할당량 초과 에러는 재시도하지 않음
                    error_msg = str(e).lower()
                    if "insufficient_quota" in error_msg or "exceeded your current quota" in error_msg:
                        logger.error(f"OpenAI API 할당량 초과: {str(e)}")
                        raise
                    
                    # 마지막 시도에서도 실패하면 예외 발생
                    if retry >= max_retries:
                        logger.error(f"최대 재시도 횟수({max_retries}) 초과: {str(e)}")
                        raise
                    
                    # 대기 후 재시도
                    logger.warning(f"OpenAI API 속도 제한으로 {delay}초 후 재시도 ({retry+1}/{max_retries})")
                    time.sleep(delay)
                    delay *= backoff_factor  # 대기 시간 증가
        return wrapper
    return decorator


class OpenAIService:
    """OpenAI API를 사용하여 채팅 응답을 생성하는 서비스"""

    def __init__(self):
        logger.debug("OpenAI 서비스 초기화 중...")
        self.client = OpenAI(
            api_key=settings.OPENAI_API_KEY, 
            http_client=httpx.Client(timeout=60.0)  # 타임아웃 설정 추가
        )
        self.model = settings.OPENAI_MODEL
        self.system_message = settings.SYSTEM_MESSAGE
        logger.info(f"OpenAI 서비스 초기화 완료 (모델: {self.model})")

    def _check_api_key(self):
        """OpenAI API 키가 설정되었는지 확인"""
        if not settings.OPENAI_API_KEY or settings.OPENAI_API_KEY.strip() == "":
            logger.error("OpenAI API 키가 설정되지 않았습니다.")
            raise ValueError("OpenAI API 키가 설정되지 않았습니다. 환경 변수를 확인하세요.")

    def check_api_status(self):
        """
        OpenAI API 상태를 미리 확인하는 메소드
        할당량 초과 등의 문제를 스트리밍 전에 발견하기 위해 간단한 요청 테스트
        """
        try:
            # 간단한 비스트리밍 요청으로 API 상태 확인
            self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "system", "content": "API 상태 확인"}],
                max_tokens=5,  # 아주 짧은 응답만 요청
                stream=False   # 스트리밍 아님
            )
            return True
        except Exception as e:
            logger.error(f"OpenAI API 상태 확인 중 오류: {str(e)}")
            # 원본 예외를 그대로 다시 발생시켜 핸들러에서 처리하도록 함
            raise

    @retry_on_rate_limit()
    def generate_chat_stream(
        self, message: str, history: Optional[List[Dict[str, str]]] = None
    ) -> Iterator[str]:
        """채팅 메시지를 생성하는 스트리밍 응답을 반환합니다."""
        if not message:
            logger.warning("빈 메시지로 요청이 들어왔습니다.")
            return
            
        # API 키 확인
        self._check_api_key()
            
        # 스트리밍 전 API 상태 확인 (할당량 초과 여부 등)
        self.check_api_status()
            
        logger.debug(f"채팅 요청: {message[:50]}{'...' if len(message) > 50 else ''}")
        
        messages = [
            {"role": "system", "content": self.system_message},
            *(history or []),
            {"role": "user", "content": message}
        ]
        
        logger.debug(f"총 {len(messages)} 개의 메시지로 OpenAI API 요청 시작")
        
        # 스트리밍 응답을 시작하기 전에 컴플리션 객체 생성
        # 이렇게 하면 응답 스트림이 시작되기 전에 에러가 발생하므로 더 깔끔하게 처리됨
        completion = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            stream=True
        )
        
        try:
            for chunk in completion:
                if chunk.choices[0].delta and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
            
            logger.debug("OpenAI API 응답 스트리밍 완료")
        except Exception as e:
            logger.error(f"OpenAI API 응답 스트리밍 중 오류 발생: {str(e)}")
            raise
