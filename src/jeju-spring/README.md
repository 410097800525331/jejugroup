# jeju-spring

`jeju-spring`은 외부 Tomcat 10.1에 배포하는 Spring Boot WAR + Thymeleaf 모듈이다. 빌드 기준은 Gradle wrapper이며, JDK 21을 요구한다.

## 현재 구조

- `src/main/java/com/jejugroup/jejuspring/config`
  - 공용 환경 변수와 운영 설정 바인딩
- `src/main/java/com/jejugroup/jejuspring/auth/web`
  - `/auth/login` / `/auth/signup` / `/auth/pass` redirect alias controller와 Spring MVC auth API controller
- `src/main/java/com/jejugroup/jejuspring/auth/view`
  - `/pages/auth/*.html` front-mirror 화면 모델 record
- `src/main/java/com/jejugroup/jejuspring/auth/model`
  - 세션 사용자와 signup payload 모델
- `src/main/java/com/jejugroup/jejuspring/auth/application`
  - legacy users 테이블을 그대로 사용하는 auth service
- `src/main/java/com/jejugroup/jejuspring/migration/application`
  - migration dashboard와 readiness 데이터를 조합하는 서비스 계층
- `src/main/java/com/jejugroup/jejuspring/migration/web`
  - Thymeleaf entry point와 JSON readiness 엔드포인트
- `src/main/java/com/jejugroup/jejuspring/migration/view`
  - 화면 모델과 API 응답용 record
- `src/main/java/com/jejugroup/jejuspring/mypage/application`
  - session 기반 dashboard view 조합 서비스
- `src/main/java/com/jejugroup/jejuspring/mypage/web`
  - mypage dashboard Thymeleaf route controller
- `src/main/java/com/jejugroup/jejuspring/mypage/view`
  - booking/stat/support/dashboard 화면 모델 record
- `src/main/java/com/jejugroup/jejuspring/travel/application`
  - jejustay travel activities 페이지 데이터 조합 서비스
- `src/main/java/com/jejugroup/jejuspring/travel/web`
  - jejustay travel Thymeleaf route controller
- `src/main/java/com/jejugroup/jejuspring/travel/view`
  - category/activity/page/common static 화면 모델 record
- `src/main/java/com/jejugroup/jejuspring/stay/application`
  - hotel-list 데이터 조합 서비스
- `src/main/java/com/jejugroup/jejuspring/stay/web`
  - hotel-list Thymeleaf route controller
- `src/main/java/com/jejugroup/jejuspring/stay/view`
  - hotel-list 화면 모델 record
- `src/main/java/com/jejugroup/jejuspring/deals/application`
  - deals 계열 데이터 조합 서비스
- `src/main/java/com/jejugroup/jejuspring/deals/web`
  - deals/deals_member/deals_partner route controller
- `src/main/java/com/jejugroup/jejuspring/deals/view`
  - deals coupon/card/page 화면 모델 record
- `src/main/resources/templates/fragments`
  - 공용 Thymeleaf head 조각
- `src/main/resources/templates/front-mirror/pages/auth`
  - login/signup/pass canonical front-mirror 템플릿
- `src/main/resources/templates/migration`
  - migration status 대시보드
- `src/main/resources/templates/mypage`
  - session 기반 dashboard 템플릿
- `src/main/resources/templates/travel`
  - jejustay travel activities/esim/guide/tips 템플릿
- `src/main/resources/templates/stay`
  - hotel-list 템플릿
- `src/main/resources/templates/deals`
  - deals/deals_member/deals_partner 템플릿
- `src/main/resources/static/assets/css`
  - `app.css`는 공용 스타일, 나머지는 페이지 전용 스타일
- `src/main/resources/static/assets/js`
  - travel 페이지 helper 스크립트

## 엔드포인트

- `/`
- `/migration`
- `/auth/login`
- `/pages/auth/login.html`
- `/auth/signup`
- `/pages/auth/signup.html`
- `/auth/pass`
- `/pages/auth/pass_auth.html`
- `/mypage/dashboard`
- `/pages/mypage/dashboard.html`
- `/travel/activities`
- `/jejustay/pages/travel/activities.html`
- `/travel/esim`
- `/jejustay/pages/travel/esim.html`
- `/travel/guide`
- `/jejustay/pages/travel/travel_guide.html`
- `/travel/tips`
- `/jejustay/pages/travel/travel_tips.html`
- `/stay/hotel-list`
- `/jejustay/pages/hotel/hotel-list.html`
- `/deals`
- `/jejustay/pages/deals/deals.html`
- `/deals/member`
- `/jejustay/pages/deals/deals_member.html`
- `/deals/partner`
- `/jejustay/pages/deals/deals_partner.html`
- `/api/auth/login`
- `/api/auth/session`
- `/api/auth/logout`
- `/api/auth/verify`
- `/api/auth/signup`
- `/migration/readiness`
- `/actuator/health`

## 빌드 기준

- 빌드 도구는 Gradle wrapper다.
- `build.gradle`이 Spring Boot WAR 패키징과 front 자산 copy task를 관리한다.
- 루트 helper `scripts/spring/run-jeju-spring-gradle.cjs`는 front shell 빌드를 먼저 맞춘 뒤 `gradlew`를 실행한다.
- 외부 Tomcat 10.1 배포를 전제로 하므로 `providedRuntime`으로 Tomcat을 둔다.
- JDK 21 미만이면 helper가 바로 중단한다.

## 환경 변수 원칙

- 현재 app config는 `spring.config.import`로 지정된 env 경로를 따른다.
- 필요하면 `JEJU_SHARED_ENV_PATH`로 override 한다.
- auth DB 계약은 기존 `users` 테이블과 env 키(`DB_URL`, `DB_USER`, `DB_PASSWORD`)를 그대로 따른다.

## 실행

- 루트에서 `pnpm run spring:run`
- 루트에서 `pnpm run spring:test`
- 루트에서 `pnpm run spring:war-package`
- 직접 실행할 때는 `jeju-spring/gradlew bootRun`, `jeju-spring/gradlew test`, `jeju-spring/gradlew bootWar`

## 참고

- `front`는 계속 사람이 수정하는 원본이다.
- `sync-front-assets-to-spring.cjs`와 Gradle `processResources` task가 front 자산을 spring runtime으로 연결한다.
- 이 모듈은 embedded Tomcat 런타임이 아니라 외부 Tomcat 10.1 WAR 배포 경로를 기준으로 유지한다.
