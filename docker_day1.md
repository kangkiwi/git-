# 🐳 Docker Day 1 - Docker 기초 사용법

> **과정 목표**: Docker를 활용해 FastAPI 서비스를 컨테이너화하고, AI 모델을 안정적으로 서빙할 수 있는 아키텍처를 구축하는 법을 배운다.

---

## 0. Docker Desktop 설치

로컬 PC에서 Docker를 쉽게 쓸 수 있도록 만든 **통합 개발 환경**

- Docker 설치·관리·실행을 쉽게 해 주는 **GUI + 도구 묶음**
- 설치: https://www.docker.com/products/docker-desktop/
- 회원가입 과정은 skip 가능
- 설치하면 Docker도 함께 설치됨

---

## 1. Docker란?

**애플리케이션과 실행 환경을 함께 묶어서 배포하는 도구**

- 어디서나 **동일한 환경**에서 실행 가능
- OS 위에서 **격리된 실행 환경**을 제공
- "제 컴퓨터에서는 되는데요?" 문제를 해결

> 👉 **핵심: "실행 환경을 코드로 만든다"**

### 왜 Docker를 쓰나?

**Docker 없이 생기는 문제**

| 대상 | Python 버전 |
| --- | --- |
| 개발자 A | 3.11 |
| 개발자 B | 3.9 |
| 서버 | 3.8 |

→ 같은 코드인데 환경마다 **다르게 동작**할 수 있음

**Docker를 쓰면**

- 환경을 **파일로 고정**
- 그 파일을 공유하면 **누구나 동일한 환경**에서 실행 가능

---

## 2. Docker 핵심 개념

### Image (이미지)

- 실행 환경의 **설계도**
- OS + 라이브러리 + 앱 코드 포함
- **정적 상태**의 파일

### Container (컨테이너)

- 이미지를 **실제로 실행한 것**
- **독립된 프로세스**

> 💡 이미지 = 설계도 / 컨테이너 = 설계도로 만든 실제 실행물

### 컨테이너 실행해 보기

```bash
# python 3.10 이미지로 컨테이너를 띄우고 bash로 접속
docker run -it python:3.10-slim bash

# 컨테이너 안에서 실행
python --version
python -c "print('Hello, World')"
```

### Docker 기본 흐름

1. Dockerfile 작성
2. Dockerfile → **Image 빌드**
3. Image → **Container 실행**
4. 컨테이너에서 앱 동작
5. 컨테이너 종료 / 삭제

---

## 3. Dockerfile이란?

**이미지를 만들기 위한 스크립트**로, 아래 내용을 정의한다.

- 어떤 **OS**를 쓰는지
- 어떤 **라이브러리**를 설치하는지
- 어떤 **명령어로 실행**하는지

### 예시

```dockerfile
FROM python:3.13-slim
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

### 명령어 정리

| 명령어 | 의미 |
| --- | --- |
| `FROM` | 베이스 이미지 |
| `WORKDIR` | 컨테이너 안의 작업 디렉토리 |
| `COPY` | 파일 복사 |
| `RUN` | 설치 명령 (이미지 빌드 시 실행) |
| `CMD` | 컨테이너 시작 시 실행할 명령 |

---

## 4. 이미지 빌드 & 실행

```bash
# 현재 폴더(.)에서 Dockerfile을 찾아 myapp 태그를 단 이미지 생성
docker build -t myapp .

# myapp 이미지를 컨테이너로 실행
docker run -p 8000:8000 -d --rm myapp
```

- `-p <내 컴퓨터 포트>:<컨테이너 내부 포트>` : 포트 연결
- `-d` : 백그라운드(detached) 실행
- `--rm` : 컨테이너가 종료되면 자동 삭제

### 기본 명령어

| 명령어 | 설명 |
| --- | --- |
| `docker images` | 로컬에 저장된 이미지 목록 확인 |
| `docker ps` | 실행 중인 컨테이너 목록과 상태 확인 |
| `docker stop <컨테이너명 or ID>` | 실행 중인 컨테이너 중지 |
| `docker rm <컨테이너명 or ID>` | 중지된 컨테이너 삭제 |

---

## 5. Docker Compose up / down

### 현실적인 웹 서비스 구성

- **API 서버**: FastAPI
- **DB**: MySQL, PostgreSQL
- **Redis**: 캐싱, 큐, Pub/Sub, 이벤트 스트리밍
- **Nginx**: Reverse Proxy
- **AI 추론 서버**: 모델 서빙 전용

전부 따로 컨테이너로 만들면 여러 문제가 생긴다.

- 네트워크 설정이 복잡함
- 실행 순서 의존성
- 로컬 개발 & 배포 관리의 어려움

### Docker Compose란?

**여러 컨테이너를 하나의 서비스처럼 관리하는 기술**

- 여러 컨테이너를 **한 번에 실행 / 중지**
- 컨테이너 실행 구조를 **코드로 정의**

**장점**

- 컨테이너 실행 순서 관리 & 일괄 실행
- 네트워크 자동 구성

> 👉 **멀티 컨테이너 환경을 위한 도구**

### docker-compose.yml

```yaml
services:
  api:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: app_db
    ports:
      - "3306:3306"
```

- `build: .` : 현재 폴더의 Dockerfile로 이미지 빌드
- `image` : 이미 만들어진 이미지 사용
- `depends_on` : `db`가 먼저 실행된 뒤 `api` 실행
- `environment` : 컨테이너 환경변수 설정

### 실행 (up)

```bash
# docker-compose.yml에 정의된 모든 서비스를 백그라운드(detached)로 실행
docker compose up -d

# 로그 확인 (-f: 실시간으로 계속 보기)
docker compose logs -f
```

### 종료 (down)

```bash
# 실행 중인 모든 컨테이너 중지 + 삭제
docker compose down

# 재시작
docker compose up -d
```

> ⚠️ `docker compose down`을 하면 컨테이너가 삭제되면서 **컨테이너 안에 저장된 데이터도 함께 사라진다.** → 해결 방법(볼륨)은 Day 3~4에서 정리
