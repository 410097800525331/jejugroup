# STATE

## Current Task

- task: `Fix the shared shell header parity bug so auth/main-shell pages initialize the same admin utility and login-route state on front:3001 and spring:8080`
- phase: `completed`
- scope: `STATE.md, MULTI_AGENT_LOG.md, shared shell runtime contract for header auth-sync timing and main-vs-stay login route handling, front/apps/shell/src/runtime/layout/header.ts, front/apps/shell/src/runtime/layout/shellMount.tsx, and targeted browser verification on auth and representative host-only pages`
- verification_target: `front:3001 and spring:8080 produce the same header utility/admin/login-link behavior on /pages/auth/login.html, /pages/auth/signup.html, and representative host-only pages after the shared shell runtime fix`

## Route

- route: `Route B`
- reason: `This is a new task after the census close-out. It touches shared shell runtime behavior under front/apps/shell, which is a repository hard-trigger boundary, and it changes cross-page header behavior rather than a single page file. Route B is required for a frozen contract, worker-owned implementation, and reviewer verification.`

## Writer Slot

- owner: `main`
- write_sets:
  - `main`: `STATE.md, MULTI_AGENT_LOG.md`
  - `worker_seed`: `SEED.auth-header-shell-parity-v1.yaml`
  - `worker_shell_header_parity`: `front/apps/shell/src/runtime/layout/header.ts, front/apps/shell/src/runtime/layout/shellMount.tsx`
  - `reviewer_shell_header_parity`: `review only`
- note: `Route B planner-only main. The shared shell fix is confined to one worker-owned runtime slice before targeted browser verification and reviewer close-out.`

## Contract Freeze

- contract_freeze: `The fix is limited to shared shell header runtime behavior. It must make auth/main-shell pages run the same header auth sync/admin utility initialization on front:3001 and spring:8080, and it must stop the main-shell login button from being rewritten to stay-shell routing. No page-specific HTML edits, no docs rewrites, and no unrelated shell redesign are allowed in this slice.`

- status: `frozen`
- path: `SEED.auth-header-shell-parity-v1.yaml`
- revision: `v1`
- note: `The census already identified the auth/main-shell header divergence. This new shared-runtime fix is now frozen as a separate implementation slice.`

- reviewer: `reviewer_shell_header_parity`
- reviewer_target: `shared shell header auth-sync timing and login-route correctness`
- reviewer_focus: `No regression to shared shell mounting, no incorrect shell parameter rewrite on main-shell auth pages, and no remaining unexplained front:3001 vs spring:8080 header divergence on the targeted routes`

## Last Update

- timestamp: `2026-03-25 16:03:00 +09:00`
- note: `Completed the shared-shell header parity fix. front:3001 and spring:8080 now match on auth-page admin utility visibility and main-shell login routing in fresh browser sessions, and the reviewer found no blocking issue.`
