# 메인 웹페이지 Vite 개발 서버

## 목적

- `front/index.html` 기준 메인 웹페이지를 정적 서버 대신 `Vite` 개발 서버로 바로 확인하기 위한 실행 경로 추가
- 메인 랜딩과 고객센터를 같은 origin 개발 서버에서 확인할 수 있게 통합
- 하이브리드 구조는 유지하고, 기존 `front/components/runtime/*` 산출물도 그대로 사용

## 실행 경로

```bash
pnpm run dev:front
```

- 기본 주소: `http://127.0.0.1:3001`
- 루트: `front`
- 대상: `front` 개발 대상 전체
- 포트를 바꾸려면 `FRONT_VITE_PORT` 환경 변수를 사용

## 비고

- 이 서버는 `front/index.html` 을 직접 서빙
- 고객센터 경로 `/pages/cs/customer_center.html` 는 같은 `Vite` 서버 안에서 middleware mode 로 제공
- `front/components/runtime/bootstrap.js` 는 개발 중에 셸 bootstrap 소스를 직접 연결
- `front/components/runtime/shell-runtime.js` 는 개발 중에 셸 소스를 같은 서버에서 직접 연결
- 셸 런타임 소스 수정은 통합 `Vite` 서버에서 바로 반영
- `front/apps/shell/src/runtime/bootstrap.js` 를 바꾸면 통합 개발 서버에서 바로 확인 가능
- 고객센터만 따로 보고 싶으면 기존 `pnpm run dev:cs` 도 계속 사용 가능
