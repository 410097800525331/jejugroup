# STATE

## Current Task

- task: `Fix mypage support card icons so customer-support images load correctly on the local Spring runtime`
- phase: `completed`
- scope: `STATE.md, MULTI_AGENT_LOG.md, SEED.mypage-support-icon-path-fix-v1.yaml, front/components/react/mypage/SupportSection.tsx, derived front/.generated/webapp-overlay/** where the shell build regenerates mypage runtime, derived jeju-spring/src/main/resources/static/front-mirror/** and templates/front-mirror/** where the sync/build pipeline regenerates affected mypage assets, and derived jeju-spring/build/resources/main/** where the running local Spring process needs refreshed mypage assets`
- verification_target: `On local Spring http://localhost:8080/pages/mypage/dashboard.html, the customer-support card icons must request an existing asset path and render instead of showing broken-image placeholders`

## Route

- route: `Route B`
- reason: `the source fix lives in front React mypage code but the reported bug reproduces on local Spring host-only runtime, so the task crosses front source plus regenerated jeju-spring derived assets and requires planner-only Route B with worker/reviewer delegation`

## Writer Slot

- owner: `main (planner-only)`
- write_sets:
  - `main`: `STATE.md, MULTI_AGENT_LOG.md`
  - `worker_seed_mypage_support`: `SEED.mypage-support-icon-path-fix-v1.yaml`
  - `worker_feature_mypage_support`: `front/components/react/mypage/SupportSection.tsx`
  - `worker_spring_mypage_mirror`: `derived front/.generated/webapp-overlay/** where the shell build regenerates mypage runtime, derived jeju-spring/src/main/resources/static/front-mirror/**, derived jeju-spring/src/main/resources/templates/front-mirror/** only where scripts/spring/sync-front-assets-to-spring.cjs and related build steps regenerate affected mypage assets`
  - `worker_spring_mypage_build_resources`: `derived jeju-spring/build/resources/main/** only where processResources or equivalent resource sync regenerates affected mypage assets for the running local Spring process`
  - `worker_error_log`: `ERROR_LOG.md`
  - `reviewer_mypage_support_icons`: `review only`
- note: `the front mypage source fix and the spring-derived asset refresh stay split into disjoint ownership so main remains planner-only while both persisted and currently served mypage assets can be verified`

## Contract Freeze

- contract_freeze: `Adjust only the mypage support icon asset path contract so the rendered support-card images resolve to an existing asset path on both front and local Spring host-only runtime. Keep front as source of truth, avoid unrelated mypage layout/copy changes, regenerate only the mypage-derived runtime/mirror artifacts needed for jeju-spring, refresh build/resources/main if the running Spring process serves stale mypage assets, and do not touch jeju-web directly.`
- status: `frozen`
- path: `SEED.mypage-support-icon-path-fix-v1.yaml`
- revision: `v1`
- note: `Investigation reproduced that the mypage support cards request /pages/mypage/assets/support_qna.png on local Spring :8080, which returns 404, while /front-mirror/pages/mypage/assets/support_qna.png returns 200. This slice is limited to fixing that asset-path contract without widening into unrelated mypage changes.`

## Reviewer

- reviewer: `reviewer_mypage_support_icons`
- reviewer_target: `mypage support icon asset-path contract, local Spring dashboard rendering path, derived artifact scope, and mirror boundary`
- reviewer_focus: `support icon src correctness, spring host-only asset resolution, derived mypage asset scope, mirror boundary`

## Last Update

- timestamp: `2026-03-26 16:48:00 +09:00`
- note: `Completed the mypage support-icon path fix in front source, regenerated the affected mypage runtime and jeju-spring mirror/build resources, and got a reviewer pass with no blocking findings. The remaining gap is live HTTP verification on :8080 because the local Spring server is currently down, so that verification block is being recorded separately in ERROR_LOG.md.`
