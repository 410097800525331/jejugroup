# 하이브리드 구조 운영 문서

## 문서 성격

- 파일명은 기존 참조 경로를 유지하기 위해 `transition-architecture.md` 를 그대로 사용
- 하지만 현재 운영 기준은 `전면 React 전환 중` 이 아니라 `하이브리드 구조 확정` 이다
- 이 문서는 `front` 와 `jeju-web` 을 어떻게 다뤄야 하는지, 어떤 영역이 React 앱이고 어떤 영역이 고정 정적인지 정리하는 운영 기준서다

## 구조 결론

- `jejuair` 는 비전환 고정 영역이다
- `front` 는 사람이 직접 수정하는 단일 원본이다
- `front/apps/cs` 는 독립 React 앱 원본이다
- `front/apps/shell` 은 공용 하이브리드 런타임 원본이다
- `front/components/react` 는 공용 React 컴포넌트 원본이다
- `jejustay`, `auth`, `mypage`, 메인 랜딩은 정적 HTML + 셸 런타임 + React island 조합을 허용하는 하이브리드 영역이다
- `jeju-web/src/main/webapp` 는 계속 배포 미러로 사용한다

## 디렉터리 역할

### `front`

- 사람이 직접 수정하는 프런트엔드 원본
- 화면 마크업, 스타일, 공용 런타임, 앱 엔트리 수정은 여기서 시작

### `front/apps/cs`

- 고객센터 React 앱 원본
- 개발 엔트리는 `front/apps/cs/client/index.html`
- 실제 서비스 경로 `/pages/cs/customer_center.html` 은 빌드 산출물 또는 개발 서버 middleware 로 연결

### `front/apps/shell`

- 하이브리드 페이지 공용 런타임 원본
- 페이지 셸, island 마운트, 런타임 브리지, 공용 부트스트랩 로직 담당

### `front/components/react`

- 공용 React 컴포넌트 원본
- layout, auth, hotel, life, travel, ui, widget 계열을 관리

### `front/jejuair`

- 비전환 고정 영역
- 현재 구조와 정적 페이지 흐름을 유지
- 기능 수정은 가능하지만 React 전환 대상으로 간주하지 않는다

### `front/jejustay`

- 하이브리드 운영 영역
- 정적 HTML 엔트리를 유지하되 필요 구간은 셸 런타임과 island 로 통합

### `front/pages`

- 인증, 마이페이지 등 공용 서비스 페이지
- 일부는 React island 호스트를 포함하는 하이브리드 페이지다

### `jeju-web/src/main/webapp`

- 배포용 미러
- `front` 원본에서 동기화된 결과를 유지하는 위치
- 직접 수정 금지

## 렌더링 모드 기준

### 고정 정적

- `front/jejuair/**`
- `front/admin/pages/**`
- `front/pages/auth/oauth_callback.html`

### 하이브리드 정적 + 셸 런타임

- `front/index.html`
- `front/jejustay/pages/deals/**`
- `front/jejustay/pages/hotel/hotel-list.html`
- `front/jejustay/pages/travel/activities.html`
- `front/jejustay/pages/travel/esim.html`
- `front/jejustay/pages/travel/travel_guide.html`
- `front/jejustay/pages/travel/travel_tips.html`

### 하이브리드 정적 + 셸 런타임 + React island

- `front/pages/auth/login.html`
- `front/pages/auth/signup.html`
- `front/pages/auth/pass_auth.html`
- `front/pages/mypage/dashboard.html`
- `front/jejustay/pages/hotel/jejuhotel.html`
- `front/jejustay/pages/stay/jejustay_life.html`
- `front/jejustay/pages/stay/private_stay.html`
- `front/jejustay/pages/travel/travel_checklist.html`

### 독립 React 앱

- `front/apps/cs`

## 현재 배포 흐름

1. `front` 원본 수정
2. `pnpm run prepare:webapp` 또는 `pnpm run sync` 로 `jeju-web/src/main/webapp` 미러 반영
3. sync 단계에서 webapp 내 HTML 엔트리를 대응 JSP 로 자동 미러 생성
4. `pnpm run build` 또는 `pnpm run deploy` 로 WAR 생성 및 배포

## 운영 규칙

- 프런트엔드 수정은 항상 `front` 기준으로 판단
- `jeju-web/src/main/webapp` 직접 수정 금지
- 빌드 산출물 `front/components/runtime/*`, `front/.generated/**` 직접 수정 금지
- `jejuair` 는 비전환 고정 정책을 유지
- 새 페이지를 추가할 때는 `고정 정적`, `하이브리드`, `독립 앱` 중 하나를 먼저 선언하고 시작할 것

## 같이 봐야 하는 문서

- [하이브리드 실행 체크리스트](D:/git/jejugroup/docs/hybrid-execution-checklist.md)
- [front 엔트리포인트 인벤토리](D:/git/jejugroup/docs/front-entrypoint-inventory.md)
- [텍스트 무결성 가드레일](D:/git/jejugroup/docs/text-integrity-guardrails.md)
- [메인 Vite 개발 서버 문서](D:/git/jejugroup/docs/front-main-vite-dev-server-2026-03-14.md)
