# Front Route SSOT Rebind

## 변경 목적

- `front` 내부의 레거시 링크가 React 전환 이후 실제 파일 구조와 어긋나는 문제 정리
- `front/core/constants/routes.js` 기준의 SSOT 라우팅으로 제주항공 레거시 페이지 링크를 통일
- 백업 레거시 파일의 깨진 상대 경로와 런타임 어댑터 경로 복구

## 적용 내용

- `front/jejuair` 정적 페이지와 레거시 스크립트의 내부 링크를 `data-route` 기반으로 전환
- `front/jejuair/js/header.js`에 라우트 브리지와 라우터 바인더 초기화 추가
- `front/apps/shell/src/runtime/pages/airHeader.ts`, `airFooter.ts`를 SSOT 라우팅 기준으로 재정비 후 런타임 재빌드
- `front/backup` 내부의 깨진 동적 import 및 런타임 참조 경로 복구

## 검증

- `front/scripts/scan_hardcoded_routes.js`
- `front/apps/shell/node_modules/.bin/tsc.cmd --noEmit`
- `front/apps/shell` 런타임 빌드
