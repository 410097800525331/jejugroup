# Repository Expectations: jejugroup

## 0. Hybrid Context
- Before touching frontend, webapp mirror, build, or deploy flows, read `docs/transition-architecture.md`
- This repository is operated as a fixed hybrid structure, not a full React migration target
- `jejuair` stays on the current static structure unless a task explicitly says otherwise
- `front` is the only human-edited frontend source of truth
- `jeju-web/src/main/webapp` is a deployment mirror used for JSP conversion and WAR packaging
- legacy backup folders have been removed from the active repo layout and must not be recreated casually

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
