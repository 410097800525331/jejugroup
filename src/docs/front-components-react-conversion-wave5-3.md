# front/components React 전환 Wave 5.3

## 변경 목적
- `components/adapters/*` 스크립트가 `components/runtime/shell-runtime.js`를 정확히 로드하도록 상대 경로 정합성 복구
- 백업 폴더의 중복 저장 파일 제거

## 변경 파일
- `front/components/adapters/layout/component_loader.js`
- `front/components/adapters/layout/hotel_component_loader.js`
- `front/components/adapters/ui/fab.js`
- `front/components/adapters/ui/range_calendar.js`
- `front/components/adapters/ui/stagger_nav.js`
- `front/components/adapters/widget/chatbot.js`
- `front/components/adapters/widget/weather.js`
- `front/backup/README.md`
- `front/backup/legacy-components/layout/footer/main_footer.html` (중복 제거)

## 상세 변경
- 어댑터 런타임 URL을 `../../runtime/shell-runtime.js` 기준으로 통일
  - 기존 경로 일부는 `../runtime` 또는 `../../../runtime`로 계산되어 실제 경로 해석 실패 가능성 존재
- 백업 중복 해시 파일 제거 후 해시 중복 0건 상태 확인
- 백업 README 내 경로 안내를 실제 구조(`front/backup/...`)로 정정

## 검증
- `corepack pnpm --dir front/apps/shell check` 통과
- `corepack pnpm --dir front/apps/shell build` 통과
