import json
from kafka import KafkaProducer
from whiskeyCrawler import crawlWhiskeysData

producer = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)

whiskeys = crawlWhiskeysData()

for whiskey in whiskeys:
    producer.send("whiskeyTopic", whiskey)
    print(f"Sent to Kafka: {whiskey}")

producer.flush()
producer.close()

