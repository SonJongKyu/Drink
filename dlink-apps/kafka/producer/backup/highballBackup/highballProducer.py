from kafka import KafkaProducer
import json
from highballCrawler import crawlHighball

producer = KafkaProducer(
    bootstrap_servers=['localhost:9092', 'localhost:9093', 'localhost:9094'],
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

def sendToKafka(topic, data):
    print(f"📡 [INFO] {topic} 토픽으로 {len(data)}개 데이터 전송 시작...")
    for item in data:
        print(f"📨 [INFO] {topic} 전송 데이터: {item['korName']}")
        producer.send(topic, value=item)
    producer.flush()
    print(f"✅ [SUCCESS] {topic} 전송 완료!")

print("🚀 [INFO] 하이볼 크롤러 실행 중...")
highballData = crawlHighball()
sendToKafka("highballTopic", highballData)

print("✅ [SUCCESS] 모든 하이볼 칵테일 데이터가 Kafka로 전송되었습니다.")

