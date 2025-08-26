# Python 3.10.12-alpine 기반 이미지 사용
FROM python:3.10.12-alpine

# 시스템 패키지 업데이트 및 Chrome, ChromeDriver 실행에 필요한 패키지 설치
RUN apk update && apk add --no-cache \
    bash \
    wget \
    curl \
    unzip \
    chromium \
    chromium-chromedriver \
    && rm -rf /var/cache/apk/*

# 작업 디렉토리 설정
WORKDIR /app

# requirements.txt 파일 복사 및 Python 의존성 설치
COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

# 크롤러 및 프로듀서 스크립트 복사
COPY . /app

# 컨테이너 시작 시 highballProducer.py 실행
CMD ["python", "highballProducer.py"]

