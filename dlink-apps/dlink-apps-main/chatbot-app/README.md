# DLink Chat Service

DLink 알코올 추천 서비스를 위한 채팅 API 백엔드입니다.

## 프로젝트 구조

```
.
├── app/                  # 애플리케이션 패키지
│   ├── api/              # API 엔드포인트
│   │   ├── endpoints/    # 엔드포인트 모듈
│   │   └── routes.py     # 라우터 설정
│   ├── core/             # 핵심 설정
│   ├── middlewares/      # 미들웨어
│   ├── schemas/          # 데이터 모델
│   ├── services/         # 비즈니스 로직
│   ├── utils/            # 유틸리티 함수
│   └── main.py           # 애플리케이션 인스턴스
├── .env.example          # 환경변수 샘플
├── requirements.txt      # 의존성 패키지
└── run.py                # 서버 실행 스크립트
```

## 설치 및 실행

### 환경 설정

1. 가상환경 생성 및 활성화
```bash
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# 또는
.venv\Scripts\activate  # Windows
```

2. 의존성 설치
```bash
pip install -r requirements.txt
```

3. 환경 변수 설정
```bash
cp .env.example .env  # 샘플 파일 복사
# .env 파일을 열어 OPENAI_API_KEY 설정
```

### 실행 방법

서버 실행:
```bash
python run.py
```

또는 직접 uvicorn 사용:
```bash
uvicorn app.main:app --reload
```

## API 엔드포인트

- `POST /api/chat`: 채팅 요청 처리
- `GET /api/health`: 서비스 헬스 체크

## 환경 변수

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| DEBUG | 디버그 모드 활성화 | True |
| HOST | 서버 호스트 | 0.0.0.0 |
| PORT | 서버 포트 | 8000 |
| OPENAI_API_KEY | OpenAI API 키 | - |
| OPENAI_MODEL | 사용할 OpenAI 모델 | gpt-3.5-turbo |
| SYSTEM_MESSAGE | 시스템 메시지 | You are a helpful assistant... | 