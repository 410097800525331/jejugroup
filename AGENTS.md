# Workspace Override: jejugroup-landing

항공, 숙박, 인터시티 멤버십을 한 화면에서 소개하는 메인 랜딩 페이지다.

This file adds repository-specific rules on top of the global multi-agent defaults.
Global multi-agent defaults remain in effect unless this file narrows them.

## Repository Facts

- Package manager: pnpm
- Landing source of truth: front/**
- Deployment mirrors: jeju-spring/**, jeju-web/src/main/webapp/** (legacy mirror)
- Display name: Jeju Group Landing Page
- Page kind: hybrid-static-shell
- Primary entry: front/index.html
- Primary page URL: /index.html
- Locale: ko-KR
- Error log path: `ERROR_LOG.md`
- Source of truth: front
- Shell runtime: front/apps/shell
- Shared React components: front/components/react
- Authoring model: front is the only human-edited frontend source of truth
- Working style: hybrid static HTML + shell runtime + selective React islands
- Deployment goal: jeju-spring centered Spring Boot + Thymeleaf server deployment
- Current deployment base: jeju-spring final runtime baseline ROOT.war
- Task board path: `STATE.md`
- Multi-agent log path: `MULTI_AGENT_LOG.md`
- Error log path: `ERROR_LOG.md`

## Required Context Before Editing

- docs/transition-architecture.md
- docs/front-entrypoint-inventory.md
- docs/text-integrity-guardrails.md

## Shared Contracts

- Frontend source of truth remains front
- Route constants stay aligned with front/core/modules/constants/routes.module.js
- front is the only human-edited frontend source of truth
- jeju-spring is the default deployment/runtime mirror and jeju-web is the legacy compatibility mirror derived from front-led work
- Current env source of truth: jeju-spring/.env

## Shared Asset Paths

- front/index.html
- front/styles/globals.css
- front/core/pages/landing/main.js
- front/apps/shell/**
- front/components/react/layout/**
- front/components/react/widget/**
- front/core/modules/constants/routes.module.js

## Repo-Specific Hard Triggers

- Changing route constants or route ownership in front/core/modules/constants/routes.module.js
- Changing shared shell runtime behavior in front/apps/shell
- Touching deployment mirror path jeju-web/src/main/webapp
- Touching deployment mirror path jeju-spring

## Do-Not-Touch Paths

- jeju-web/src/main/webapp/**
- jeju-spring/**
- front/components/runtime/**
- front/.generated/**
- front/pages/**/assets/*.js
- front/pages/**/assets/*.css

## Manual Approval Zones

- alwaysdata 배포 스크립트 실행
- ROOT.war 패키징 또는 업로드 방식 변경
- jeju-web/src/main/webapp/** 또는 jeju-spring/** 직접 수정

## Worker Mapping

- worker_shell_runtime = front/apps/shell/**, front/core/modules/constants/routes.module.js
- worker_layout = front/components/react/layout/**
- worker_widget = front/components/react/widget/**
- worker_feature_landing = front/index.html, front/core/pages/landing/main.js, front/styles/globals.css

## Repository Overrides

- Role caps inherited from global defaults stay fixed
  `explorer 3`, `reviewer 2`, `worker up to 4 on Route B`
- Keep `STATE.md` updated with exact `route`, concrete `reason`, `writer_slot`, `contract_freeze`, and `write_sets` when Route B is active
- If multiple roles are used, append real participation to `MULTI_AGENT_LOG.md` before reporting that they ran
- Add repository-specific worker ownership, hard triggers, and approval zones here as they become clear
- Let this repository narrow Route A/B behavior further only when it truly needs stricter local rules

## Reviewer Focus

- landing shell header/footer mount integrity
- section hash navigation and top button behavior
- video transition CTA interception
- language toggle copy update
- mirror boundary violations

## Forbidden Patterns

- generic startup copy
- purple-heavy visuals
- removing Jeju Group orange as the primary accent
- turning the landing page into a pure React app without an explicit architecture decision

