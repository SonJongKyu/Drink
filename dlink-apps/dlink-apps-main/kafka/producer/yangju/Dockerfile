# Python 3.10.12-alpine 기반 이미지 사용
FROM python:3.10.12-alpine

# 필수 패키지 설치
RUN apk update && apk add --no-cache \
    wget \
    gnupg \
    unzip \
    curl \
    nss \
    libxi \
    libxcursor \
    libxrandr \
    libxtst \
    ttf-liberation \
    xdg-utils \
    chromium \
    chromium-chromedriver

# 작업 디렉토리 설정
WORKDIR /app

# requirements.txt 파일 복사 및 Python 의존성 설치
COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

# 현재 디렉토리의 모든 파일을 컨테이너로 복사 (yangjuProducer.py 포함)
COPY . /app

# 컨테이너 시작 시 환경 변수를 사용하도록 설정
CMD ["sh", "-c", "python yangjuProducer.py"]

