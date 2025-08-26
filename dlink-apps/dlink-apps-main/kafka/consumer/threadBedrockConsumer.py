import os
import json
import logging
import time
import random
import threading
import queue
import boto3
from botocore.config import Config
from botocore.exceptions import ClientError
from kafka import KafkaConsumer
from pymongo import MongoClient

def loadAwsCredentials():
    """AWS 자격 증명을 CSV 파일에서 로드합니다."""
    try:
        with open('/home/kevin/project/kafka/consumer/dalbok_accessKeys.csv', 'r') as file:
            next(file)  # 헤더 행 건너뛰기
            credentials = next(file).strip().split(',')
            os.environ['AWS_ACCESS_KEY_ID'] = credentials[0]
            os.environ['AWS_SECRET_ACCESS_KEY'] = credentials[1]
            os.environ['AWS_DEFAULT_REGION'] = 'us-east-1'
    except Exception as e:
        logging.error("AWS 자격 증명 로드 실패: %s", e)
        raise

# AWS 자격 증명 로드
loadAwsCredentials()

def invokeBedrockModel(bedrockClient, modelId, prompt):
    """
    Amazon Bedrock 모델을 호출하여 결과를 받아옵니다.
    ThrottlingException 발생 시 지수 백오프와 랜덤 지터를 적용하여 재시도합니다.
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
    baseDelay = 1  # 초기 대기시간 (초)
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
                    delay = baseDelay * (2 ** (attempt - 1))
                    jitter = random.uniform(0, 0.5)
                    totalDelay = delay + jitter
                    print(f"ThrottlingException 발생, {totalDelay:.2f}초 대기 후 재시도합니다. (시도 {attempt}/{maxAttempts})")
                    time.sleep(totalDelay)
                else:
                    print(f"최대 재시도 횟수 {maxAttempts}회 초과. 에러 발생: {e}")
                    raise
            else:
                print(f"invokeModel 호출 중 에러 발생: {e}")
                raise

def extractSummaryText(summaryResult):
    """
    Amazon Bedrock 응답에서 요약 텍스트를 추출합니다.
    우선 "outputText" 키, 그 다음 "messages" 내 "content" 필드, 
    그리고 top-level "content" 필드가 있으면 해당 값(첫 번째 항목의 "text")을 추출합니다.
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

def processTopicQueue(topic, q, db, bedrockClient, modelId, collectionName):
    """
    각 토픽에 대해 큐에 담긴 메시지를 처리합니다.
    기존 메시지 처리 로직을 그대로 사용하여, Bedrock 호출 후 MongoDB에 업데이트합니다.
    """
    while True:
        message = q.get()
        if message is None:
            q.task_done()
            break  # 종료 신호가 들어오면 종료
        try:
            # 메시지 JSON 파싱
            data = json.loads(message.value)
            # MongoDB에 데이터 저장 (원본 explanation 필드는 그대로 유지)
            insertResult = db[collectionName].insert_one(data)
            print(f"MongoDB '{collectionName}' 컬렉션에 _id {insertResult.inserted_id}로 저장됨.")
            # explanation 필드가 존재하면 Bedrock을 통해 요약 생성 후 summary 필드 업데이트
            if "explanation" in data:
                explanationText = data["explanation"]
                prompt = (
                    "explanation 컬럼의 데이터는 주류에 대한 설명이야. 너는 주류 요약을 알아듣기 쉽게 잘 하는 중학생이야. "
                    "모든 주류의 설명 대해 1줄로 요약 해줘야 해. korName과 비슷한 주류 이름이 포함된 내용과 용량을 제거해주고, "
                    "첫 번째 '-' 이후의 내용에 대해서만 요약하면 돼. 문장 끝처리는 명사로 마무리하고, "
                    "설명이 없는 주류에 대해서는 설명을 추가해서 1줄 요약 해줘. 그리고 요청한 내용 외의 불필요한 응답은 하지 말아줘.\n\n"
                    f"{explanationText}\n\n"
                    "요약:"
                )
                print("Amazon Bedrock에 전송할 프롬프트:")
                print(prompt)
                summaryResult = invokeBedrockModel(bedrockClient, modelId, prompt)
                print("Amazon Bedrock의 요약 응답 (raw):")
                print(summaryResult)
                summaryText = extractSummaryText(summaryResult)
                print("추출된 요약 텍스트:", summaryText)
                if not summaryText:
                    summaryText = "요약 결과 없음"
                    print("빈 요약 텍스트가 반환되어 기본값으로 설정합니다:", summaryText)
                updateResult = db[collectionName].update_one(
                    {"_id": insertResult.inserted_id},
                    {"$set": {"summary": summaryText}}
                )
                print("업데이트 결과 - matched:", updateResult.matched_count, "modified:", updateResult.modified_count)
                if updateResult.modified_count > 0:
                    print(f"MongoDB에 summary 필드가 업데이트되었습니다. _id: {insertResult.inserted_id}")
                    updatedDoc = db[collectionName].find_one({"_id": insertResult.inserted_id})
                    print("업데이트된 문서:")
                    print(updatedDoc)
                else:
                    print("MongoDB 업데이트 실패: summary 필드가 업데이트되지 않았습니다.")
            else:
                print("메시지에 'explanation' 필드가 없어 Bedrock 호출을 건너뜁니다.")
        except Exception as e:
            print(f"메시지 처리 중 에러 발생: {e}")
        finally:
            q.task_done()

def main():
    logging.basicConfig(level=logging.INFO)

    # Kafka 토픽과 MongoDB 컬렉션 매핑 (camelCase)
    topicCollectionMap = {
        "testBrandyTopic": "brandy",
        "testGinTopic": "gin",
        "testRumTopic": "rum",
        "testLiqueurTopic": "liqueur",
        "testVodkaTopic": "vodka",
        "testTequilaTopic": "tequila",
        "testWhiskeyTopic": "whiskey"
    }

    # MongoDB 연결 (alcoholDatabase 사용)
    mongoClient = MongoClient("mongodb://admin:password@localhost:27017/")
    db = mongoClient["alcoholDatabase"]

    # AWS Bedrock client 생성 (us-east-1 리전)
    bedrockClient = boto3.client(
        "bedrock-runtime",
        region_name="us-east-1",
        config=Config(retries={"max_attempts": 3})
    )
    modelId = "arn:aws:bedrock:us-east-1:633966959963:inference-profile/us.anthropic.claude-3-5-sonnet-20241022-v2:0"

    # KafkaConsumer 초기화
    kafkaConsumer = KafkaConsumer(
        *list(topicCollectionMap.keys()),
        bootstrap_servers=["localhost:9092"],
        auto_offset_reset="earliest",
        group_id="bedrockConsumerGroup",
        value_deserializer=lambda v: v.decode("utf-8")
    )

    print("Kafka consumer 시작 - 토픽:", list(topicCollectionMap.keys()))

    # 각 토픽별로 메시지 처리를 위한 큐와 워커 스레드 생성
    topicQueues = {}
    for topic, collectionName in topicCollectionMap.items():
        topicQueues[topic] = queue.Queue()
        workerThread = threading.Thread(
            target=processTopicQueue,
            args=(topic, topicQueues[topic], db, bedrockClient, modelId, collectionName)
        )
        workerThread.daemon = True
        workerThread.start()

    # Kafka 메시지 소비: 수신된 메시지를 해당 topic의 큐에 전달
    for message in kafkaConsumer:
        topic = message.topic
        if topic in topicQueues:
            topicQueues[topic].put(message)
        else:
            print(f"알 수 없는 topic '{topic}'의 메시지 수신. 건너뜁니다.")

if __name__ == "__main__":
    main()

