# Mypage Dashboard Legacy

## 정리 이유
- `front/pages/mypage/dashboard.html` 본문은 React island로 이미 전환 완료
- 아래 파일들은 React 전환 이전 레거시 대시보드 구현이어서 active 경로에서 퇴역 처리

## 포함 파일
- `dashboard.js`
- `dashboard_data.js`
- `dashboard_formatters.js`
- `dashboard_markup.js`
- `dashboard_shell.js`

## 구분 기준
- `legacy-pages/mypage` 같은 넓은 이름이 아니라
- `reactified/mypage-dashboard-legacy` 아래로 분리해서
- React 전환으로 밀려난 퇴역 파일 묶음이라는 의미를 바로 알 수 있게 정리
