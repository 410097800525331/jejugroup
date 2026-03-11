# 한글/인코딩 가드레일

## 저장 규칙

- 저장 인코딩은 무조건 UTF-8
- 줄바꿈은 무조건 LF
- 저장 규칙의 기준 파일은 루트 `.editorconfig`
- 에디터가 EditorConfig를 지원하면 반드시 활성화
- 안티그래비티를 쓰더라도 UTF-8/LF 기준은 동일

## 커밋 전 차단

- 로컬 Git 훅은 `.githooks/pre-commit`
- 훅은 아래 두 가지를 강제
  - 모지바케/깨진 HTML 태그 검사
  - `front -> jeju-web/src/main/webapp` 미러 일치 검사
- 훅 설치는 아래 명령으로 고정

```bash
corepack pnpm run setup:hooks
```

## CI 차단

- GitHub Actions `Guardrails` 워크플로우가 PR마다 실행
- 전체 텍스트 무결성 검사
- 변경 파일 기준 `front` 단일 원본 검사
- 대표 페이지 Playwright 스모크 검사
  - 고객센터
  - 메인 랜딩
  - 로그인
  - JEJU STAY 호텔 랜딩

## 단일 원본 원칙

- 사람이 직접 수정하는 원본은 `front`만 사용
- `jeju-web/src/main/webapp`는 배포 미러로 취급
- `jeju-web/src/main/webapp`를 직접 수정하면 pre-commit에서 차단
- `front` 수정 후에는 반드시 `pnpm run sync` 또는 빌드 파이프라인으로 미러 반영

## 수동 편집 금지 구역

- `front/pages/**/assets/*.js`
- `front/pages/**/assets/*.css`
- `jeju-web/src/main/webapp/**/assets/*.js`
- `jeju-web/src/main/webapp/**/assets/*.css`

빌드 산출물은 원본이 아니라 결과물 상태

