# jeju-spring

`jeju-spring`은 기존 `jeju-web` 배포를 한 번에 걷어내지 않고, Spring Boot WAR + Thymeleaf 구조를 페이지 단위로 이행하기 위한 독립 모듈이다.

## 현재 구조

- `src/main/java/com/jejugroup/jejuspring/config`
  - 공용 환경 변수와 운영 설정 바인딩
- `src/main/java/com/jejugroup/jejuspring/migration/application`
  - migration dashboard와 readiness 데이터를 조합하는 서비스 계층
- `src/main/java/com/jejugroup/jejuspring/migration/web`
  - Thymeleaf entry point와 JSON readiness 엔드포인트
- `src/main/java/com/jejugroup/jejuspring/migration/view`
  - 화면 모델과 API 응답용 record
- `src/main/resources/templates/fragments`
  - 앞으로 이관할 페이지가 공통으로 쓸 Thymeleaf head 조각
- `src/main/resources/templates/migration`
  - 현재 migration status 대시보드
- `src/main/resources/static/assets/css`
  - `app.css`는 공용 스타일, `migration/dashboard.css`는 페이지 전용 스타일

## 엔드포인트

- `/`
- `/migration`
- `/migration/readiness`
- `/actuator/health`

## 환경 변수 원칙

- 기본 `.env` 소스는 `../jeju-web/.env`
- 필요하면 `JEJU_SHARED_ENV_PATH`로 override
- datasource 자동 구성은 여전히 꺼둔 상태

## 실행

- 루트에서 `pnpm run spring:run`
- 루트에서 `pnpm run spring:test`
- 루트에서 `pnpm run spring:package`

`scripts/spring/run-jeju-spring-maven.cjs`는 `JAVA_HOME`이 비어 있으면 PATH 또는 대표 설치 경로에서 JDK를 찾도록 보완되어 있다. 그래도 JDK 자체가 없으면 Maven wrapper는 실행되지 않는다.
