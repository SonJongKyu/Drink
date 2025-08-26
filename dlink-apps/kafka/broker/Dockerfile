# 1. Amazon Corretto 17을 베이스 이미지로 사용
FROM amazoncorretto:17

# 2. 필요한 패키지 설치
RUN yum update -y && \
    yum install -y wget tar gzip gettext && \
    yum clean all

# 3. Kafka 버전 및 설치 경로 설정
ENV KAFKA_VERSION=3.9.0
ENV SCALA_VERSION=2.13
ENV KAFKA_HOME=/usr/local/kafka

# 4. Kafka 다운로드 및 설치
RUN wget https://downloads.apache.org/kafka/${KAFKA_VERSION}/kafka_${SCALA_VERSION}-${KAFKA_VERSION}.tgz && \
    tar -xzf kafka_${SCALA_VERSION}-${KAFKA_VERSION}.tgz -C /usr/local && \
    mv /usr/local/kafka_${SCALA_VERSION}-${KAFKA_VERSION} ${KAFKA_HOME} && \
    rm kafka_${SCALA_VERSION}-${KAFKA_VERSION}.tgz

# 5. Kafka 설정 파일 복사 (템플릿 형태)
COPY server.properties.template /usr/local/kafka/config/server.properties.template
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# 6. Kafka 기본 포트 노출
EXPOSE 9092

# 7. Kafka 실행
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

