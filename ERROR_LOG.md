# ERROR LOG

Append-only log for installer, execution, tool, and verification errors.
Add new entries with timestamp, location, summary, and details.
Do not rewrite existing entries; append only.

- time: `2026-03-22 06:40 +09:00`
- location: `front/components/react/hotel/HotelFilterSidebar.tsx:213`
- summary: `front/apps/shell 타입체크 실패로 전체 검증 일부가 차단된 상태`
- details: `이번 localhost 테스트 로그인 변경 후 pnpm run check:shell 을 다시 실행했지만 기존 StickyOverlayMode 타입 불일치가 그대로 남아 full type verification 을 끝까지 통과시키지 못한 상태`
- status: `open`
- time: `2026-03-22 20:10 +09:00`
- location: `PowerShell search command during mypage style inspection`
- summary: `rg.exe 접근 거부로 리포지토리 검색을 PowerShell 기본 명령으로 우회`
- details: `rg.exe 를 사용한 전체 검색이 Access is denied 로 실패해서 Select-String 으로 전환했다. 변경 작업 자체는 진행 가능했지만 초기 탐색이 한 번 끊겼다.`
- status: `open`
- time: `2026-03-22 20:18 +09:00`
- location: `STATE.md route reclassification`
- summary: `현재 요청 기준으로 mypage view slice task 를 재분류`
- details: `초기 STATE.md 가 다른 mypage slice 를 가리키고 있어서 요청한 three-file view slice 기준으로 task, scope, and write ownership 를 다시 맞췄다.`
- status: `open`
- time: `2026-03-22 20:23 +09:00`
- location: `pnpm -C front/apps/shell check`
- summary: `전체 shell typecheck 는 기존 hotel 타입 오류로 중단`
- details: `이번 마이페이지 변경으로 생긴 lucide 선언 충돌은 해소됐지만, shell 체크는 front/components/react/hotel/HotelFilterSidebar.tsx 의 기존 StickyOverlayMode 타입 불일치에서 멈췄다.`
- status: `open`

- time: `2026-03-22 21:51 +09:00`
- location: `front/components/react/mypage/data.ts`
- summary: `마이페이지 세션 hydration 변경이 랜딩 bootstrap 을 중단시키는 ReferenceError 를 유발`
- details: `PROFILE/STATS/BOOKINGS 초기화가 cloneProfile/cloneStats/cloneBookings const 함수식보다 먼저 실행되면서 Cannot access before initialization 예외가 발생했고, 그 결과 bootstrap 모듈 import 가 중단되어 랜딩 헤더와 route-link 동작이 전부 비활성화됐다. clone helper 를 함수 선언으로 바꿔 해결했고 guard:text, build:front, headless DOM 검증으로 복구를 확인했다.`
- status: `resolved`

