# front 엔트리포인트 인벤토리

## 목적

- `front`가 원본이고 `jeju-spring`은 최종 런타임 계층이다.
- 이 문서는 Spring이 어떤 경로를 전용 템플릿으로 서빙하는지, 어떤 경로를 host-only로 넘기는지, 어떤 경로를 제외하는지 정리한다.
- 이 문서는 현재 final runtime baseline 기준을 적는다.

## 분류 기준

- `Spring-served dedicated template`
  - Spring 컨트롤러가 Thymeleaf 템플릿을 직접 렌더링한다.
- `Spring host-only`
  - Spring 컨트롤러가 요청 경로를 `front-mirror/<legacy path>` 뷰 이름으로 바꿔 반환한다.
  - 실제 화면 본문은 `front` 원본 기준으로 유지한다.
  - 현재 final-runtime baseline에서는 완료된 런타임 커버리지로 인정한다.
- `Permanent exclusions from Spring final runtime`
  - 현재 final runtime baseline에서 영구 제외한다.

## Spring-served dedicated template

| 경로 | Spring 컨트롤러 | Spring view | front 원본 |
| --- | --- | --- | --- |
| `/` / `/index.html` | `web/LandingController` | `templates/index.html` | `front/index.html` |
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

## Spring host-only

| 경로 | 실제 반환 뷰 | front 원본 | 비고 |
| --- | --- | --- | --- |
| `/jejuair/index.html` | `front-mirror/jejuair/index` | `front/jejuair/index.html` | 제주에어 최상위 고정 영역 호스트 |
| `/pages/auth/login.html` | `front-mirror/pages/auth/login` | `front/pages/auth/login.html` | auth canonical page, `/auth/login` 호환 alias |
| `/pages/auth/signup.html` | `front-mirror/pages/auth/signup` | `front/pages/auth/signup.html` | auth canonical page, `/auth/signup` 호환 alias |
| `/pages/auth/pass_auth.html` | `front-mirror/pages/auth/pass_auth` | `front/pages/auth/pass_auth.html` | auth canonical page, `/auth/pass` 호환 alias |
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

## 영구 제외 경로

| 경로 | 결정 | 이유 |
| --- | --- | --- |
| `/jejuair/pages/**` | 영구 제외 | 현재 final runtime baseline에서 host-only로 올리지 않는다. |
| `/pages/auth/oauth_callback.html` | 영구 제외 | OAuth callback은 page host 책임에서 현재 baseline 밖으로 둔다. |

## 경계 메모

- 전용 Spring 템플릿은 Spring이 직접 렌더링한다.
- host-only 경로는 실제 `front-mirror/...` 템플릿으로 응답한다.
- host-only 경로는 현재 final-runtime baseline의 완료된 런타임 커버리지로 친다.
- 컨트롤러와 문서가 같은 기준을 보도록 이 표를 유지한다.
