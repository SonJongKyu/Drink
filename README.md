**2025.02 (4人 팀 프로젝트)**

## **📌 Summary**

본 프로젝트는 **멀티 애플리케이션(dlink-apps)** 과 **Kubernetes 배포 매니페스트(dlink-manifests)** 를 활용하여 **엔드-투-엔드 클라우드 네이티브 애플리케이션 환경**을 구축한 팀팀 프로젝트입니다.  
Python(Chatbot), Next.js(Frontend), Spring Boot(Backend), Kafka, Redis 등 다양한 서비스를 Docker 및 Kubernetes에서 실행하고,  
Kustomize/Argo CD 기반으로 **배포 자동화·관측(모니터링/로깅)** 까지 구성했습니다.

> **주요 기능**
> - 다중 애플리케이션 통합 실행 (chatbot-app, next-app, spring-app 등)
> - Kafka/Redis 연동으로 메시징·캐싱 처리
> - Docker Compose 기반 **로컬 개발 환경** + Kubernetes 기반 **운영 배포 환경**
> - Argo CD / Prometheus / EFK(Elasticsearch-Fluentd-Kibana)로 **배포/모니터링 자동화**

---

## **🤔 Background**

서비스 아키텍처는 모놀리식에서 **마이크로서비스·클라우드 네이티브**로 빠르게 전환되고 있습니다.  
이 프로젝트는 **“로컬 개발 → Kubernetes 운영 배포”** 로 이어지는 **엔드-투-엔드 파이프라인**을 직접 설계·실습하여,  
개발자와 운영자가 협업하는 **Dev+Ops 통합 관점**을 체득하기 위해 진행했습니다.

---

## **🔍 Meaning**

- **개발 측면**
  - Python/Next.js/Spring 기반 앱을 컨테이너화하여 **일관된 실행 환경** 확보
  - Kafka, Redis를 연동해 **서비스 간 데이터 흐름과 성능 최적화**를 실습

- **운영/배포 측면**
  - Docker Compose ↔ Kubernetes 환경 차이 체감 및 전환 패턴 학습
  - **Kustomize/Argo CD**로 선언적 배포·GitOps 워크플로우 구성
  - **Prometheus/EFK**로 모니터링·로깅 파이프라인 구축

단순 실행을 넘어 **실제 서비스 배포·운영까지 아우르는 실전형 프로젝트**라는 점에서 의미가 큽니다.

---

## **🔨 Technology Stack(s)**

- **Languages & Frameworks**
  - Python (예: Flask 기반 chatbot-app)
  - Next.js (Frontend)
  - Spring Boot (Backend)

- **Infra & DevOps**
  - Docker, Docker Compose
  - Kubernetes, Kustomize, Argo CD
  - Kafka, Redis
  - Prometheus, EFK Stack (Elasticsearch, Fluentd, Kibana)

- **Deployment Layout**
  - **로컬 개발**: `dlink-apps` 내 `docker-compose-*.yml`  
    - `docker-compose-dev.yml`, `docker-compose-demo.yml`
  - **Kubernetes 배포**: `dlink-manifests`  
    - `base/` (공통 리소스), `overlays/production/` (운영 오버레이)

---

## **⚙️ Install**

> 두 리포지토리를 같은 상위 디렉터리에 두는 것을 권장합니다.
>
> ```
> <workspace>/
> ├─ dlink-apps/
> └─ dlink-manifests/
> ```

### ▶ Option 1: Local (Docker Compose)

```
# 0) 앱 리포지토리로 이동
cd dlink-apps

# 1) 개발 환경 기동
docker compose -f docker-compose-dev.yml up -d
# 또는 데모 환경
docker compose -f docker-compose-demo.yml up -d

# 2) 상태 확인
docker compose ps

# 3) 종료
docker compose -f docker-compose-dev.yml down
```

### ▶ Option 2: Kubernetes (Recommended)
```
# 0) 매니페스트 리포지토리로 이동
cd dlink-manifests

# 1) 네임스페이스/베이스 리소스 적용
kubectl apply -k base

# 2) 운영 오버레이 적용
kubectl apply -k overlays/production

# 3) 배포 상태 확인
kubectl get ns
kubectl get pods -A
kubectl get svc -A

```
