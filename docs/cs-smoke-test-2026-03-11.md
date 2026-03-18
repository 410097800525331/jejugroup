# CS 페이지 스모크 테스트 기록

## 대상

- `front/pages/cs/customer_center.html`
- `front/pages/cs/assets/customer_center.css`
- `front/pages/cs/assets/customer_center.js`
- `jeju-web/src/main/webapp/pages/cs/customer_center.html`
- `jeju-web/src/main/webapp/pages/cs/assets/customer_center.css`
- `jeju-web/src/main/webapp/pages/cs/assets/customer_center.js`

## 수정 사항

- `front/apps/cs/vite.config.ts`
  - `@front-fab` alias를 실제 FAB 컴포넌트 위치인 `front/components/react/ui/FAB`로 수정
  - Vite dev server `fs.allow` 경로도 동일하게 정렬
- `front/apps/cs` 빌드 재실행 후 고객센터 정적 산출물 갱신
- `jeju-web/src/main/webapp/pages/cs`에 동일 산출물 동기화

## 점검 체크리스트

1. 고객센터 홈 진입 가능 여부
2. 홈 화면 주요 한글 문구 렌더 여부
3. 공지사항 라우트 이동 여부
4. FAQ 라우트 이동 여부
5. 검색 입력 동작 여부
6. FAQ 펼침 동작 여부
7. 브라우저 `console.error` 발생 여부
8. `pageerror` 발생 여부
9. 정적 자산 `requestfailed` 발생 여부

## 실행 명령

```bash
corepack pnpm --dir front/apps/cs check
corepack pnpm --dir front/apps/cs build
corepack pnpm dlx @playwright/test test scripts/smoke/cs-customer-center.smoke.spec.cjs --reporter=list
```

## 결과

- `check` 통과
- `build` 통과
- Playwright 스모크 3건 통과
  - 홈 라우트 스모크 체크
  - 공지 라우트 스모크 체크
  - FAQ 라우트 스모크 체크
- 브라우저 `console.error` 없음
- 브라우저 `pageerror` 없음
- 정적 자산 `requestfailed` 없음

## 비고

- 루트 `corepack pnpm run lint` 실행 시 `Missing script: lint`
- 루트 `corepack pnpm test` 실행 시 기존 스크립트가 `Error: no test specified`로 종료
- 고객센터 페이지 산출물 기준으로 `front/pages/cs`와 `jeju-web/src/main/webapp/pages/cs` 해시 일치 확인
