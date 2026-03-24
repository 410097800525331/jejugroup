# STATE

## Current Task

- task: `Finish the Spring runtime cutover so root build/deploy, healthcheck, page hosting, and source-of-truth rules are aligned on jeju-spring`
- phase: `implementation`
- scope: `STATE.md, MULTI_AGENT_LOG.md, SEED.spring-final-runtime-cutover-v1.yaml, root build/deploy pipeline scripts, spring mirror pipeline, jeju-spring page-host controllers/templates/resources, transition/inventory docs, optional ERROR_LOG.md append if verification blockers appear`
- verification_target: `root pnpm build/deploy default to jeju-spring WAR, front changes flow into jeju-spring automatically, Spring-served/excluded page inventory is explicit, and jeju-web/src/main/webapp is no longer required for the default deployment path`

## Route

- route: `Route B`
- reason: `This cutover spans multiple directories and ownership lanes: root pipeline scripts, spring mirror/runtime files, and migration/inventory docs. It also needs contract freeze, worker delegation, and reviewer close-out before the deployment baseline can be called done.`

## Writer Slot

- owner: `main`
- write_sets:
  - `main`: `STATE.md, MULTI_AGENT_LOG.md, SEED.spring-final-runtime-cutover-v1.yaml, optional ERROR_LOG.md append-only`
  - `worker_pipeline_cutover`: `package.json, scripts/pipelines/**, scripts/utils/env.js, scripts/spring/**`
  - `worker_spring_entrypoints`: `jeju-spring/src/main/java/com/jejugroup/jejuspring/**, jeju-spring/src/main/resources/**, docs/**`
- note: `main stays planner-only for implementation. Worker ownership is disjoint between pipeline cutover and Spring page-host/inventory work.`

## Contract Freeze

- contract_freeze: `Promote jeju-spring to the default build/deploy runtime by making root build output a jeju-spring WAR, making deploy upload that spring artifact, fixing the default healthcheck to the Spring runtime, making front -> jeju-spring mirroring automatic in the default path, and explicitly classifying every remaining front HTML entrypoint as either Spring-served now or excluded from the final Spring runtime.`

## Seed

- status: `frozen`
- path: `SEED.spring-final-runtime-cutover-v1.yaml`
- revision: `v1`
- note: `The user already supplied the concrete checklist; this seed freezes it into execution-ready acceptance criteria before workers write implementation files.`

## Reviewer

- reviewer: `reviewer_spring_cutover`
- reviewer_target: `pipeline artifact path, healthcheck/deploy assumptions, Spring page-host coverage, mirror-boundary violations`
- reviewer_focus: `landing shell integrity, legacy route coverage, customer-center host availability, jejuair/oauth/admin declarations, jeju-web mirror dependency removal from the default path`

## Last Update

- timestamp: `2026-03-24 14:12:03 +09:00`
- note: `Root pnpm run build and pnpm run guard:text passed after the Spring cutover changes. Reviewer flagged and then cleared the customer-center mirror asset-path issue. pnpm run spring:test still fails on the pre-existing alwaysdata Flyway connection error before application tests execute.`
