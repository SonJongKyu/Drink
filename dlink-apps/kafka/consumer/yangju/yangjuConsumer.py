import os
import json
import logging
import time
import random
import boto3
from botocore.config import Config
from botocore.exceptions import ClientError
from kafka import KafkaConsumer
from pymongo import MongoClient

# ✅ 환경 변수 설정
KAFKA_BROKER = os.getenv("KAFKA_BROKER", "localhost:9092").split(",")
MONGO_URI = os.getenv("MONGO_URI", "mongodb://admin:password@localhost:27017/")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
AWS_CREDENTIALS_PATH = os.getenv("AWS_CREDENTIALS_PATH", "/app/dalbok_accessKeys.csv")
BEDROCK_MODEL_ID = os.getenv("BEDROCK_MODEL_ID", "arn:aws:bedrock:us-east-1:633966959963:inference-profile/us.anthropic.claude-3-5-sonnet-20241022-v2:0")
DATABASE_NAME = os.getenv("DATABASE_NAME", "alcoholDatabase")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "highball").split(",")
TOPIC_NAME = os.getenv("TOPIC_NAME", "highballTopic").split(",")


def loadAwsCredentials():
    """AWS 자격 증명을 CSV 파일에서 로드합니다."""
    try:
        with open(AWS_CREDENTIALS_PATH, 'r') as file:
            next(file)  # 헤더 행 건너뛰기
            credentials = next(file).strip().split(',')
            os.environ['AWS_ACCESS_KEY_ID'] = credentials[0]
            os.environ['AWS_SECRET_ACCESS_KEY'] = credentials[1]
            os.environ['AWS_DEFAULT_REGION'] = AWS_REGION
    except Exception as e:
        logging.error("AWS 자격 증명 로드 실패: %s", e)
        raise


# AWS 자격 증명 로드
loadAwsCredentials()


def invokeBedrockModel(bedrockClient, modelId, prompt):
    """
    Amazon Bedrock 모델을 호출하여 결과를 받아옵니다.
    """
    payload = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 200,
        "top_k": 200,
        "stop_sequences": [],
        "temperature": 1,
        "top_p": 0.999,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt
                    }
                ]
            }
        ]
    }
    
    maxAttempts = 10
    baseDelay = 1
    for attempt in range(1, maxAttempts + 1):
        try:
            response = bedrockClient.invoke_model(
                modelId=modelId,
                contentType="application/json",
                accept="application/json",
                body=json.dumps(payload)
            )
            result = json.loads(response["body"].read().decode("utf-8"))
            return result
        except ClientError as e:
            errorCode = e.response["Error"]["Code"]
            if errorCode == "ThrottlingException":
                if attempt < maxAttempts:
                    delay = baseDelay * (2 ** (attempt - 1)) + random.uniform(0, 0.5)
                    print(f"ThrottlingException 발생, {delay:.2f}초 대기 후 재시도합니다. (시도 {attempt}/{maxAttempts})")
                    time.sleep(delay)
                else:
                    print(f"최대 재시도 횟수 {maxAttempts}회 초과. 에러 발생: {e}")
                    raise
            else:
                print(f"invokeModel 호출 중 에러 발생: {e}")
                raise


def extractSummaryText(summaryResult):
    """
    Amazon Bedrock 응답에서 요약 텍스트를 추출합니다.
    """
    summaryText = ""
    if isinstance(summaryResult, dict):
        summaryText = summaryResult.get("outputText", "").strip()
        if not summaryText and "messages" in summaryResult:
            try:
                summaryText = summaryResult["messages"][0]["content"][0]["text"].strip()
            except (KeyError, IndexError):
                summaryText = ""
        if not summaryText and "content" in summaryResult:
            try:
                summaryText = summaryResult["content"][0]["text"].strip()
            except (KeyError, IndexError):
                summaryText = ""
    elif isinstance(summaryResult, str):
        summaryText = summaryResult.strip()
    return summaryText


def main():
    logging.basicConfig(level=logging.INFO)

    # MongoDB 연결
    mongoClient = MongoClient(MONGO_URI)
    db = mongoClient[DATABASE_NAME]

    # Kafka 토픽과 MongoDB 컬렉션 매핑 (리스트 매칭)
    topicCollectionMap = dict(zip(TOPIC_NAME, COLLECTION_NAME))

    # AWS Bedrock client 생성
    bedrockClient = boto3.client(
        "bedrock-runtime",
        region_name=AWS_REGION,
        config=Config(retries={"max_attempts": 3})
    )

    # KafkaConsumer 초기화
    kafkaConsumer = KafkaConsumer(
        *TOPIC_NAME,
        bootstrap_servers=KAFKA_BROKER,
        auto_offset_reset="earliest",
        group_id="bedrockConsumerGroup",
        value_deserializer=lambda v: v.decode("utf-8")
    )

    print(f"Kafka consumer 시작 - 토픽: {TOPIC_NAME}")

    # Kafka 메시지 소비
    for message in kafkaConsumer:
        try:
            topic = message.topic
            collectionName = topicCollectionMap.get(topic)
            if not collectionName:
                print(f"알 수 없는 topic '{topic}'의 메시지 수신. 건너뜁니다.")
                continue

            collection = db[collectionName]

            # 메시지 JSON 파싱
            data = json.loads(message.value)

            # MongoDB에 데이터 저장
            insertResult = collection.insert_one(data)
            print(f"MongoDB '{collectionName}' 컬렉션에 _id {insertResult.inserted_id}로 저장됨.")
            
            # explanation 필드가 존재하면 Bedrock을 통해 요약 생성 후 summary 필드 업데이트
            if "explanation" in data:
                explanationText = data["explanation"]
                prompt = (
                    "explanation 컬럼의 데이터는 주류에 대한 설명이야. 주류 설명을 1줄로 요약해줘."
                    f"\n\n{explanationText}\n\n요약:"
                )
                summaryResult = invokeBedrockModel(bedrockClient, BEDROCK_MODEL_ID, prompt)
                summaryText = extractSummaryText(summaryResult) or "요약 결과 없음"

                updateResult = collection.update_one(
                    {"_id": insertResult.inserted_id},
                    {"$set": {"summary": summaryText}}
                )
                if updateResult.modified_count > 0:
                    print(f"MongoDB에 summary 필드가 업데이트되었습니다. _id: {insertResult.inserted_id}")
                else:
                    print("MongoDB 업데이트 실패: summary 필드가 업데이트되지 않았습니다.")
            else:
                print("메시지에 'explanation' 필드가 없어 Bedrock 호출을 건너뜁니다.")
        except Exception as e:
            print(f"메시지 처리 중 에러 발생: {e}")


if __name__ == "__main__":
    main()

