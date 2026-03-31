# Docker OCI 런타임 마이그레이션

## 개요

- 이 스택은 `app`, `mysql`, `nginx` 3개 컨테이너로 운영한다.
- 앱은 repo root에서 `jeju-spring/Dockerfile`로 빌드한 JAR 기반 이미지를 실행한다.
- 공용 설정은 `/opt/jejugroup/.env`에서 읽고, 앱 컨테이너 안에서도 같은 경로로 읽을 수 있게 마운트한다.
- 업로드 파일은 host absolute path `/uploads`를 공유하고, 앱과 nginx가 같은 경로를 본다.
- MySQL 데이터는 named volume `jejugroup_mysql_data`에 영속화한다.

## 사전 준비

- Docker Engine
- Docker Compose v2
- `/opt/jejugroup/.env`
- repo root
- `/uploads/`

`/opt/jejugroup/.env`에는 최소한 아래 값이 필요하다.

```env
JEJU_SHARED_ENV_PATH=/opt/jejugroup/.env
DB_URL=jdbc:mysql://mysql:3306/jejugroup_db?characterEncoding=UTF-8&serverTimezone=Asia/Seoul&useSSL=false&allowPublicKeyRetrieval=true
DB_USER=jejugroup
DB_PASSWORD=change-me
MYSQL_DATABASE=jejugroup_db
MYSQL_USER=jejugroup
MYSQL_PASSWORD=change-me
MYSQL_ROOT_PASSWORD=change-me-too
```

업로드 루트를 별도로 읽어야 하면 `MYPAGE_AVATAR_UPLOAD_ROOT=/uploads`를 넣어도 된다. 이 compose는 기본값으로 `/uploads`를 주입한다.

## 최초 배포

1. 기존 direct-host 앱과 host MySQL이 아직 떠 있으면 먼저 내린다. 특히 `80`, `8080`, `3306` 충돌을 비워둔다.
2. 업로드 디렉터리를 만든다.

```bash
mkdir -p /uploads
```

3. `/opt/jejugroup/.env`를 준비한다.
4. MySQL만 먼저 올린다.

```bash
docker compose up -d mysql
```

5. 새 컨테이너 MySQL로 데이터를 복원한다.

```bash
mysqldump -h <old-host> -u <old-user> -p --single-transaction --routines --triggers --events <old-db> > jejugroup.sql
docker compose exec -T mysql sh -lc 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"' < jejugroup.sql
```

6. 앱과 nginx를 올린다.

```bash
docker compose up -d app nginx
```

7. 상태를 확인한다.

```bash
docker compose ps
curl -fsS http://127.0.0.1/actuator/health
```

## DB 마이그레이션 기준

- host MySQL의 `flyway_schema_history`와 업무 데이터를 같이 덤프하는 쪽이 가장 덜 위험하다.
- 덤프 후 복원 순서는 `mysql` 컨테이너 기동 -> 데이터 import -> `app` 기동이다.
- 새 DB로 처음 부팅하면 앱이 Flyway를 다시 적용한다. 이미 반영된 이력 테이블이 있으면 그대로 이어간다.
- host DB와 컨테이너 DB의 계정/DB명은 같게 두는 편이 작업이 단순하다.

## 재배포

- 코드나 설정이 아니라 JAR 산출물만 바뀌면 새 이미지를 다시 빌드한 뒤 앱만 재시작한다.

```bash
docker compose build app
docker compose up -d --no-deps app
```

- nginx 설정을 바꾸면 nginx만 재시작한다.

```bash
docker compose restart nginx
```

- MySQL 설정이나 초기화 값이 바뀌면 `mysql` 컨테이너를 재기동한다.

```bash
docker compose up -d mysql
```

## 운영 메모

- 업로드 파일은 host 경로 `/uploads`에 남아 있어서 컨테이너 재생성 후에도 유지된다.
- MySQL 데이터는 named volume에 남아 있어서 `docker compose down`만으로는 지워지지 않는다.
- 업로드나 프록시 경로는 `/uploads/`로 통일했다.
