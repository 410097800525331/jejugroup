# front 엔트리포인트 인벤토리

## 목적

- `front`가 원본이고 `jeju-spring`은 최종 런타임 계층이다.
- 이 문서는 Spring이 어떤 경로를 전용 템플릿으로 서빙하는지, 어떤 경로를 host-only로 넘기는지, 그리고 현재 full coverage 기준을 정리한다.
- 이 문서는 현재 final runtime baseline 기준을 적는다.

## 분류 기준

- `Spring-served dedicated template`
  - Spring 컨트롤러가 Thymeleaf 템플릿을 직접 렌더링한다.
- `Spring host-only`
  - Spring 컨트롤러가 요청 경로를 `front-mirror/<legacy path>` 뷰 이름으로 바꿔 반환한다.
  - 실제 화면 본문은 `front` 원본 기준으로 유지한다.
  - customer_center는 `front/apps/cs` 소스에서 생성된 `front/.generated/webapp-overlay/pages/cs/**` 런타임 아티팩트를 canonical runtime artifact로 삼는다.
  - 현재 final-runtime baseline에서는 완료된 런타임 커버리지로 인정한다.
- `Full coverage baseline`
  - 이 문서는 남은 human-edited front HTML 진입점을 모두 host-only 목록으로 포함한 현재 기준선을 적는다.

## Spring-served dedicated template

| 경로 | Spring 컨트롤러 | Spring view | front 원본 |
| --- | --- | --- | --- |
| `/migration` | `migration/web/MigrationController` | `templates/migration/dashboard.html` | `front` migration 화면 |


## Spring host-only

| 경로 | 실제 반환 뷰 | front 원본 | 비고 |
| --- | --- | --- | --- |
| `/` | `index` | `front/index.html` | 메인 랜딩 래퍼 진입점, `/index.html`은 별도 canonical |
| `/index.html` | `front-mirror/index` | `front/index.html` | 메인 랜딩 host-only canonical 진입점 |
| `/jejuair/index.html` | `front-mirror/jejuair/index` | `front/jejuair/index.html` | 제주에어 최상위 고정 영역 호스트 |
| `/jejuair/pages/about/about.html` | `front-mirror/jejuair/pages/about/about` | `front/jejuair/pages/about/about.html` | 제주에어 about 호스트 전용 진입점 |
| `/jejuair/pages/about/career.html` | `front-mirror/jejuair/pages/about/career` | `front/jejuair/pages/about/career.html` | 제주에어 about 호스트 전용 진입점 |
| `/jejuair/pages/about/ccm.html` | `front-mirror/jejuair/pages/about/ccm` | `front/jejuair/pages/about/ccm.html` | 제주에어 about 호스트 전용 진입점 |
| `/jejuair/pages/baggage/cabinBaggage.html` | `front-mirror/jejuair/pages/baggage/cabinBaggage` | `front/jejuair/pages/baggage/cabinBaggage.html` | 수하물 기내반입 호스트 |
| `/jejuair/pages/baggage/liability.html` | `front-mirror/jejuair/pages/baggage/liability` | `front/jejuair/pages/baggage/liability.html` | 수하물 배상책임 호스트 |
| `/jejuair/pages/baggage/preorderedBaggage.html` | `front-mirror/jejuair/pages/baggage/preorderedBaggage` | `front/jejuair/pages/baggage/preorderedBaggage.html` | 수하물 사전구매 호스트 |
| `/jejuair/pages/baggage/transportLimitation.html` | `front-mirror/jejuair/pages/baggage/transportLimitation` | `front/jejuair/pages/baggage/transportLimitation.html` | 수하물 운송제한 호스트 |
| `/jejuair/pages/boarding/eDocument.html` | `front-mirror/jejuair/pages/boarding/eDocument` | `front/jejuair/pages/boarding/eDocument.html` | 탑승 전자문서 호스트 |
| `/jejuair/pages/boarding/fastProcedure.html` | `front-mirror/jejuair/pages/boarding/fastProcedure` | `front/jejuair/pages/boarding/fastProcedure.html` | 탑승 빠른절차 호스트 |
| `/jejuair/pages/boarding/viewCheckin.html` | `front-mirror/jejuair/pages/boarding/viewCheckin` | `front/jejuair/pages/boarding/viewCheckin.html` | 탑승 체크인 조회 호스트 |
| `/jejuair/pages/booking/Availability.html` | `front-mirror/jejuair/pages/booking/Availability` | `front/jejuair/pages/booking/Availability.html` | 예약 가능 여부 호스트 |
| `/jejuair/pages/booking/payment.html` | `front-mirror/jejuair/pages/booking/payment` | `front/jejuair/pages/booking/payment.html` | 예약 결제 호스트 |
| `/jejuair/pages/booking/route.html` | `front-mirror/jejuair/pages/booking/route` | `front/jejuair/pages/booking/route.html` | 예약 노선 호스트 |
| `/jejuair/pages/booking/viewOnOffReservationList.html` | `front-mirror/jejuair/pages/booking/viewOnOffReservationList` | `front/jejuair/pages/booking/viewOnOffReservationList.html` | 예약 현황 호스트 |
| `/jejuair/pages/event/event.html` | `front-mirror/jejuair/pages/event/event` | `front/jejuair/pages/event/event.html` | 이벤트 호스트 |
| `/jejuair/pages/jmembers/jmembersAirplane.html` | `front-mirror/jejuair/pages/jmembers/jmembersAirplane` | `front/jejuair/pages/jmembers/jmembersAirplane.html` | J멤버스 비행기 호스트 |
| `/jejuair/pages/jmembers/jmembersGolf.html` | `front-mirror/jejuair/pages/jmembers/jmembersGolf` | `front/jejuair/pages/jmembers/jmembersGolf.html` | J멤버스 골프 호스트 |
| `/jejuair/pages/jmembers/jmembersInsurance.html` | `front-mirror/jejuair/pages/jmembers/jmembersInsurance` | `front/jejuair/pages/jmembers/jmembersInsurance.html` | J멤버스 보험 호스트 |
| `/jejuair/pages/jmembers/jmembersSightseeing.html` | `front-mirror/jejuair/pages/jmembers/jmembersSightseeing` | `front/jejuair/pages/jmembers/jmembersSightseeing.html` | J멤버스 관광 호스트 |
| `/jejuair/pages/pet/petPass.html` | `front-mirror/jejuair/pages/pet/petPass` | `front/jejuair/pages/pet/petPass.html` | 반려동물 패스 호스트 |
| `/jejuair/pages/pet/petService.html` | `front-mirror/jejuair/pages/pet/petService` | `front/jejuair/pages/pet/petService.html` | 반려동물 서비스 호스트 |
| `/pages/auth/oauth_callback.html` | `front-mirror/pages/auth/oauth_callback` | `front/pages/auth/oauth_callback.html` | OAuth callback host-only 진입점 |
| `/pages/mypage/dashboard.html` / `/mypage/dashboard` | `front-mirror/pages/mypage/dashboard` | `front/pages/mypage/dashboard.html` | canonical host-only mypage page; `/mypage/dashboard` is alias/redirect-only |
| `/pages/auth/login.html` | `front-mirror/pages/auth/login` | `front/pages/auth/login.html` | auth canonical page, `/auth/login` 호환 alias |
| `/pages/auth/signup.html` | `front-mirror/pages/auth/signup` | `front/pages/auth/signup.html` | auth canonical page, `/auth/signup` 호환 alias |
| `/pages/auth/pass_auth.html` | `front-mirror/pages/auth/pass_auth` | `front/pages/auth/pass_auth.html` | auth canonical page, `/auth/pass` 호환 alias |
| `/pages/cs/customer_center.html` | `front-mirror/pages/cs/customer_center` | `front/.generated/webapp-overlay/pages/cs/customer_center.html` | customer_center canonical runtime artifact; source chain is `front/apps/cs` -> `.generated` overlay -> `jeju-spring` mirror |
| `/jejustay/pages/deals/deals.html` | `front-mirror/jejustay/pages/deals/deals` | `front/jejustay/pages/deals/deals.html` | `/deals` redirect 대상 canonical host-only 경로 |
| `/jejustay/pages/deals/deals_member.html` | `front-mirror/jejustay/pages/deals/deals_member` | `front/jejustay/pages/deals/deals_member.html` | `/deals/member` redirect 대상 canonical host-only 경로 |
| `/jejustay/pages/deals/deals_partner.html` | `front-mirror/jejustay/pages/deals/deals_partner` | `front/jejustay/pages/deals/deals_partner.html` | `/deals/partner` redirect 대상 canonical host-only 경로 |
| `/jejustay/pages/hotel/jejuhotel.html` | `front-mirror/jejustay/pages/hotel/jejuhotel` | `front/jejustay/pages/hotel/jejuhotel.html` | 호텔 호스트 |
| `/jejustay/pages/hotel/hotel-list.html` | `front-mirror/jejustay/pages/hotel/hotel-list` | `front/jejustay/pages/hotel/hotel-list.html` | `/stay/hotel-list` redirect 대상 canonical host-only 경로 |
| `/jejustay/pages/stay/jejustay_life.html` | `front-mirror/jejustay/pages/stay/jejustay_life` | `front/jejustay/pages/stay/jejustay_life.html` | 라이프 호스트 |
| `/jejustay/pages/stay/private_stay.html` | `front-mirror/jejustay/pages/stay/private_stay` | `front/jejustay/pages/stay/private_stay.html` | 프라이빗 스테이 호스트 |
| `/jejustay/pages/travel/activities.html` | `front-mirror/jejustay/pages/travel/activities` | `front/jejustay/pages/travel/activities.html` | `/travel/activities` redirect 대상 canonical host-only 경로 |
| `/jejustay/pages/travel/esim.html` | `front-mirror/jejustay/pages/travel/esim` | `front/jejustay/pages/travel/esim.html` | `/travel/esim` redirect 대상 canonical host-only 경로 |
| `/jejustay/pages/travel/travel_guide.html` | `front-mirror/jejustay/pages/travel/travel_guide` | `front/jejustay/pages/travel/travel_guide.html` | `/travel/guide` redirect 대상 canonical host-only 경로 |
| `/jejustay/pages/travel/travel_tips.html` | `front-mirror/jejustay/pages/travel/travel_tips` | `front/jejustay/pages/travel/travel_tips.html` | `/travel/tips` redirect 대상 canonical host-only 경로 |
| `/jejustay/pages/travel/travel_checklist.html` | `front-mirror/jejustay/pages/travel/travel_checklist` | `front/jejustay/pages/travel/travel_checklist.html` | 체크리스트 호스트 |
| `/admin/pages/dashboard.html` | `front-mirror/admin/pages/dashboard` | `front/admin/pages/dashboard.html` | 관리자 대시보드 호스트 |
| `/admin/pages/reservations.html` | `front-mirror/admin/pages/reservations` | `front/admin/pages/reservations.html` | 관리자 예약 호스트 |
| `/admin/pages/lodging.html` | `front-mirror/admin/pages/lodging` | `front/admin/pages/lodging.html` | 관리자 숙박 호스트 |
| `/admin/pages/members.html` | `front-mirror/admin/pages/members` | `front/admin/pages/members.html` | 관리자 회원 호스트 |
| `/admin/pages/cms.html` | `front-mirror/admin/pages/cms` | `front/admin/pages/cms.html` | 관리자 CMS 호스트 |

## 경계 메모

- 전용 Spring 템플릿은 Spring이 직접 렌더링한다.
- host-only 경로는 `front-mirror/<legacy path>` 뷰로 반환한다.
- 짧은 경로는 canonical legacy host-only 경로로 redirect 된다.
- 이 문서의 host-only 목록은 현재 final-runtime baseline에서 남은 human-edited front HTML 진입점을 모두 포함한다.
- customer_center는 `front/apps/cs`를 사람이 편집하는 원본으로 두되, 실제 런타임 계약은 `front/.generated/webapp-overlay/pages/cs/**`가 담당한다.
- `jeju-spring`은 customer_center용 별도 수제 프런트엔드를 유지하지 않는다.
- 컨트롤러와 문서가 같은 기준을 보도록 이 표를 유지한다.
