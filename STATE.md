# STATE

## Current Task

- task: `CustomerCenterIntegrationTests jsonPath length matcher follow-up`
- phase: `implementation`
- scope: `jeju-spring/src/test/java/com/jejugroup/jejuspring/customercenter/CustomerCenterIntegrationTests.java only`
- verification_target: `targeted test assertion rewrite and spring:test replay for the two failing cases`

## Route

- route: `Route A`
- reason: `Single test file follow-up with two assertion rewrites and no multi-file fan-out.`

## Writer Slot

- owner: `main`
- write_sets:
  - `main`: `STATE.md, jeju-spring/src/test/java/com/jejugroup/jejuspring/customercenter/CustomerCenterIntegrationTests.java`
- note: `main may edit the test directly on Route A; keep the change inside the single-file write set.`

## Contract Freeze

- contract_freeze: `Frozen on 2026-03-24 03:30:00 +09:00 via SEED.admin-schema-domain-refactor-v1.yaml`

## Seed

- status: `frozen`
- path: `SEED.admin-schema-domain-refactor-v1.yaml`
- revision: `1`
- note: `The frozen seed keeps bookings-common and payment-common tables, renames stay-domain generic tables to hotel_* names, adds flight/rentcar/special/usim/admin support tables, and requires clear front/admin path comments.`

## Reviewer

- reviewer: `n/a`
- reviewer_target: `n/a`
- reviewer_focus: `n/a`

## Last Update

- timestamp: `2026-03-24 11:18 +09:00`
- note: `Reclassified the task as a Route A single-file test assertion follow-up for customer center integration tests.`
