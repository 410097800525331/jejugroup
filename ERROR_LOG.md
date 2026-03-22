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

- time: `2026-03-23 14:24 +09:00`
- location: `jeju-spring/mvnw package verification`
- summary: `패키징 검증이 현재 환경의 JDK 미설치로 차단됨`
- details: `./mvnw -q -DskipTests package 는 JAVA_HOME 이 올바르지 않다는 오류로 중단됐고, node scripts/spring/run-jeju-spring-maven.cjs -q -DskipTests package 는 PATH/JAVA_HOME 에서 java 를 찾지 못해 JDK 21+ 설치 요구 메시지로 종료됐다. 코드 변경은 JDK 21 기준으로 맞췄지만, 실제 패키징은 이 환경에서 수행할 수 없었다.`
- status: `open`

- time: `2026-03-23 15:46 +09:00`
- location: `jeju-spring/mvnw package verification`
- summary: `JDK 21 설치 후 패키징 차단 해소`
- details: `Temurin JDK 21 과 Tomcat 10.1.52 를 로컬에 설치한 뒤 pnpm run spring:war-package 를 다시 실행했고, 라우트 변경으로 깨진 JejuSpringApplicationTests 1건을 현재 계약에 맞게 수정한 후 BUILD SUCCESS 를 확인했다. 산출물 jeju-spring-0.0.1-SNAPSHOT.war 와 ROOT.war 를 확보했고, 로컬 Tomcat webapps/ROOT.war 배치 후 http://127.0.0.1:8080/ 응답도 확인했다.`
- status: `resolved`

- time: `2026-03-23 18:00 +09:00`
- location: `pnpm -C front/apps/shell check`
- summary: `front shell 타입 검증이 호텔/마이페이지 컴포넌트 오류로 중단됨`
- details: `재현 결과 HotelFilterSidebar.tsx:213 에서 StickyOverlayMode 가 string 으로 넓어지고, mypage/data.ts:223 에서 buildItineraryFromTravelEvents const 함수식이 초기 fallback export 보다 늦게 선언되어 shell typecheck 가 즉시 중단됐다.`
- status: `open`

- time: `2026-03-23 18:01 +09:00`
- location: `pnpm -C front/apps/cs check && pnpm -C front/apps/cs test`
- summary: `front/apps/cs 테스트 도구 해석 실패로 타입체크와 테스트 실행이 차단됨`
- details: `package.json 과 lockfile 에는 vitest/@testing-library/react 가 잡혀 있지만 현재 front/apps/cs/node_modules 링크에는 vitest 가 없어서 test 스크립트가 바로 종료됐고, tsc 도 테스트 파일에서 해당 모듈 해석 실패를 냈다. setup.ts 에는 query 암시적 any 도 함께 남아 있다.`
- status: `open`

- time: `2026-03-23 18:05 +09:00`
- location: `pnpm -C front/apps/shell check`
- summary: `mypage 선언 순서 수정 후에도 shell check 가 hotel 타입 오류로 중단됨`
- details: `front/components/react/mypage/data.ts 의 buildItineraryFromTravelEvents hoist 문제는 정리했지만, 전체 check 는 front/components/react/hotel/HotelFilterSidebar.tsx:213 의 기존 StickyOverlayMode 타입 불일치에서 계속 멈췄다.`
- status: `open`

- time: `2026-03-23 18:18 +09:00`
- location: `front/components/react/hotel/HotelFilterSidebar.tsx, front/components/react/mypage/data.ts, front/apps/cs/pnpm-lock.yaml`
- summary: `front 컴포넌트/테스트 오류 복구 완료`
- details: `HotelFilterSidebar 에서는 nextState.mode 를 StickyOverlayMode 로 고정해 shell typecheck 를 복구했고, mypage/data.ts 에서는 buildItineraryFromTravelEvents 를 fallback export 보다 앞에 올려 use-before-declaration 을 제거했다. front/apps/cs 는 source 설정 변경 없이 pnpm install --dir front/apps/cs --ignore-workspace 후 lockfile 을 현재 package.json 범위에 맞게 재해석해 vitest/@testing-library/react 링크를 정상화했고, pnpm -C front/apps/shell check, pnpm -C front/apps/cs check, pnpm -C front/apps/cs test 를 모두 통과했다. 이 엔트리는 2026-03-23 18:00, 18:01, 18:05 에 기록한 open failure 들의 해소를 의미한다.`
- status: `resolved`

