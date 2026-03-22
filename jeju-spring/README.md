# jeju-spring

`jeju-spring`은 외부 Tomcat 10.1에 배포하는 Spring Boot WAR + Thymeleaf 모듈이다. JDK 21 기준으로 패키징하고, 기존 `jeju-web` 배포를 한 번에 걷어내지 않고 페이지 단위로 이행한다.

## 현재 구조

- `src/main/java/com/jejugroup/jejuspring/config`
  - 공용 환경 변수와 운영 설정 바인딩
- `src/main/java/com/jejugroup/jejuspring/auth/web`
  - login/signup/pass Thymeleaf route controller와 Spring MVC auth API controller
- `src/main/java/com/jejugroup/jejuspring/auth/view`
  - login/signup/pass 화면 모델 record
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
  - 앞으로 이관할 페이지가 공통으로 쓸 Thymeleaf head 조각
- `src/main/resources/templates/auth`
  - 첫 수동 이행 auth 페이지인 login/signup/pass 템플릿
- `src/main/resources/templates/migration`
  - 현재 migration status 대시보드
- `src/main/resources/templates/mypage`
  - session 기반 dashboard 템플릿
- `src/main/resources/templates/travel`
  - jejustay travel activities/esim/guide/tips 템플릿
- `src/main/resources/templates/stay`
  - hotel-list 템플릿
- `src/main/resources/templates/deals`
  - deals/deals_member/deals_partner 템플릿
- `src/main/resources/static/assets/css`
  - `app.css`는 공용 스타일, `auth/*.css`, `migration/dashboard.css`, `mypage/dashboard.css`, `travel/*.css`, `stay/hotel-list.css`, `deals/deals.css`는 페이지 전용 스타일
- `src/main/resources/static/assets/js`
  - `auth/login-page.js`, `auth/signup-page.js`, `auth/pass-auth-page.js`는 기존 `/api/auth/*`를 호출하는 transitional auth 스크립트
  - `auth/shared.js`는 PASS bridge, popup open, auth formatting helper
  - `travel/*.js`는 jejustay 여행 페이지 필터/검색/아코디언/도시 탭을 처리하는 client helper

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

## 환경 변수 원칙

- 기본 `.env` 소스는 `../jeju-web/.env`
- 필요하면 `JEJU_SHARED_ENV_PATH`로 override
- datasource 자동 구성은 여전히 꺼둔 상태
- auth 화면은 이제 `jeju-spring` 안의 Spring MVC `/api/auth/*`를 직접 호출한다
- 다만 DB 계약은 여전히 legacy `users` 테이블과 기존 env 키(`DB_URL`, `DB_USER`, `DB_PASSWORD`)를 그대로 따른다

## 실행

- 루트에서 `pnpm run spring:run`
- 루트에서 `pnpm run spring:test`
- 루트에서 `pnpm run spring:war-package`

`scripts/spring/run-jeju-spring-maven.cjs`는 `JAVA_HOME`이 비어 있으면 PATH 또는 대표 설치 경로에서 JDK를 찾고, JDK 21 미만이면 바로 중단한다. 이 모듈은 embedded Tomcat이 아니라 외부 Tomcat 10.1 WAR 배포 경로를 전제로 한다.
