#!/bin/bash

# 1. 환경 변수 확인
echo "BROKER_ID=${BROKER_ID}"
echo "ZOOKEEPER_CONNECT=${ZOOKEEPER_CONNECT}"
echo "LISTENERS=${LISTENERS}"
echo "ADVERTISED_LISTENERS=${ADVERTISED_LISTENERS}"
echo "LOG_DIRS=${LOG_DIRS}"

# 2. server.properties 환경 변수 치환하여 생성
envsubst < /usr/local/kafka/config/server.properties.template > /usr/local/kafka/config/server.properties

# 3. 생성된 server.properties 확인
echo "Generated server.properties:"
cat /usr/local/kafka/config/server.properties

# 4. Kafka 브로커 실행
exec ${KAFKA_HOME}/bin/kafka-server-start.sh ${KAFKA_HOME}/config/server.properties

