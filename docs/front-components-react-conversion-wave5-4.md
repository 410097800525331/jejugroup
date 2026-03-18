# front/components React 전환 Wave 5.4

## 목적
- React 브리지 어댑터(`front/components/adapters/*`) 백업 누락분 보강

## 변경 내용
- `front/components/adapters` 트리를 유지한 채 아래 경로로 백업 복사
  - `front/backup/legacy-components/adapters/layout/*`
  - `front/backup/legacy-components/adapters/ui/*`
  - `front/backup/legacy-components/adapters/widget/*`
- 백업 README에 어댑터 백업 경로 명시 추가

## 중복 점검
- `front/backup` 전체 SHA256 기준 중복 파일 0건 확인
