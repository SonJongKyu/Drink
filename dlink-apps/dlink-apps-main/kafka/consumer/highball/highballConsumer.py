import os
import json
import logging
from kafka import KafkaConsumer
from pymongo import MongoClient

# ✅ 환경 변수 설정
KAFKA_BROKER = os.getenv("KAFKA_BROKER", "localhost:9092")
MONGO_URI = os.getenv("MONGO_URI", "mongodb://admin:admin@localhost:27017/")
DATABASE_NAME = os.getenv("DATABASE_NAME", "dlink_db")
TOPIC_NAMES = os.getenv("TOPIC_NAME", "highballTopic").split(",")  # ✅ 여러 개의 토픽을 리스트로 변환
COLLECTION_NAMES = os.getenv("COLLECTION_NAME", "highball").split(",")  # ✅ 여러 개의 컬렉션을 리스트로 변환

# ✅ Kafka Consumer 종료 조건
POLL_TIMEOUT_SECONDS = int(os.getenv("POLL_TIMEOUT_SECONDS", "15"))  # ✅ 크롤링 종료 후 대기 시간

# ✅ MongoDB 연결
mongo_client = MongoClient(MONGO_URI)
db = mongo_client[DATABASE_NAME]

# ✅ Kafka Consumer 설정
consumer = KafkaConsumer(
    *TOPIC_NAMES,
    bootstrap_servers=KAFKA_BROKER.split(","),
    auto_offset_reset="earliest",
    enable_auto_commit=True,
    group_id="highballConsumerGroup",
    value_deserializer=lambda v: json.loads(v.decode("utf-8")),
)

logging.basicConfig(level=logging.INFO)
logging.info(f"Kafka Consumer 시작 - 토픽: {TOPIC_NAMES}, DB: {DATABASE_NAME}, Collections: {COLLECTION_NAMES}")

# ✅ 토픽과 컬렉션 매핑 (개수가 다를 경우 기본적으로 1:1 매핑)
topic_collection_map = dict(zip(TOPIC_NAMES, COLLECTION_NAMES))

def consumeMessages():
    """Kafka에서 메시지를 가져와 MongoDB에 저장하고 크롤링이 끝나면 종료"""
    while True:
        messages = consumer.poll(timeout_ms=POLL_TIMEOUT_SECONDS * 1000)  # ✅ 메시지 가져오기

        if not messages:  # ✅ 일정 시간 동안 메시지가 없으면 종료
            logging.info(f"📌 {POLL_TIMEOUT_SECONDS}초 동안 새로운 메시지가 없어 Consumer 종료.")
            break

        for topic_partition, records in messages.items():
            topic = topic_partition.topic  # ✅ 현재 처리 중인 토픽
            collection_name = topic_collection_map.get(topic)  # ✅ 해당 토픽에 대응하는 컬렉션

            if not collection_name:
                logging.warning(f"⚠️ {topic}에 대한 매핑된 컬렉션이 없습니다. 건너뜁니다.")
                continue

            collection = db[collection_name]  # ✅ 컬렉션 선택

            for message in records:
                try:
                    data = message.value
                    if isinstance(data, dict) and "korName" in data:
                        logging.info(f"✅ 소비된 데이터: {data['korName']} - {data.get('engName', 'N/A')} (토픽: {topic}, 컬렉션: {collection_name})")

                        # ✅ MongoDB에 데이터 저장
                        collection.insert_one(data)
                        logging.info(f"✅ MongoDB 저장 완료! {data['korName']} (컬렉션: {collection_name})")

                    else:
                        logging.warning(f"⚠️ 올바르지 않은 데이터 형식: {data}")

                except Exception as e:
                    logging.error(f"❌ 메시지 처리 중 오류 발생: {e}")

    consumer.close()  # ✅ Kafka Consumer 종료
    logging.info("🛑 Kafka Consumer 정상 종료.")

if __name__ == "__main__":
    consumeMessages()

