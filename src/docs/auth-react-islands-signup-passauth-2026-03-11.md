# Auth Island 전환 기록 2026-03-11

## 범위
- `front/pages/auth/signup.html`
- `front/pages/auth/pass_auth.html`
- `front/components/react/auth/*`
- `front/apps/shell/src/runtime/pages/signup.tsx`
- `front/apps/shell/src/runtime/pages/passAuth.tsx`

## 이번 전환 내용
- `signup.html`
  - 약관 동의 4단계 UI를 React island로 이관
  - PASS 팝업 호출, PASS 성공 수신, 아이디 중복 확인, 비밀번호 강도 표시, 가입 완료 화면을 React 상태 기반으로 재구성
  - 정적 HTML은 셸만 남기고 `bootstrap.js` 자동 mount 구조로 정리
  - 기존 `signup.js`, `pages/auth/js/signup_*` 레거시 모듈 제거
- `pass_auth.html`
  - 통신사 선택, 인증 방식 선택, 이름 입력, 주민번호 앞자리와 성별 숫자 입력, 휴대폰 번호 입력, 보안문자, 인증 대기 화면을 React island로 이관
  - 인라인 script 제거
  - reCAPTCHA site key 조회와 verify 요청은 유지하되 화면 상태 전이는 React reducer로 이동
- `auth` 공통 상태
  - `AuthProvider` + reducer + action context 도입
  - `login`, `signup`, `pass_auth`가 입력값, 진행 단계, 에러 메시지, 인증 상태를 공통 규약으로 사용
  - 공통 입력 필드와 step header를 재사용 컴포넌트로 분리
- `shell runtime`
  - `jeju-signup-app`, `jeju-pass-auth-app` 자동 감지 후 mount 연결
  - runtime bootstrap 산출물 갱신 대상에 auth 신규 island 포함
  - auth 와 mypage shell host mount 를 runtime 내부 `pageShell` 모듈로 승격
  - `dashboard_shell.js` 는 호환용 얇은 wrapper 로 축소
  - air shell 은 runtime 어댑터로 분리 시작
  - air footer 는 `footer.js` 의존 제거 완료
  - air header 는 runtime 구현으로 교체 완료하고 auth, mypage air shell 경로에서 `header.js` 의존 제거

## 남은 브리지
- PASS 성공 전달
  - `pass_auth.html` 팝업이 opener로 `postMessage` 전달하는 브리지 유지 상태
- 소셜 가입
  - Kakao, Naver SDK는 외부 스크립트 의존성과 팝업 흐름 때문에 브리지성 연동 유지 상태
- air shell legacy
  - auth 와 mypage air shell 경로에서는 `header.js`, `footer.js` 의존 제거 완료
  - 제주에어 본 페이지들은 여전히 `front/jejuair` 내부 스크립트 구조 사용 중
- reCAPTCHA
  - widget render와 reset은 Google 스크립트 API 호출이 필요해서 imperative bridge 유지 상태

## 다음 제거 대상
1. Kakao, Naver quick join을 reducer 액션 기반 후처리로 정리하고 성공 화면과 실제 가입 플로우 분리
2. reCAPTCHA render 상태를 전용 adapter로 감싸서 page component에서 직접 다루는 DOM ref 축소
3. 제주에어 본 페이지들까지 runtime header, footer 구현으로 교체 가능한지 parity 확인 후 확장

## 검증 기준
```bash
corepack pnpm --dir front/apps/shell check
corepack pnpm --dir front/apps/shell build
node scripts/guards/check-text-integrity.js --all
corepack pnpm dlx @playwright/test test scripts/smoke/cs-customer-center.smoke.spec.cjs scripts/smoke/front-entrypoints.smoke.spec.cjs --reporter=list
```
