# 제주스테이 공용 헤더 수습 메모

## 작업 범위

- 대상: `front/jejustay` 공용 헤더/푸터 정리 중 헤더 깨짐 수습
- 기준: 제주스테이 내부 페이지는 공용 헤더/푸터 셸을 공유
- 목적: `deals.html` 에서 보이던 헤더 결과물을 공용 컴포넌트 쪽으로 흡수

## 오늘 반영한 핵심 수정

### 1. 공용 헤더 루트 복구

- `front/components/react/layout/HotelHeaderTemplate.tsx`
- 루트 클래스를 `header hotel-shell-header` 로 복구
- 예전에 제거했던 `.header` 를 다시 붙여서 고정 위치, 스크롤 클래스, 공용 헤더 뼈대를 되살림
- `hotel.css` 내부의 `.hotel-header` 카드 레이아웃과 충돌하지 않도록 루트에서 `hotel-header` 클래스는 제거

### 2. 공용 헤더 내부 클래스 완전 분리

- `front/components/react/layout/HotelHeaderTemplate.tsx`
- `front/components/react/layout/HotelMegaMenuItem.tsx`
- `front/components/react/layout/header.css`
- `front/components/react/layout/mega-menu.css`

기존 generic class 의존을 끊고 아래 계열로 통일

- `hotel-shell-nav-link`
- `hotel-shell-util-link`
- `hotel-shell-mobile-nav`
- `hotel-shell-mega-dropdown`
- `hotel-shell-preview-image`

이걸로 페이지별 `nav-link`, `util-link`, `mega-dropdown` 덮어쓰기 영향을 크게 줄였음

### 3. 호텔 헤더 아이콘 렌더 방식 교체

- 신규 파일: `front/components/react/layout/HotelShellIcon.tsx`

기존

- 외부 `lucide` 전역 스크립트
- `data-lucide` 후처리

변경 후

- `lucide-react` SVG를 공용 헤더에서 직접 렌더

이걸로 랜덤하게 아이콘이 안 뜨는 문제를 공용 호텔 헤더 범위에서는 원천 차단함

참고

- 런타임의 `createIcons()` 재시도 로직은 그대로 남아 있음
- 메인 셸이나 다른 레거시 구간은 여전히 기존 방식과 공존

### 4. 텍스트 롤링 애니메이션 복구

- `front/apps/shell/src/runtime/layout/stagger.ts`
- 기존 `.nav-link` 만 보던 selector를 `.hotel-shell-nav-link, .nav-link` 로 확대
- `front/components/react/layout/header.css` 에 `stagger-*` 관련 namespaced 스타일 추가

### 5. 공용 헤더 기본 톤 통일

- `front/components/react/layout/header.css`
- `front/components/react/layout/mega-menu.css`

기본값을 다음처럼 조정

- 반투명 회색 계열 배경
- 어두운 텍스트/아이콘
- hover 시 주황 포인트
- scrolled 시 조금 더 진한 유리 질감

즉 `deals.html` 에서 원했던 톤을 페이지 전용이 아니라 공용 셸 쪽으로 올린 흐름

### 6. 데스크톱 컷오프 조정

- `front/components/react/layout/header.css`
- 모바일 전환 breakpoint 를 `1400px` 에서 `1180px` 로 내림

이유

- 1280 폭에서도 GNB가 사라져버리던 문제 보정

### 7. 메인 GNB 아이콘 호버 모션 추가

- `front/components/react/layout/header.css`
- 메인 네비 아이콘도 원본/클론 2장 구조로 전환
- 텍스트와 같은 타이밍으로 위아래 롤링되며 주황색으로 전환

## 수정된 주요 파일

- `front/components/react/layout/HotelHeaderTemplate.tsx`
- `front/components/react/layout/HotelMegaMenuItem.tsx`
- `front/components/react/layout/HotelShellIcon.tsx`
- `front/components/react/layout/header.css`
- `front/components/react/layout/mega-menu.css`
- `front/components/react/layout/index.ts`
- `front/apps/shell/src/runtime/layout/header.ts`
- `front/apps/shell/src/runtime/layout/megaMenu.ts`
- `front/apps/shell/src/runtime/layout/stagger.ts`

빌드 산출물 갱신

- `front/components/runtime/bootstrap.js`
- `front/components/runtime/shell-runtime.js`
- `front/components/runtime/index-DZyDx5ub.js`
- `front/components/runtime/TravelChecklistApp-DczKTQ3p.js`

## 오늘 확인한 결과

실제 정적 서버 기준 캡처 확인

- `deals.html` 1920 폭
- `deals.html` 1280 폭
- `jejustay_life.html` 1920 폭

확인된 것

- 공용 헤더 뼈대 복구
- GNB/유틸 정렬 복구
- 헤더 아이콘 다시 표시
- 1280 폭에서도 GNB 유지

## 검증

- `pnpm run check:shell` 통과
- `pnpm run build:shell` 통과
- `pnpm test` 통과

잔존 경고

- `build:shell` 의 `new URL("../../", import.meta.url)` 경고
- `build:cs` 의 500 kB chunk 경고

둘 다 기존부터 있던 경고고 이번 헤더 수습과 직접 관계는 없음

## 내일 이어서 볼 것

1. `jejustay_life.html` 메가드롭다운 hover 실제 디자인 재확인
2. 제주스테이 개별 페이지 CSS 중 남아 있는 header 관련 generic override 추가 정리
3. 필요하면 헤더 높이, 로고 크기, 유틸 간격 미세 조정
4. 로컬 톰캣이나 `jeju-web` 미러에서 볼 거면 마지막에 `pnpm run sync` 실행

## 메모

- 커밋은 아직 안 함
- `jejuair` 는 이번 작업 범위 아님
- 번역 체계 개편은 여전히 보류

## 2026-03-13 추가 확인

### 추가 정리

- `front/jejustay/pages/stay/jejustay_life.css`
- 공용 헤더와 충돌하던 옛 규칙 추가 제거
  - `.header`
  - `.header.scrolled`
  - generic stagger 관련 규칙
  - 예전 메가메뉴 전용 generic 규칙
  - `.login-btn` 잔재

즉 `jejustay_life.css` 가 공용 헤더를 다시 덮는 여지를 더 줄인 흐름

### 추가 검증

- `pnpm test` 재통과
- Playwright로 `jejustay_life.html` 첫 번째 GNB hover 캡처 확인

확인 결과

- 메가드롭다운 표시 정상
- 공용 헤더 아이콘 표시 정상
- 드롭다운 디자인이 공용 셸 기준으로 렌더되는 것 확인
