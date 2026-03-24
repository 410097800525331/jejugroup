# STATE

## Current Task

- task: `Document the admin-facing schema as a table summary plus ERD`
- phase: `implement`
- scope: `docs/admin-schema-table-erd.md only`
- verification_target: `the doc shows domain-grouped table summaries and a coherent mermaid ERD for the current admin-facing schema`

## Route

- route: `Route A`
- reason: `This is a single-file documentation pass with no code or migration edits.`

## Writer Slot

- owner: `main`
- write_sets:
  - `main`: `STATE.md, docs/admin-schema-table-erd.md`
- note: `Single-lane doc work. Existing schema/code changes remain untouched.`

## Contract Freeze

- contract_freeze: `Create one doc that summarizes the current admin-facing schema in tables and a mermaid ERD, based on the current renamed/additional tables and bookings-common principle.`

## Seed

- status: `not used`
- path: `n/a`
- revision: `n/a`
- note: `Seed skipped because this is a single-file documentation task.`

## Reviewer

- reviewer: `none`
- reviewer_target: `n/a`
- reviewer_focus: `n/a`

## Last Update

- timestamp: `2026-03-24 11:55:00 +09:00`
- note: `User requested a table+ERD doc for the current admin-facing schema.`
