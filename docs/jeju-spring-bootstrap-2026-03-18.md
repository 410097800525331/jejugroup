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
- 첫 서비스 페이지 엔트리: `/auth/login`, `/pages/auth/login.html`
- 두 번째 서비스 페이지 엔트리: `/auth/signup`, `/pages/auth/signup.html`
- 세 번째 서비스 페이지 엔트리: `/auth/pass`, `/pages/auth/pass_auth.html`
- 네 번째 서비스 페이지 엔트리: `/mypage/dashboard`, `/pages/mypage/dashboard.html`
- 다섯 번째 서비스 페이지 엔트리: `/travel/activities`, `/jejustay/pages/travel/activities.html`
- 여섯 번째 서비스 페이지 엔트리: `/travel/esim`, `/jejustay/pages/travel/esim.html`
- 일곱 번째 서비스 페이지 엔트리: `/travel/guide`, `/jejustay/pages/travel/travel_guide.html`
- 여덟 번째 서비스 페이지 엔트리: `/travel/tips`, `/jejustay/pages/travel/travel_tips.html`
- 아홉 번째 서비스 페이지 엔트리: `/stay/hotel-list`, `/jejustay/pages/hotel/hotel-list.html`
- 열 번째 서비스 페이지 엔트리: `/deals`, `/jejustay/pages/deals/deals.html`
- 열한 번째 서비스 페이지 엔트리: `/deals/member`, `/jejustay/pages/deals/deals_member.html`
- 열두 번째 서비스 페이지 엔트리: `/deals/partner`, `/jejustay/pages/deals/deals_partner.html`
- Readiness JSON 엔트리: `/migration/readiness`
- Actuator health: `/actuator/health`
- 내부 패키지 기준:
  - `config`: 공용 설정 바인딩
  - `migration/application`: migration dashboard 조합 로직
  - `migration/web`: HTML + JSON 엔트리
  - `migration/view`: Thymeleaf/API 응답 record

## 환경 변수 규칙

- 배포용 `.env`는 새로 만들지 않는다.
- 기본적으로 `jeju-spring`은 `../jeju-web/.env`를 `spring.config.import`로 읽는다.
- 서버 경로가 다르면 `JEJU_SHARED_ENV_PATH`로 override 한다.
- Alwaysdata / SSH / 외부 API 키는 `jeju-web/.env`를 공용 소스로 유지한다.

## 루트 기준 실행 커맨드

- `pnpm run spring:run`
- `pnpm run spring:test`
- `pnpm run spring:package`
- 루트 스크립트는 `JAVA_HOME`이 비어 있으면 PATH 또는 대표 설치 경로에서 JDK를 먼저 찾는다.

## 첫 이행 원칙

- `front`는 계속 사람이 수정하는 원본으로 유지한다.
- 페이지 단위로 Thymeleaf 템플릿을 `jeju-spring/src/main/resources/templates` 아래로 옮긴다.
- 공용 CSS/이미지는 필요한 범위만 `jeju-spring/src/main/resources/static`으로 가져온다.
- `login`, `signup`, `pass_auth` 화면은 Thymeleaf로 옮겼고, auth API도 이제 `jeju-spring`의 Spring MVC `/api/auth/*`가 처리한다.
- 다만 DB 계약은 아직 legacy `users` 테이블과 `.env`의 `DB_URL`, `DB_USER`, `DB_PASSWORD`를 그대로 사용한다.
- `mypage/dashboard`는 Spring session 기반으로 동작하고, 세션이 없으면 Spring login 경로로 리다이렉트한다.
- `jejustay travel/activities`는 첫 정적 여행 페이지 이행 케이스로, 카드 목록/필터/검색/인증 배너 모달까지 Spring 템플릿에서 처리한다.
- `jejustay travel/esim`, `travel_guide`, `travel_tips`도 Spring 템플릿으로 옮겼고, 검색/아코디언/도시 탭 같은 기본 인터랙션은 페이지별 JS로 재구성했다.
- `jejustay hotel-list`, `deals`, `deals_member`, `deals_partner`도 Spring 템플릿으로 옮겼다. 이로써 정적 호텔/프로모션 라인은 대부분 Spring 쪽에서 소화 가능해졌다.
- JDBC 의존성은 넣어뒀지만, 실제 DB 마이그레이션 전까지는 datasource auto configuration을 끈 상태로 둔다.
- 기존 `jeju-web` deploy script는 당장 건드리지 않는다. Spring WAR 배포 파이프라인은 템플릿 이관 후 별도로 연결한다.
- 공용 스타일은 `assets/css/app.css`, 페이지별 스타일은 기능 폴더 아래로 분리한다.

## 다음 추천 순서

1. auth/mypage/travel/stay/deals 공통 fragment와 shared helper를 조금 더 정리한다.
2. `jejustay` 남은 island 페이지(`jejuhotel`, `jejustay_life`, `private_stay`, `travel_checklist`) 이행을 시작한다.
3. Spring WAR 산출물을 alwaysdata 배포 스크립트에 붙일 별도 파이프라인을 만든다.
