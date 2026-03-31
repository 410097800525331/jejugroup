# 제주스테이 공용 셸 selector 전수조사

## 목적

- `front/jejustay/pages/**/*.css` 에서 공용 헤더/푸터 셸을 침범하는 generic selector 조사
- 기준
  - 공용 셸 책임
    - 헤더
    - 푸터
    - GNB
    - 유틸
    - 메가메뉴
    - 모바일 네비
  - 페이지 CSS 책임
    - 본문
    - 히어로
    - 카드
    - 검색폼
    - 페이지 전용 섹션

## 스캔 기준 selector

- `.header*`
- `.footer*`
- `.nav-link*`
- `.nav-item*`
- `.nav-icon*`
- `.main-nav*`
- `.header-utils*`
- `.util-link*`
- `.util-icon*`
- `.mobile-menu-btn*`
- `.mobile-nav*`
- `.mobile-nav-list*`
- `.mobile-nav-link*`
- `.mega-dropdown*`
- `.mega-dropdown-inner*`
- `.mega-grid*`
- `.mega-card*`
- `.mega-menu-list-horizontal*`
- `.logo*`
- `.logo-img*`
- `.login-btn*`

## 결과 요약

### 최우선 정리 대상

- `front/jejustay/pages/hotel/hotel.css`
- 적발 수: 81

이 파일이 사실상 옛 공용 헤더/푸터 레이아웃을 아직 들고 있음

대표 침범 구간

- `.header`
- `.header-container`
- `.logo`
- `.logo-img`
- `.main-nav`
- `.nav-item`
- `.nav-link`
- `.nav-icon`
- `.header-utils`
- `.util-link`
- `.util-icon`
- `.mobile-menu-btn`
- `.mobile-nav`
- `.mega-dropdown`
- `.mega-dropdown-inner`
- `.mega-menu-list-horizontal`
- `.footer`

즉 `jejuhotel.html` 헤더 정렬 깨짐의 1차 원인도 여기로 봐도 됨

### 보조 정리 대상

- `front/jejustay/pages/stay/jejustay_life.css`
- 적발 수: 1

남은 건 공용 푸터를 투명으로 만드는 `.footer` 한 줄뿐

- `front/jejustay/pages/travel/esim.css`
- 적발 수: 9

남은 건 전부 generic footer 계열

- `.footer-grid`
- `.footer-brand`
- `.footer-description`
- `.footer-title`
- `.footer-links`
- `.footer-bottom`

공용 footer 내부 class와 이름이 겹칠 가능성이 커서 후순위 정리 필요

### 침범 없음

- `front/jejustay/pages/deals/deals.css`
- `front/jejustay/pages/hotel/hotel-list.css`
- `front/jejustay/pages/stay/private_stay.css`
- `front/jejustay/pages/travel/activities.css`
- `front/jejustay/pages/travel/travel_checklist.css`
- `front/jejustay/pages/travel/travel_guide.css`

## 우선순위

1. `hotel.css`
2. `jejustay_life.css`
3. `esim.css`

## 다음 작업 제안

### 1단계

- `hotel.css` 에서 공용 셸 관련 generic selector 제거 또는 namespaced 전환
- 최소 대상
  - 헤더
  - GNB
  - 유틸
  - 메가메뉴
  - 모바일 네비
  - 푸터

### 2단계

- `jejustay_life.css` 의 `.footer` 제거

### 3단계

- `esim.css` 의 footer 관련 generic selector를 페이지 전용 class로 치환하거나 제거

## 메모

- 현재 제주스테이 공용 헤더 자체는 `hotel-shell-*` 로 많이 분리됐음
- 그런데 `hotel.css` 가 여전히 과거 공용 셸 CSS 원본처럼 남아 있어서 충돌이 반복되는 흐름
- 결론적으로 이번 정리의 핵심은 `hotel.css` 해체 작업

## 2026-03-13 정리 결과

- `front/jejustay/pages/hotel/hotel.css`
  - 공용 헤더
  - 메가메뉴
  - 모바일 네비
  - 공용 푸터
  관련 generic selector 제거 완료

- `front/jejustay/pages/stay/jejustay_life.css`
  - 남아 있던 `.footer` 제거 완료

- `front/jejustay/pages/travel/esim.css`
  - generic footer 블록 제거 완료

재스캔 결과

- `front/jejustay/pages/**/*.css` 기준 공용 셸 침범 selector 0건

검증

- `pnpm test` 통과
- `jejuhotel.html` 공용 헤더 재렌더 캡처 확인
