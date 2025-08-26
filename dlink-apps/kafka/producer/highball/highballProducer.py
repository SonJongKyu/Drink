import os
from kafka import KafkaProducer
import json
from highballCrawler import crawlHighball

# ✅ Kafka 브로커 주소를 환경 변수에서 가져옴 (기본값: 'localhost:9092')
kafka_brokers = os.getenv("KAFKA_BROKERS", "localhost:9092").split(",")

# ✅ Kafka 프로듀서 설정
producer = KafkaProducer(
    bootstrap_servers=kafka_brokers,
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

def sendToKafka(topic, data):
    """ Kafka 토픽으로 데이터를 전송하는 함수 """
    print(f"📡 [INFO] {topic} 토픽으로 {len(data)}개 데이터 전송 시작...")
    for item in data:
        print(f"📨 [INFO] {topic} 전송 데이터: {item['korName']}")
        producer.send(topic, value=item)
    producer.flush()
    print(f"✅ [SUCCESS] {topic} 전송 완료!")

if __name__ == "__main__":
    print(f"🔗 [INFO] Kafka 연결 정보: {kafka_brokers}")
    print("🚀 [INFO] 하이볼 크롤러 실행 중...")
    
    # ✅ 하이볼 크롤링 데이터 수집
    highballData = crawlHighball()

    # ✅ Kafka 토픽으로 전송
    sendToKafka("highballTopic", highballData)

    print("✅ [SUCCESS] 모든 하이볼 칵테일 데이터가 Kafka로 전송되었습니다.")

