
# Python 3.10.12-alpine 기반 이미지 사용
FROM python:3.10.12-alpine

# 시스템 패키지 업데이트 및 필수 패키지 설치 RUN apk update && apk add --no-cache \
    bash \
    wget \
    curl \
    unzip \
    jq \
    && rm -rf /var/cache/apk/*

# 작업 디렉토리 설정
WORKDIR /app

# requirements.txt 파일 복사 및 Python 의존성 설치
COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

# Bedrock Kafka Consumer 스크립트 복사
COPY highballConsumer.py /app/highballConsumer.py

# 실행 권한 부여
RUN chmod +x /app/highballConsumer.py


# 컨테이너 실행 시 Bedrock Consumer 시작
CMD ["python", "/app/highballConsumer.py"]
