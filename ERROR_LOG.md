# ERROR LOG

- time: `2026-03-23 16:50:06 +09:00`
- location: `front/apps/cs/client/src/test/InquiryForm.test.tsx`
- summary: `pnpm run check:cs is blocked by a pre-existing TypeScript syntax error outside the approved write set`
- details: `tsc reports TS1002 unterminated string literal at line 111 and TS1005 comma expected at line 112. The implementation files for the CS inquiries detail flow build successfully, but the repository-wide cs check cannot finish without touching the test file.`
- status: `open`

- time: `2026-03-23 18:30 +09:00`
- location: `pnpm -C front/apps/cs check`
- summary: `inquiries slice implementation blockers resolved`
- details: `후속 수정으로 serviceCenterApi/AuthContext/InquiryForm/test blockers를 정리했고, `pnpm -C front/apps/cs check`, `pnpm -C front/apps/cs test`, `pnpm -C front/apps/cs build`가 모두 통과했다.`
- status: `resolved`

- time: `2026-03-23 17:15:16 +09:00`
- location: `pnpm -C front/apps/cs check`
- summary: `cs typecheck is blocked by existing errors outside the approved write set`
- details: `tsc still fails in front/apps/cs/App.tsx, front/apps/cs/components/serviceCenter/NoticeList.tsx, front/apps/cs/pages/FAQs.tsx, and front/apps/cs/pages/Notices.tsx. The new serviceCenterApi/AuthContext changes passed targeted vitest runs.`
- status: `open`

- time: `2026-03-23 22:27:42 +09:00`
- location: `jeju-spring/gradlew.bat compileTestJava`
- summary: `test compilation verification blocked by missing Gradle wrapper jar`
- details: `jeju-spring/gradle/wrapper/gradle-wrapper.jar is absent in the workspace, so the wrapper cannot launch. No installed gradle executable was available either, so compile-time verification for the modified customer-center integration test could not be completed here.`
- status: `open`

- time: `2026-03-23 22:30:53 +09:00`
- location: `pnpm run spring:test / pnpm run spring:war-package`
- summary: `customer-center seed slice mechanical Spring verification is blocked by the same missing Gradle wrapper jar`
- details: `Both package scripts rebuilt front/apps/shell successfully and then failed before Spring execution because jeju-spring/gradle/wrapper/gradle-wrapper.jar is missing. The customer-center phase1 seed itself was still applied to the local DB manually from V14, and counts now read support_categories=24, notices=6, faqs=75.`
- status: `open`

- time: `2026-03-23 22:47:40 +09:00`
- location: `PowerShell rg search on D:\git\jejugroup`
- summary: `rg.exe access denied during schema review`
- details: `Initial repo-wide rg searches failed with "Access is denied", so the review switched to Select-String and direct file reads for the SQL inspection.`
- status: `resolved`
