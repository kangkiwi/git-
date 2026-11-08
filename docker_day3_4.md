# 🐳 Docker Day 3~4 - FastAPI 서버 배포 & 모델 서빙 동시성 문제 해결

---

# Part 1. FastAPI 서버 배포

## 1. MySQL 컨테이너 접속

```bash
# db 컨테이너 안으로 들어가기
docker exec -it docker-db-1 bash

# MySQL 접속 (비밀번호: password)
mysql -u root -p
```

```sql
USE app_db;

CREATE TABLE user (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50)
);

INSERT INTO user (name) VALUES ('alex'), ('bob'), ('chris');
```

- `docker exec -it <컨테이너명> bash` : 실행 중인 컨테이너 안에서 명령 실행

---

## 2. FastAPI 서버 & MySQL 연결

### requirements.txt 추가

```text
sqlalchemy
pymysql
cryptography
```

### connection.py

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "mysql+pymysql://root:password@db:3306/app_db"
engine = create_engine(DATABASE_URL)
SessionFactory = sessionmaker(
    bind=engine, autocommit=False, autoflush=False, expire_on_commit=False
)
```

> 💡 호스트 자리에 `localhost`가 아니라 **`db`**(compose 서비스 이름)를 쓴다. Docker Compose가 자동으로 네트워크를 구성해 주기 때문에 서비스 이름으로 다른 컨테이너에 접근할 수 있다.

### main.py

```python
from sqlalchemy import text
from connection import SessionFactory

@app.get("/users")
def get_users_handler():
    with SessionFactory() as session:
        stmt = text("SELECT * FROM user;")
        rows = session.execute(stmt).fetchall()
        users = [row._asdict() for row in rows]
    return {"users": users}
```

---

## 3. 데이터 유실 문제

`docker compose down` → `docker compose up -d`로 재시작하면 아래 에러가 발생한다.

```text
sqlalchemy.exc.ProgrammingError: (pymysql.err.ProgrammingError) (1146,
"Table 'app_db.test' doesn't exist")
```

- Docker Compose를 종료하면 **컨테이너가 삭제되고, 컨테이너 안에 저장된 데이터도 함께 삭제**된다.

---

## 4. 도커 볼륨 (Volume)

**데이터를 유지하고 싶을 때 사용**

- 컨테이너 내부가 아니라 **외부 저장소(볼륨)에 데이터 디렉토리를 연결**하는 방식
- 컨테이너가 삭제되어도 데이터는 **볼륨에 그대로 유지**됨

```
내 컴퓨터 [볼륨]  <──연결──>  [볼륨] MySQL 컨테이너
```

### docker-compose.yml 수정

```yaml
  db:
    # ...
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```

- `db_data` 볼륨을 MySQL의 데이터 저장 위치(`/var/lib/mysql`)에 연결

### 볼륨 응용: 코드 동기화

```yaml
services:
  api:
    # ...
    volumes:
      - .:/app
```

- 내 컴퓨터의 현재 폴더(`.`)를 컨테이너의 `/app`에 연결
- 코드를 수정하면 **이미지를 다시 빌드하지 않아도** 컨테이너에 바로 반영됨 (`--reload`와 함께 사용)

**실습**

1. 500 에러 확인
2. `main.py` 수정 (`SELECT 1`) → 바로 반영되는지 확인

---

# Part 2. 모델 서빙 동시성 문제 해결

## 5. 추론 과정에서의 동시성 문제

- 대부분의 LLM / Transformer 계열 모델은 **내부 상태**를 가진다.
  - KV cache, attention buffer, context 등
- 이런 모델들은 기본적으로 동시 요청에 대해 **thread-safe하지 않다.**
  - 여러 요청이 동시에 하나의 모델 인스턴스를 사용하면 내부 상태를 공유
  - 공유된 상태가 동시에 수정되면서 **race condition** 발생
- 결과적으로 **문맥이 섞이거나 이전 요청이 이어지는** 등 잘못된 응답이 생성된다.

### 문제 재현 (iTerm2 기준)

- 터미널 세로 분할: `cmd + d`
- 두 패널에 동시에 명령 전송: `cmd + shift + i`

```bash
curl -N -X POST http://127.0.0.1:8000/generate \
  -H "Content-Type: application/json" \
  -d '"너의 신년 계획에 대해서 얘기해줘"'
```

---

## 6. 동시성 문제 해결방안

**모델 추론을 별도 Worker로 분리하고, Queue로 요청을 전달한다.**

- **Queue**: 작업을 순서대로 쌓아 두고 하나씩 처리하기 위한 구조

```
FastAPI ──enqueue──> [ Task | Task | Task ] Queue ──dequeue──> Inference Worker
```

### 동시성을 대비한 아키텍처

1. **FastAPI**는 요청을 받아서 추론 작업을 **Queue에 추가**
2. **Worker**는 Queue에서 작업을 **하나씩 꺼내** 모델 추론 수행
   - 모델을 독점 사용 → 상태 꼬임 방지
   - 추론 결과는 다시 FastAPI로 전달 (**Pub/Sub**)
3. **FastAPI**는 그 결과를 클라이언트에게 응답

---

## 7. Redis

FastAPI 서버와 Inference Worker 사이를 **연결해 줄 중간 매개체**가 필요하다.

- 요구 조건: 비동기 처리, 대기열(Queue), Pub/Sub 같은 메시징 패턴 지원

**Redis**

- **메모리 기반**의 빠른 데이터 저장소
- Queue, Pub/Sub 같은 메시징 패턴 지원

---

## 8. Worker 컨테이너 만들기

### worker/requirements.txt

```text
llama-cpp-python
```

### worker/Dockerfile

```dockerfile
FROM python:3.13
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["python", "-u", "main.py"]
```

- `-u` : 출력 버퍼링 없이 바로 로그를 출력

### .dockerignore 생성

**Docker 이미지를 빌드할 때 포함하지 않을 파일/폴더를 지정하는 설정 파일**

- 모델 파일은 크기가 크기 때문에 이미지에 직접 넣지 않고 **볼륨으로 연결**

```bash
echo "models/" >> .dockerignore
```

### Worker 컨테이너 추가 (docker-compose.yml)

```yaml
  worker:
    build: ./worker
    volumes:
      - ./worker:/app
```

---

## 9. api 코드 분리

기존 코드는 `/api` 폴더로 이동한다.

```yaml
services:
  api:
    build: ./api
    # ...
    volumes:
      - ./api:/app
```

---

## 10. Redis 컨테이너 추가 & Worker 수정

### docker-compose.yml

```yaml
  api:
    # ...
    depends_on:
      - db
      - redis

  # ...

  redis:
    image: redis:8
    ports:
      - "6379:6379"

  worker:
    build: ./worker
    depends_on:
      - redis
    volumes:
      - ./worker:/app
```

### worker/requirements.txt

```text
llama-cpp-python
redis
```

### 코드

- worker/main.py: https://github.com/qu3vipon/oz-ai-bootcamp/blob/main/docker/worker/main.py
- api/main.py: https://github.com/qu3vipon/oz-ai-bootcamp/blob/main/docker/api/main.py

### 실행 (Worker 2개)

```bash
docker compose up --scale worker=2
```

- `--scale worker=2` : worker 컨테이너를 2개 띄움

---

## 11. 동시성 문제 해결 확인

문제 재현 때와 같은 방법으로 두 터미널에서 동시에 요청을 보낸다.

- 터미널 세로 분할: `cmd + d`
- 두 패널에 동시에 명령 전송: `cmd + shift + i`

```bash
curl -N -X POST http://127.0.0.1:8000/generate \
  -H "Content-Type: application/json" \
  -d '"너의 신년 계획에 대해서 얘기해줘"'
```

→ 요청끼리 문맥이 섞이지 않고 각각 올바른 응답이 오는지 확인

---

## 12. 실습: 당뇨/고혈압 위험도 예측 서비스

- https://github.com/qu3vipon/oz-ai-bootcamp/tree/main/risk_predict
