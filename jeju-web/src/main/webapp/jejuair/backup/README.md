# JEJUAIR Backup

## 직접 수정 파일
- 없음

이번 runtime shell 분리 작업에서 `front/jejuair/**` 내부 파일은 직접 수정하지 않았음

## runtime shell 교체 시 참조한 파일
- `front/jejuair/js/header.js`
- `front/jejuair/js/footer.js`
- `front/jejuair/css/header.css`
- `front/jejuair/css/footer.css`
- `front/jejuair/assets/img/logo.png`
- `front/jejuair/assets/img/ico-search.png`
- `front/jejuair/assets/img/ico-my-page.png`

## 왜 지금 안 옮겼는지
- 제주에어 본 페이지들은 아직 위 레거시 파일 경로를 직접 사용 중
- 지금 여기서 파일을 옮기면 `front/jejuair/pages/**` 페이지가 바로 깨짐
- 그래서 backup 폴더만 먼저 만들고, 실제 이동은 제주에어 본 페이지 parity 전환 이후에 하는 게 맞음
