# Hybrid Front Plan

## 현재 상태

- `front` 단일 수정 원본 기준은 유지 중
- 기본 배포/런타임 기준은 `jeju-spring final runtime baseline` 으로 정리 중
- `jejuair` 는 비전환 고정 구조로 운영
- `cs` 는 독립 React 앱으로 분리
- `stay`, `auth`, `mypage`, 메인 랜딩은 shell + island 하이브리드 구조로 정리 중

## 이번 라운드 완료

- 하이브리드 운영 기준 문서 재정의
- 엔트리포인트 인벤토리 문서 추가
- 실행 체크리스트 문서 추가
- backup 폴더 제거
- backup 의존 문서 및 개발 서버 규칙 정리
- `pass_auth.html` 경로를 SSOT route 에 연결
- route 스캔 스크립트에 HTML 엔트리포인트 누락 검사 추가

## 다음으로 해야 할 것

1. `front -> jeju-spring` 미러와 `front/.generated`, `components/runtime` 경계를 더 명확하게 문서와 스크립트에 고정하고 `jeju-web` 은 레거시 미러로만 남긴다
2. 현재 dirty worktree 를 기능 단위로 다시 잘라 커밋 범위를 정리
3. smoke 대상 엔트리 범위를 하이브리드 구조 기준으로 재점검
4. 하이브리드 페이지별 수정 위치와 소유 경로를 팀 규칙으로 더 짧게 정리

## 완료 판정 기준

- 활성 엔트리포인트가 전부 SSOT route 에 등록되어 있음
- backup 경로가 더 이상 활성 repo layout 에 없음
- 운영 문서가 전면 React 전환이 아니라 하이브리드 구조를 설명함
- 신규 페이지 추가 시 정적, 하이브리드, 독립 앱 중 하나로 즉시 분류 가능함
