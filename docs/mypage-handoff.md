# 마이페이지 handoff

## 목적

- 이 문서는 마이페이지 작업을 나중에 다른 컴퓨터에서 이어갈 때 기준서로 쓴다.
- `STATE.md` 는 임시 작업판이라 장기 기준으로 믿지 말고, 이 문서와 `SEED.mypage-step*.yaml` 을 우선 본다.

## 절대 규칙

- 마이페이지는 계속 `소비자` 역할이어야 한다.
- 마이페이지가 직접 `itinerary` 를 source of truth 로 가지면 안 된다.
- 디자인/CSS 는 건드리지 않는다.
- `front` 만 수정한다.
- `jeju-web`, `jeju-spring` 미러는 직접 수정하지 않는다.
- 구매 플로우가 붙기 전까지는 실제 DB/API 를 가정하지 않는다.
- mock 데이터는 계정 종속 local storage seam 을 통해서만 흘려보낸다.

## 현재 완료 상태

### 체크포인트 커밋

- `5bacf63` `refactor: centralize mypage itinerary and support state`
- `498da7e` `feat: add account-scoped mypage mock storage seam`
- `0fea25d` `feat: switch mypage itinerary to status-driven events`

### 현재 seed

- [SEED.mypage-step1.yaml](/D:/git/jejugroup/SEED.mypage-step1.yaml)
- [SEED.mypage-step2.yaml](/D:/git/jejugroup/SEED.mypage-step2.yaml)
- [SEED.mypage-step3.yaml](/D:/git/jejugroup/SEED.mypage-step3.yaml)

## 현재 구조

### 마이페이지 공통 상태

- [state.tsx](/D:/git/jejugroup/front/components/react/mypage/state.tsx)
- 현재 dashboard state 는 아래를 가진다.
  - `bookings`
  - `stats`
  - `profile`
  - `supportItems`
  - `linkedCompanions`
  - `travelEvents`
  - `itinerary`

### mock 저장소 seam

- [mockAccountDashboardStore.ts](/D:/git/jejugroup/front/components/react/mypage/mockAccountDashboardStore.ts)
- 계정별 key 로 local storage 버킷을 분리한다.
- 현재 계정 mock 데이터와 session 데이터를 merge 한 뒤 마이페이지가 hydrate 한다.
- linked companion 이 있으면 그 companion 계정 버킷의 `travelEvents` 도 읽어서 집계한다.

### itinerary 원칙

- [data.ts](/D:/git/jejugroup/front/components/react/mypage/data.ts)
- `itinerary` 는 직접 저장하는 진짜 원천 데이터가 아니다.
- 현재 기준 원천은 `travelEvents + linkedCompanions + currentAccountId` 다.
- `itinerary` 는 위 데이터에서 파생된다.

### status 모델

- [types.ts](/D:/git/jejugroup/front/components/react/mypage/types.ts)
- `TravelEventStatus`
  - `reserved`
  - `used`
  - `cancelled`
  - `missed`

## 이미 바뀐 것

- 여행 일정은 더 이상 사용자 수동 체크가 source of truth 가 아니다.
- 일정 체크 UI는 읽기 전용 상태 표현으로 바뀌었다.
- 동행자 연동은 day 별 로컬 데이터가 아니라 계정 종속 `linkedCompanions` 로 본다.
- 현재 계정 + linked companion 의 이벤트를 합쳐서 itinerary 를 만든다.

## 아직 안 한 것

- 제주에어 구매 플로우 writer
- 스테이 구매 플로우 writer
- 렌터카 구매 플로우 writer
- 액티비티/유심/바우처 구매 플로우 writer
- 토스 결제 성공/실패/취소 분기에서 mock 주문 생성
- `bookings` 와 `travelEvents` 를 동시에 쓰는 공용 writer 정리
- 포인트/쿠폰/다가오는 여행/문의내역을 원천 데이터에서 자동 파생하는 정리

## 이후 작업할 때 주의점

### 1. 마이페이지 직접 패치 금지

- 구매 플로우를 붙일 때 마이페이지 컴포넌트를 직접 수정해서 값 넣지 마라.
- 서비스 페이지가 공용 writer 로 `bookings` 와 `travelEvents` 를 써야 한다.

### 2. `itinerary` 직접 저장 금지

- `itinerary` 를 local storage 에 직접 쓰기 시작하면 drift 난다.
- 원천은 계속 `travelEvents` 여야 한다.

### 3. 구매 완료와 사용 완료를 섞지 말 것

- `reserved` 는 구매/예약 완료
- `used` 는 실제 사용 완료
- `cancelled` 는 취소
- `missed` 는 미사용/이용 실패

### 4. 동행자 링크와 동행자 이벤트는 별개

- linked companion 을 해제해도 그 계정의 mock 데이터 자체를 지우면 안 된다.
- 링크만 끊고, 집계 대상에서만 제외해야 한다.

### 5. 토스 팝업 붙일 때

- 결제 팝업 진입 시점에 쓰지 마라.
- 성공 시점에만 mock 주문/이벤트를 생성해야 한다.
- 실패/취소/닫기 케이스를 success 와 분리해야 한다.

### 6. 중복 생성 주의

- `bookingId`, `travelEvent.id`, `dayId` 를 안정적으로 잡아야 한다.
- 뒤로 가기, 새로고침, 버튼 두 번 클릭에서 중복 생성 안 나게 해야 한다.

## 추천 다음 순서

1. 서비스 공용 mock writer 유틸 설계
2. 제주에어 한 군데만 연결
3. 토스 성공/실패/취소 분기 검증
4. 스테이, 렌터카, 액티비티, 바우처 확장
5. 마지막에 요약 수치 파생 정리

## 검증 원칙

- 단계별로 작업한다.
- 매 단계마다 검증 후 커밋한다.
- 큰 범위라도 중간 체크포인트 커밋은 반드시 남긴다.
- 기본 검증은 상황에 따라 아래 중 relevant 한 걸 쓴다.
  - `pnpm run build:front`
  - `pnpm run guard:text`

## 빠른 재시작 포인트

- 구조 먼저 볼 파일
  - [types.ts](/D:/git/jejugroup/front/components/react/mypage/types.ts)
  - [data.ts](/D:/git/jejugroup/front/components/react/mypage/data.ts)
  - [state.tsx](/D:/git/jejugroup/front/components/react/mypage/state.tsx)
  - [mockAccountDashboardStore.ts](/D:/git/jejugroup/front/components/react/mypage/mockAccountDashboardStore.ts)
  - [ItinerarySection.tsx](/D:/git/jejugroup/front/components/react/mypage/ItinerarySection.tsx)

- 이어서 볼 작업
  - 서비스 페이지에서 공용 writer 로 `bookings`, `travelEvents` 생성 연결
