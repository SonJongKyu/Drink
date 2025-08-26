import json
from kafka import KafkaConsumer
from pymongo import MongoClient

client = MongoClient("mongodb://admin:password@localhost:27017/")
db = client["alcoholDatabase"]
collection = db["whiskey"]

consumer = KafkaConsumer(
    "whiskeyTopic",
    bootstrap_servers="localhost:9092",
    auto_offset_reset="earliest",
    enable_auto_commit=True,
    value_deserializer=lambda v: json.loads(v.decode("utf-8"))
)

print("📌 Kafka Consumer 시작 (데이터를 MongoDB에 저장 중...)")

for message in consumer:
    data = message.value
    collection.insert_one(data)
    print(f"Inserted into MongoDB: {data}")

