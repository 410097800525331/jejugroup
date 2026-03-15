# front 엔트리포인트 인벤토리

## 기준

- 이 문서는 `front` 내부 HTML 엔트리포인트의 현재 운영 분류를 기록한다
- `node_modules` 내부 샘플 HTML 은 제외한다
- 기준 축은 `렌더 방식`, `원본 위치`, `수정 위치`, `비고` 다

## 1. 독립 React 앱

| 서비스 | 개발 원본 | 실제 경로 | 수정 위치 | 비고 |
| --- | --- | --- | --- | --- |
| 고객센터 | `front/apps/cs/client/index.html` | `/pages/cs/customer_center.html` | `front/apps/cs/**` | 빌드 산출물 `front/pages/cs/**` 직접 수정 금지 |

## 2. 하이브리드 정적 + 셸 런타임 + React island

| 엔트리 | 수정 위치 | island 호스트 | 비고 |
| --- | --- | --- | --- |
| `front/pages/auth/login.html` | `front/pages/auth/**`, `front/components/react/auth/**`, `front/apps/shell/**` | `jeju-login-app` | page shell bridge 사용 |
| `front/pages/auth/signup.html` | `front/pages/auth/**`, `front/components/react/auth/**`, `front/apps/shell/**` | `jeju-signup-app` | page shell bridge 사용 |
| `front/pages/auth/pass_auth.html` | `front/pages/auth/**`, `front/components/react/auth/**`, `front/apps/shell/**` | `jeju-pass-auth-app` | 단일 island 페이지 |
| `front/pages/mypage/dashboard.html` | `front/pages/mypage/**`, `front/components/react/mypage/**`, `front/apps/shell/**` | `mypage-dashboard-root` | 마이페이지 island |
| `front/jejustay/pages/hotel/jejuhotel.html` | `front/jejustay/pages/hotel/**`, `front/components/react/hotel/**`, `front/apps/shell/**` | `hotel-search-widget-root` | 호텔 검색 island |
| `front/jejustay/pages/stay/jejustay_life.html` | `front/jejustay/pages/stay/**`, `front/components/react/life/**`, `front/apps/shell/**` | `life-search-widget-root` | 롱스테이 검색 island |
| `front/jejustay/pages/stay/private_stay.html` | `front/jejustay/pages/stay/**`, `front/components/react/hotel/**`, `front/apps/shell/**` | `hotel-search-widget-root` | 호텔 검색 island 재사용 |
| `front/jejustay/pages/travel/travel_checklist.html` | `front/jejustay/pages/travel/**`, `front/components/react/travel/**`, `front/apps/shell/**` | `jeju-travel-checklist-app` | 체크리스트 island 앱 |

## 3. 하이브리드 정적 + 셸 런타임

| 엔트리 그룹 | 실제 파일 |
| --- | --- |
| 메인 랜딩 | `front/index.html` |
| JEJU STAY deals | `front/jejustay/pages/deals/deals.html`, `front/jejustay/pages/deals/deals_member.html`, `front/jejustay/pages/deals/deals_partner.html` |
| JEJU STAY hotel static | `front/jejustay/pages/hotel/hotel-list.html` |
| JEJU STAY travel static | `front/jejustay/pages/travel/activities.html`, `front/jejustay/pages/travel/esim.html`, `front/jejustay/pages/travel/travel_guide.html`, `front/jejustay/pages/travel/travel_tips.html` |

수정 기준

- 공용 셸, 헤더, 푸터, FAB, 챗봇: `front/apps/shell/**`, `front/components/react/layout/**`, `front/components/react/ui/**`, `front/components/react/widget/**`
- 페이지 전용 마크업/스타일: 해당 `front/**/pages/**`

## 4. 고정 정적 유지

### `jejuair`

- `front/jejuair/index.html`
- `front/jejuair/pages/about/*`
- `front/jejuair/pages/baggage/*`
- `front/jejuair/pages/boarding/*`
- `front/jejuair/pages/booking/*`
- `front/jejuair/pages/cs/*`
- `front/jejuair/pages/event/*`
- `front/jejuair/pages/jmembers/*`
- `front/jejuair/pages/pet/*`

운영 규칙

- React 전환 대상으로 보지 않는다
- 기능 수정은 가능하지만 구조 변경은 보수적으로 진행한다

### 기타 고정 정적

- `front/admin/pages/cms.html`
- `front/admin/pages/dashboard.html`
- `front/admin/pages/lodging.html`
- `front/admin/pages/members.html`
- `front/admin/pages/reservations.html`
- `front/pages/auth/oauth_callback.html`

## 5. 수정 금지 산출물

- `front/pages/cs/assets/**`
- `front/pages/**/assets/**`
- `front/components/runtime/**`
- `.generated/front/**`
- `jeju-web/src/main/webapp/**` 직접 원본처럼 수정 금지
