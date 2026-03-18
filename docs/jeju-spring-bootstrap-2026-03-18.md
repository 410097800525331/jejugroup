# jeju-spring bootstrap

## 목적

- `jeju-spring`은 기존 `jeju-web`과 분리된 신규 Spring Boot + Thymeleaf 모듈이다.
- 지금 단계에서는 `front`를 바로 옮기지 않는다.
- 최종 목표는 현재 JSP/서블릿 기반 배포를 Spring + Thymeleaf 배포로 치환하는 것이다.

## 현재 구조

- Spring Boot `3.5.11`
- Java `17`
- Packaging `war`
- Thymeleaf 기본 엔트리: `/`, `/migration`
- Actuator health: `/actuator/health`

## 환경 변수 규칙

- 배포용 `.env`는 새로 만들지 않는다.
- 기본적으로 `jeju-spring`은 `../jeju-web/.env`를 `spring.config.import`로 읽는다.
- 서버 경로가 다르면 `JEJU_SHARED_ENV_PATH`로 override 한다.
- Alwaysdata / SSH / 외부 API 키는 `jeju-web/.env`를 공용 소스로 유지한다.

## 루트 기준 실행 커맨드

- `pnpm run spring:run`
- `pnpm run spring:test`
- `pnpm run spring:package`

## 첫 이행 원칙

- `front`는 계속 사람이 수정하는 원본으로 유지한다.
- 페이지 단위로 Thymeleaf 템플릿을 `jeju-spring/src/main/resources/templates` 아래로 옮긴다.
- 공용 CSS/이미지는 필요한 범위만 `jeju-spring/src/main/resources/static`으로 가져온다.
- JDBC 의존성은 넣어뒀지만, 실제 DB 마이그레이션 전까지는 datasource auto configuration을 끈 상태로 둔다.
- 기존 `jeju-web` deploy script는 당장 건드리지 않는다. Spring WAR 배포 파이프라인은 템플릿 이관 후 별도로 연결한다.

## 다음 추천 순서

1. 첫 타임리프 대상 페이지 1개를 정해서 `front` 마크업을 `jeju-spring` 템플릿으로 옮긴다.
2. 로그인/세션 같은 기존 서블릿 API를 Spring MVC controller/service로 얇게 감싼다.
3. Spring WAR 산출물을 alwaysdata 배포 스크립트에 붙일 별도 파이프라인을 만든다.
