# STATE

## Current Task

- task: `Convert admin navigation to a single-load admin shell that enters once and switches sections without full page reloads`
- phase: `paused`
- scope: `STATE.md, MULTI_AGENT_LOG.md, SEED.admin-shell-single-load-v1.yaml, front/admin/pages/**, front/admin/js/**, optional ERROR_LOG.md append-only`
- verification_target: `After entering admin once, sidebar menu switches sections inside the same admin shell without full document reload, shared auth/sidebar/theme state is initialized once, and section content lazy-loads or hydrates without breaking current admin ownership or redirects`

## Route

- route: `Route B`
- reason: `The goal, scope, and verification target changed materially from the previous admin latency patch. This is a larger architecture slice across multiple front/admin pages and scripts that needs a frozen contract, worker delegation, and reviewer validation. The concrete trigger is the user-approved move to a single-load admin shell so menu switches stop doing full page reloads.`

## Writer Slot

- owner: `main`
- write_sets:
  - `main`: `STATE.md, MULTI_AGENT_LOG.md`
  - `worker_seed_admin_shell`: `SEED.admin-shell-single-load-v1.yaml`
  - `worker_admin_shell_js`: `front/admin/js/auth_guard.js, front/admin/js/api_client.js, front/admin/js/dashboard.js, front/admin/js/lodging.js, front/admin/js/members.js, front/admin/js/cms.js, front/admin/js/reservations.js, front/admin/js/rbac_config.js, front/admin/js/sidebar_ui.js, optional new front/admin/js/admin_shell.js`
  - `worker_admin_shell_pages`: `front/admin/pages/dashboard.html, front/admin/pages/lodging.html, front/admin/pages/members.html, front/admin/pages/cms.html, front/admin/pages/reservations.html`
- note: `Route B planner-only main. The admin shell refactor is front/admin only because jeju-spring and jeju-web stay out of scope, and the write sets are split into seed, JS runtime, and HTML entrypoint ownership to avoid overlap.`

## Contract Freeze

- contract_freeze: `Keep the admin IA, route ownership, and front-only source of truth intact. Do not touch jeju-spring, jeju-web, generated assets, or route constants. Enter admin through one shell runtime that initializes auth/sidebar/theme once, keep direct entry to existing admin page URLs working, and switch admin sections inside the shell without full page reloads while preserving current payload shapes and redirect safety.`

- status: `frozen`
- path: `SEED.admin-shell-single-load-v1.yaml`
- revision: `v1`
- note: `Frozen single-load admin shell contract ready for implementation.`

- reviewer: `reviewer_admin_latency`
- reviewer_target: `front/admin/js/**, front/admin/pages/**`
- reviewer_focus: `No broken direct entry to existing admin URLs, no broken auth redirect behavior, no mirror-boundary violation, and no section-switch regression after the single-load admin shell refactor`

## Last Update

- timestamp: `2026-03-24 20:52:00 +09:00`
- note: `Paused for handoff. The workspace now contains a new front/admin/js/admin_shell.js shell runtime, and all five admin HTML entrypoints point at that shared bootstrap instead of page-specific boot scripts. Remaining work in the next environment is to review the section JS diffs carefully, verify direct entry for every admin URL, verify same-document section switching plus popstate/history behavior, run reviewer/mechanical checks, and then either fix regressions or close the Route B task.`
