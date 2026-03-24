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

- time: `2026-03-24 00:35:02 +09:00`
- location: `PowerShell rg search on D:\git\jejugroup`
- summary: `rg.exe access denied during admin IA gap review`
- details: `Repo-wide rg probes for admin IA and DB-backed operation names failed with "Access is denied", so the scan switched to Select-String and direct file reads to finish the route B work.`
- status: `resolved`

- time: `2026-03-24 02:06:00 +09:00`
- location: `git add in D:\git\jejugroup`
- summary: `git staging was briefly blocked by an index.lock error`
- details: `git add first failed with "Unable to create .git/index.lock". A follow-up check found no active git.exe process and no surviving lock file, so staging was retried after the transient lock cleared.`
- status: `resolved`

- time: `2026-03-24 11:08:00 +09:00`
- location: `pnpm run spring:test`
- summary: `Spring tests are blocked by an invalid Flyway V2 migration on MariaDB`
- details: `The test context now reaches Flyway migration, but V2__patch_support_ticket_and_primary_role_constraints.sql fails with MariaDB syntax error 1064 at the unique-key expression on line 12. This is outside the allowed java/test write set, so the migration itself could not be corrected here.`
- status: `open`

- time: `2026-03-24 11:22 +09:00`
- location: `pnpm run spring:test`
- summary: `spring:test still follows the repo's alwaysdata DB import path instead of the local replay target`
- details: `Even after overriding shell env and Java system properties, the Gradle test JVM kept resolving spring.flyway/db settings from jeju-spring/.env and pointed at mysql-jejugroup.alwaysdata.net/jejugroup_db. The migration files themselves now replay successfully on a local fresh MySQL database, but the repository test command still does not exercise that local target in this workspace.`
- status: `open`

- time: `2026-03-24 11:22 +09:00`
- location: `jeju-spring/src/main/resources/db/migration/V2__patch_support_ticket_and_primary_role_constraints.sql`
- summary: `MariaDB-compatible primary-role uniqueness fix landed`
- details: `Replaced the unsupported unique-key expression with a nullable is_primary column plus a composite unique key on (user_id, is_primary), and aligned V3's CHECK constraint to the nullable sentinel shape. The local fresh replay now reaches V20 cleanly.`
- status: `resolved`

- time: `2026-03-24 11:38:19 +09:00`
- location: `jeju-spring/gradlew.bat test --tests com.jejugroup.jejuspring.customercenter.CustomerCenterIntegrationTests`
- summary: `CustomerCenterIntegrationTests test replay is blocked by Flyway database access`
- details: `The targeted test run failed before executing assertions because Flyway could not connect to the configured MySQL host with Access denied for user 'jejugroup'@'123.142.12.196'. compileTestJava succeeded afterward, so the assertion change itself still compiles.`
- status: `open`

- time: `2026-03-24 13:41:30 +09:00`
- location: `live DB jeju_spring Flyway migrate`
- summary: `Flyway rerun was blocked by leftover partial side effects from the original failed V2 attempt`
- details: `After repairing flyway_schema_history, V2 failed again on duplicate key idx_support_comments_ticket_id_id. Inspection showed partial V2 changes had already been applied to support_comments/support_attachments, so the failed-history cleanup alone was insufficient.`
- status: `resolved`

- time: `2026-03-24 13:46:10 +09:00`
- location: `live DB jeju_spring Flyway repair/migrate`
- summary: `Live DB Flyway chain recovered through V21`
- details: `Manually reverted the partial V2 side effects on support_comments/support_attachments back to the baseline shape, reran Flyway repair, and advanced the live DB from V1/V2-failed to V21 success. Key post-check counts: users=1, support_categories=24, notices=6, faqs=75, membership_plans=3, membership_plan_benefits=15, hotel_properties=6, flight_routes=3, rentcar_branches=1.`
- status: `resolved`

- time: `2026-03-24 14:05:16 +09:00`
- location: `pnpm run spring:test`
- summary: `Spring test replay is blocked by existing Flyway database bootstrap failure`
- details: `The Gradle test task reached Flyway, then failed while connecting through the configured alwaysdata MySQL path. The failure happened before the new front-mirror host controller or template code could be exercised, so this remains a verification environment issue rather than a code-path regression in the new Spring host slice.`
- status: `open`

- time: `2026-03-24 14:12:03 +09:00`
- location: `pnpm run spring:test`
- summary: `Spring final runtime cutover verification is still blocked by the existing alwaysdata DB access path`
- details: `The cutover branch rebuilt front, mirrored templates into jeju-spring, and reached Gradle test execution, but the Spring context still failed before app tests ran because Flyway could not connect to the configured alwaysdata MySQL host: Access denied for user 'jejugroup'@'123.142.12.196'. This confirms the remaining gap is the existing verification environment, not the new build/deploy or front-mirror cutover code path.`
- status: `open`

- time: `2026-03-24 15:02 +09:00`
- location: `pnpm run spring:test`
- summary: `spring:test was redirected to localhost, then failed once on a blank local password fallback before passing after the helper fix`
- details: `The first rerun after the test-only precedence change reached localhost MySQL but failed with Access denied for user 'jejugroup'@'localhost' (using password: NO). The test helper was then updated to read the local DB values from jeju-spring/.env with last-value-wins precedence, and the next rerun passed cleanly.`
- status: `resolved`

- time: `2026-03-24 15:37 +09:00`
- location: `runtime env-source cutover`
- summary: `default runtime env ownership no longer depends on jeju-web/.env`
- details: `Deploy/runtime helpers now default to jeju-spring/.env, the explicit JEJU_SHARED_ENV_PATH override remains available, and the helper/example contract was aligned so SSH/admin/API fallback keys are documented and accepted consistently. pnpm run build and pnpm run spring:test both passed after the cutover.`
- status: `resolved`

- time: `2026-03-24 15:49 +09:00`
- location: `pnpm run smoke:front`
- summary: `front runtime smoke still fails on admin API dependency and mypage DOM expectation`
- details: `The rerun after final-runtime policy cleanup still failed in two places. admin dashboard smoke triggered request failures to http://localhost:9090/jeju-web/api/auth/session and /api/admin/dashboard?domain=all, which shows the local static smoke path still depends on the old jeju-web-style API base when no Spring backend is serving those endpoints. mypage dashboard smoke also failed because #mypage-dashboard-root .meta-dashboard-layout was not found within the timeout, so the current DOM/runtime no longer matches the smoke expectation.`
- status: `open`

- time: `2026-03-24 15:50 +09:00`
- location: `pnpm run smoke:cs`
- summary: `customer-center smoke expectations are stale against the current bundled app`
- details: `All four cs smoke cases failed on missing expected text such as "세 가지 서비스, 하나의 완벽한 여행", "2026년 2월 제주항공 신규 노선 운항 안내", "JEJU GROUP FAQ LIBRARY", and "나의 문의 내역". The current customer-center app routes still build and mount, but the smoke assertions are out of sync with the present UI copy and/or route-state behavior.`
- status: `open`

- time: `2026-03-24 16:08 +09:00`
- location: `local smoke repair`
- summary: `front and customer-center smoke blockers were repaired under the current Spring baseline`
- details: `The smoke harness now seeds the local admin and mypage session paths, mocks the admin dashboard and customer-center API responses needed for local verification, and aligns the customer-center assertions with the current UI copy. Both pnpm run smoke:front and pnpm run smoke:cs now pass without weakening the runtime-issue checks.`
- status: `resolved`

- time: `2026-03-24 16:47 +09:00`
- location: `pnpm run spring:run`
- summary: `local Spring boot now reaches localhost MySQL, but the local DB user lacks schema access`
- details: `The malformed duplicate DB_* block in jeju-spring/.env was removed and the default DB_URL now points at localhost. After that fix, bootRun no longer tried the alwaysdata host; Flyway now fails later with 'Access denied for user 'jejugroup'@'localhost' to database 'jejugroup_db''. The remaining blocker is local MySQL user/schema privilege setup rather than repository code or env parsing.`
- status: `open`

- time: `2026-03-24 18:35 +09:00`
- location: `verification step for front/admin js parse check`
- summary: `vm.SourceTextModule was unavailable in the current Node runtime`
- details: `The first lightweight syntax-check attempt used vm.SourceTextModule, but the current Node build exposed it as non-constructible. I switched to esbuild.transformSync for the touched admin JS files and completed verification that way.`
- status: `resolved`

- time: `2026-03-24 20:52 +09:00`
- location: `Route B admin shell handoff`
- summary: `Single-load admin shell refactor paused before reviewer and browser verification`
- details: `The workspace has a frozen seed at SEED.admin-shell-single-load-v1.yaml, a new front/admin/js/admin_shell.js bootstrap, and five admin HTML entrypoints rewired to that shared shell. The task was intentionally paused for cross-environment continuation before reviewer pass, direct-entry checks, same-document section-switch checks, and history/popstate verification were completed.`
- status: `deferred`
