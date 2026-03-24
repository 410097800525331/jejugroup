# 전환 아키텍처

## 목적

- `front`는 사람이 직접 수정하는 유일한 프런트 원본이다.
- `jeju-spring`은 최종 런타임에서 그 원본을 서빙하거나 호스트만 맡는 계층이다.
- `jeju-web/src/main/webapp`은 레거시 미러로만 남기고 기본 런타임 의존성에서 뺀다.
- 현재 final runtime baseline은 `jeju-spring` 기준으로 닫혀 있다.

## 현재 구조

### 전용 Spring 템플릿

- Spring 컨트롤러가 Thymeleaf 템플릿을 직접 렌더링한다.
- 이 묶음은 `front` 원본과 1:1로 대응되는 전용 페이지다.

### Spring host-only

- Spring은 경로와 호스트만 제공하고, 실제 화면 의미는 `front` 원본을 따른다.
- 이 경로들은 `templates/front-mirror/**` 아래의 실제 미러 템플릿으로 응답한다.
- 컨트롤러는 요청 경로를 그대로 `front-mirror/<legacy path>` 형태의 뷰 이름으로 바꿔 반환한다.
- 이 host-only 경로들은 현재 final-runtime baseline에서 완료된 runtime coverage로 인정한다.

### 제외 경로

- `jejuair/pages/**`는 현재 Spring final runtime baseline에서 영구 제외한다.
- `/pages/auth/oauth_callback.html`도 현재 Spring final runtime baseline에서 영구 제외한다.

## 전용 Spring 템플릿 목록

| 경로 | Spring 컨트롤러 | 템플릿 | front 원본 |
| --- | --- | --- | --- |
| `/` / `/index.html` | `web/LandingController` | `templates/index.html` | `front/index.html` |
| `/auth/login` / `/pages/auth/login.html` | `auth/web/AuthPageController` | `templates/auth/login.html` | `front/pages/auth/login.html` |
| `/auth/signup` / `/pages/auth/signup.html` | `auth/web/AuthPageController` | `templates/auth/signup.html` | `front/pages/auth/signup.html` |
| `/auth/pass` / `/pages/auth/pass_auth.html` | `auth/web/AuthPageController` | `templates/auth/pass-auth.html` | `front/pages/auth/pass_auth.html` |
| `/migration` | `migration/web/MigrationController` | `templates/migration/dashboard.html` | `front` migration 화면 |
| `/deals` / `/jejustay/pages/deals/deals.html` | `deals/web/DealsController` | `templates/deals/main.html` | `front/jejustay/pages/deals/deals.html` |
| `/deals/member` / `/jejustay/pages/deals/deals_member.html` | `deals/web/DealsController` | `templates/deals/member.html` | `front/jejustay/pages/deals/deals_member.html` |
| `/deals/partner` / `/jejustay/pages/deals/deals_partner.html` | `deals/web/DealsController` | `templates/deals/partner.html` | `front/jejustay/pages/deals/deals_partner.html` |
| `/mypage/dashboard` / `/pages/mypage/dashboard.html` | `mypage/web/MyPageController` | `templates/mypage/dashboard.html` | `front/pages/mypage/dashboard.html` |
| `/stay/hotel-list` / `/jejustay/pages/hotel/hotel-list.html` | `stay/web/StayController` | `templates/stay/hotel-list.html` | `front/jejustay/pages/hotel/hotel-list.html` |
| `/travel/activities` / `/jejustay/pages/travel/activities.html` | `travel/web/TravelController` | `templates/travel/activities.html` | `front/jejustay/pages/travel/activities.html` |
| `/travel/esim` / `/jejustay/pages/travel/esim.html` | `travel/web/TravelController` | `templates/travel/esim.html` | `front/jejustay/pages/travel/esim.html` |
| `/travel/guide` / `/jejustay/pages/travel/travel_guide.html` | `travel/web/TravelController` | `templates/travel/guide.html` | `front/jejustay/pages/travel/travel_guide.html` |
| `/travel/tips` / `/jejustay/pages/travel/travel_tips.html` | `travel/web/TravelController` | `templates/travel/tips.html` | `front/jejustay/pages/travel/travel_tips.html` |

## Spring host-only 목록

| 경로 | 실제 반환 뷰 | front 원본 | 비고 |
| --- | --- | --- | --- |
| `/jejuair/index.html` | `front-mirror/jejuair/index` | `front/jejuair/index.html` | 제주에어 최상위 고정 영역 호스트 |
| `/pages/cs/customer_center.html` | `front-mirror/pages/cs/customer_center` | `front/apps/cs/client/index.html` | 고객센터 host-only 진입점 |
| `/jejustay/pages/hotel/jejuhotel.html` | `front-mirror/jejustay/pages/hotel/jejuhotel` | `front/jejustay/pages/hotel/jejuhotel.html` | 호텔 호스트 |
| `/jejustay/pages/stay/jejustay_life.html` | `front-mirror/jejustay/pages/stay/jejustay_life` | `front/jejustay/pages/stay/jejustay_life.html` | 라이프 호스트 |
| `/jejustay/pages/stay/private_stay.html` | `front-mirror/jejustay/pages/stay/private_stay` | `front/jejustay/pages/stay/private_stay.html` | 프라이빗 스테이 호스트 |
| `/jejustay/pages/travel/travel_checklist.html` | `front-mirror/jejustay/pages/travel/travel_checklist` | `front/jejustay/pages/travel/travel_checklist.html` | 체크리스트 호스트 |
| `/admin/pages/dashboard.html` | `front-mirror/admin/pages/dashboard` | `front/admin/pages/dashboard.html` | 관리자 대시보드 호스트 |
| `/admin/pages/reservations.html` | `front-mirror/admin/pages/reservations` | `front/admin/pages/reservations.html` | 관리자 예약 호스트 |
| `/admin/pages/lodging.html` | `front-mirror/admin/pages/lodging` | `front/admin/pages/lodging.html` | 관리자 숙박 호스트 |
| `/admin/pages/members.html` | `front-mirror/admin/pages/members` | `front/admin/pages/members.html` | 관리자 회원 호스트 |
| `/admin/pages/cms.html` | `front-mirror/admin/pages/cms` | `front/admin/pages/cms.html` | 관리자 CMS 호스트 |

## 제외 경로

| 경로 | 결정 | 이유 |
| --- | --- | --- |
| `/jejuair/pages/**` | 영구 제외 | 현재 final runtime baseline에서 host-only로 끌어오지 않는다. |
| `/pages/auth/oauth_callback.html` | 영구 제외 | OAuth callback은 page host 책임에서 현재 baseline 밖으로 둔다. |

## 경계 원칙

- 전용 Spring 템플릿은 Spring이 직접 렌더링한다.
- host-only 경로는 `front-mirror/<legacy path>` 뷰를 반환하며, 완료된 runtime coverage로 본다.
- `front`와 `jeju-spring`의 경계는 문서와 컨트롤러가 같은 기준을 보게 유지한다.
