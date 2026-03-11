# Repository Expectations: jejugroup

## 0. Transition Context
- Before touching frontend, webapp mirror, backup, build, or deploy flows, read `docs/transition-architecture.md`
- This repository is in a temporary transition phase: React migration is still in progress while backend development continues in parallel
- `front` is the only human-edited frontend source of truth
- `jeju-web/src/main/webapp` is a deployment mirror used for JSP conversion and WAR packaging
- `front/backup` is a temporary visual recovery reference during migration and must not be deleted or treated as dead code unless the task explicitly covers that cleanup

## ⚡ 1. Frontend Development Patterns
- **Composition**: Favor Composition over Inheritance.
- **State**: Avoid prop drilling. Use Context + Reducer.
- **Performance**: Mandatory `useMemo`, `useCallback`, and code splitting.
- **Aesthetics**: Awwwards/FWA grade. Liquid layouts, glassmorphism, micro-animations.

## 🛠 2. Project Standards
- **Manager**: Strictly use `pnpm`.
- **Styling**: Vanilla CSS only. No ad-hoc utilities.
- **Verification**: Run `pnpm run lint` and `pnpm test` before any PR/Commit.

## 📂 3. Maintenance
- **Cohesion**: High cohesion, low coupling.
- **Docs**: Update `docs/` for any behavioral changes.
