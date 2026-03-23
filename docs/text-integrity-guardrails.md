# 한글/인코딩 가드레일

## 저장 규칙

- 저장 인코딩은 무조건 UTF-8
- 줄바꿈은 무조건 LF
- 저장 규칙의 기준 파일은 루트 `.editorconfig`
- 에디터가 EditorConfig를 지원하면 반드시 활성화
- 안티그래비티를 쓰더라도 UTF-8/LF 기준은 동일
- 배포·가드레일·운영 유틸 스크립트와 이 문서는 Windows 직접 확인 편의를 위해 UTF-8 BOM 허용
- Windows PowerShell 5에서 BOM 없는 UTF-8 파일을 직접 확인할 때는 `Get-Content -Encoding utf8` 사용
- Windows 배포 빌드는 `javac`, `jar` 로그를 UTF-8 기준으로 고정

## 커밋 전 차단

- 로컬 Git 훅은 `.githooks/pre-commit`
- 현재 훅은 모지바케/깨진 HTML 태그 검사만 강제
- 기존 `front -> jeju-web/src/main/webapp` 미러 일치 검사는 기본 pre-commit 경로에서 제거했다
- `jeju-web`은 레거시 배포 미러로만 남겨두고, 현재 작업 흐름은 `front -> jeju-spring` 기준으로 옮긴다
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
- `jeju-web/src/main/webapp`는 레거시 배포 미러로 취급
- `jeju-web/src/main/webapp`를 직접 원본처럼 수정하지 않는다
- 현재 기본 반영 대상은 `jeju-spring`이며, `front` 수정 후에는 필요한 경우 spring 미러 스크립트나 spring 빌드 파이프라인으로 반영한다

## 수동 편집 금지 구역

- `front/pages/**/assets/*.js`
- `front/pages/**/assets/*.css`
- `jeju-web/src/main/webapp/**/assets/*.js`
- `jeju-web/src/main/webapp/**/assets/*.css`

빌드 산출물은 원본이 아니라 결과물 상태
