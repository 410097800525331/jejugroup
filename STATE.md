# STATE

## Current Task

- task: `Fix local chatbot retrieval to prefer real FAQ answer lines and align membership expectations`
- phase: `implementation`
- scope: `jeju-spring/src/main/java/com/jejugroup/jejuspring/chat/**, jeju-spring/src/test/java/com/jejugroup/jejuspring/chat/**, STATE.md, MULTI_AGENT_LOG.md`
- verification_target: `ChatService uses runtime-loaded local Jeju Group knowledge, recent user turns only, and service-center FAQ matching returns the adjacent answer line for questions like web check-in while keeping Gemini-shaped JSON and no external AI calls.`

## Route

- route: `Route B`
- reason: `The task is a backend chatbot retrieval refinement with runtime-loaded local knowledge and test updates across service and test files, so the active task and verification target changed.`

## Writer Slot

- owner: `main`
- write_set: `STATE.md, MULTI_AGENT_LOG.md`
- write_sets:
  - `main`: `jeju-spring/src/main/java/com/jejugroup/jejuspring/chat/**, jeju-spring/src/test/java/com/jejugroup/jejuspring/chat/**`
- note: `Only the chatbot service and its tests are being changed in this refinement.`

## Contract Freeze

- contract_freeze: `Keep /api/chat backed by runtime-loaded local Jeju Group knowledge only, using the site HTML and service-center source data as knowledge inputs, ignore assistant/system messages in retrieval, compose Gemini-shaped JSON for the frontend, and avoid markdown emphasis markers in answers.`

## Seed

- status: `skipped`
- path: `n/a`
- revision: `n/a`
- note: `Scope was clarified in-thread and frozen directly in STATE for this Route B chatbot retrieval refinement task.`

## Reviewer

- reviewer: `assigned`
- reviewer_target: `reviewer_chat_local`
- reviewer_focus: `Local knowledge loading, FAQ answer-line selection, membership expectation alignment, and chat response contract stability`

## Last Update

- timestamp: `2026-03-31 22:28:00 +09:00`
- note: `Completed the local chatbot retrieval refinement, including FAQ answer-line selection and membership expectation alignment, with targeted chatbot tests passing.`
