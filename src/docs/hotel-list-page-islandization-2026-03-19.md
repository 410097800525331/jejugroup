# hotel-list page islandization 메모

## 목적

- `hotel-list` 페이지를 정적 반복 마크업에서 React 컴포넌트 기반 구조로 전환
- `hotel-card-premium`부터 먼저 분리하고, 그 다음 리스트 + 사이드바 전체를 island로 묶음
- 마지막으로 Spring Boot/Thymeleaf 쪽도 같은 데이터 구조를 `page` + `pageJson` 으로 제공하게 연결

## 프런트 반영

- `front/components/react/hotel/HotelCardPremium.tsx`
  - 호텔 카드 단일 컴포넌트 분리
- `front/components/react/hotel/HotelFilterSection.tsx`
- `front/components/react/hotel/HotelFilterSidebar.tsx`
- `front/components/react/hotel/HotelResultList.tsx`
- `front/components/react/hotel/HotelListPageIsland.tsx`
  - 리스트와 사이드바 island 조립
- `front/components/react/hotel/hotelListPageData.ts`
  - 지역별 mock 데이터 / DOM JSON 파싱 / fallback 데이터 빌더
- `front/apps/shell/src/runtime/pages/hotelListPage.tsx`
- `front/apps/shell/src/runtime/index.ts`
- `front/apps/shell/src/runtime/bootstrap.js`
  - `hotel-list-page-root` 감지 후 island 마운트 추가
- `front/jejustay/pages/hotel/hotel-list.html`
  - 정적 사이드바/카드 반복 제거
  - `hotel-list-page-root` root 호스트로 교체

## 백엔드 반영

- `jeju-spring/src/main/java/com/jejugroup/jejuspring/stay/application/StayHotelListQuery.java`
- `jeju-spring/src/main/java/com/jejugroup/jejuspring/stay/view/StayHotelListFilterOptionView.java`
- `jeju-spring/src/main/java/com/jejugroup/jejuspring/stay/view/StayHotelListFilterSectionView.java`
- `jeju-spring/src/main/java/com/jejugroup/jejuspring/stay/view/StayHotelListSearchSummaryView.java`
- `jeju-spring/src/main/java/com/jejugroup/jejuspring/stay/view/StayHotelListPageView.java`
- `jeju-spring/src/main/java/com/jejugroup/jejuspring/stay/application/StayHotelListFactory.java`
- `jeju-spring/src/main/java/com/jejugroup/jejuspring/stay/web/StayController.java`
  - region / keyword / checkIn / checkOut / adults / children / rooms 쿼리를 받아 페이지 데이터 생성
  - `pageJson` 직렬화 추가
- `scripts/spring/sync-front-assets-to-spring.cjs`
  - Gradle 기반 `spring:test` / `spring:run` / `spring:package` 전에 shell runtime 빌드를 먼저 보장
- `scripts/spring/run-jeju-spring-gradle.cjs`
  - `spring:test` / `spring:run` / `spring:package` 를 Gradle wrapper로 실행
- `jeju-spring/build.gradle`
  - Gradle `processResources` 단계에서 아래 자산을 `build/resources/main/static`으로 복사
  - `front/.generated/webapp-overlay/components/runtime/**`
  - `front/jejustay/**`
  - `front/components/react/layout/*.css`
  - `front/components/react/ui/reservationDrawer/drawer.css`
- `jeju-spring/src/main/resources/templates/stay/hotel-list.html`
  - 검색 요약, 필터 섹션, 호텔 카드 목록을 새 `page` 구조로 루프 렌더
  - `hotel-list-page-data` JSON 스크립트 추가
  - `hotel-header-placeholder`, `hotel-footer-placeholder` 추가
  - fallback 서버 렌더를 유지한 채 `hotel-list-search-widget-root`, `hotel-list-page-root`에 island를 덮어쓰는 구조로 변경
  - Spring도 `/components/runtime/bootstrap.js`로 공용 bootstrap 사용

## 검증

- `pnpm run check:shell`
- `pnpm run build:shell`
- `pnpm run spring:test`
