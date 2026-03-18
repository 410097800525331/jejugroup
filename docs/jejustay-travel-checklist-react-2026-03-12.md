# JEJUSTAY Travel Checklist React Renewal

## 변경 내용

- `front/jejustay/pages/travel/travel_checklist.html` 본문을 React island 마운트 구조로 교체
- `front/components/react/travel/TravelChecklistApp.tsx` 추가
- 체크리스트 데이터와 섹션 컴포넌트 분리
- 전용 스타일시트 `travel_checklist.css` 추가
- shell runtime bootstrap 에 checklist island 감지 및 마운트 추가

## 유지한 것

- `hotel-header-placeholder`
- `hotel-footer-placeholder`
- `components/runtime/bootstrap.js` 기반 공용 shell 주입

## 검증

- `pnpm test`
- `pnpm run test:smoke`
- 필요 시 `pnpm run build`
