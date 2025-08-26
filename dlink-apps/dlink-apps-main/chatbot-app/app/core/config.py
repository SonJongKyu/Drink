import os
from typing import List
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# 환경변수 로드
load_dotenv()


class Settings(BaseSettings):
    """애플리케이션 설정 클래스"""
    # 앱 설정
    PROJECT_NAME: str = "DLink Chat Service"
    DEBUG: bool = os.getenv("DEBUG", "True").lower() in ("true", "1", "t")
    API_PREFIX: str = "/api"
    
    # OpenAI 설정
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
    SYSTEM_MESSAGE: str = os.getenv(
        "SYSTEM_MESSAGE", 
        "You are a helpful assistant for DLink alcohol recommendation service."
    )
    OPENAI_TIMEOUT: int = int(os.getenv("OPENAI_TIMEOUT", "60"))  # 요청 타임아웃(초)
    OPENAI_MAX_RETRIES: int = int(os.getenv("OPENAI_MAX_RETRIES", "3"))  # 최대 재시도 횟수
    
    # 서버 설정
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # CORS 설정
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "https://dlink.example.com",
    ]
    
    class Config:
        env_file = ".env"


# 설정 인스턴스 생성
settings = Settings() 