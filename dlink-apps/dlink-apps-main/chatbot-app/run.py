import uvicorn
import os
from dotenv import load_dotenv

# 환경변수 로드
load_dotenv()

if __name__ == "__main__":
    """
    애플리케이션 실행
    `python run.py` 명령으로 서버 실행
    """
    uvicorn.run(
        "app.main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", "8000")),
        reload=bool(os.getenv("DEBUG", "True").lower() in ("true", "1", "t")),
    ) 