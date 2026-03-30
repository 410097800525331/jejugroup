# STATE

## Current Task

- task: `Fix admin CMS banner visibility drift and move managed banner images to external storage`
- phase: `completed`
- scope: `external banner asset folder alignment between repo-root .tmp and jeju-spring runtime .tmp, served-path runtime verification, STATE.md, MULTI_AGENT_LOG.md, ERROR_LOG.md`
- verification_target: `Managed hero rows should keep served-path DB values and the actual external files must exist under the live Spring runtime upload root so /api/banners/assets/... returns 200.`

## Route

- route: `Route B`
- reason: `The new user report showed the hero images still render broken even though DB/API paths are correct; runtime inspection found the files were materialized under repo-root .tmp while the live Spring process serves from jeju-spring/.tmp, so the external asset files had to be realigned.`

## Writer Slot

- owner: `delegated`
- write_sets:
  - `main`: `STATE.md, MULTI_AGENT_LOG.md, ERROR_LOG.md`
  - `worker_banner_assets_runtime`: `.tmp/banner-assets/**, jeju-spring/.tmp/banner-assets/**`
- note: `This follow-up was a runtime asset realignment only: move the already-externalized managed hero files into the actual Spring upload root without changing the served-path contract.`

## Contract Freeze

- contract_freeze: `done`
- status: `seed_frozen`
- path: `docs/seeds/SEED.admin-banner-external-image-storage-v1.yaml`
- revision: `admin-banner-external-image-storage-v1`
- note: `Seed stays frozen. This follow-up only fixes the physical external-file location so the existing served-path contract works at runtime.`

## Reviewer

- reviewer: `assigned`
- reviewer_target: `reviewer_banner_runtime`
- reviewer_focus: `Managed hero images must physically exist under the live Spring upload root so /api/banners/assets/... resolves, without reintroducing repo/classpath fallback paths.`

## Last Update

- timestamp: `2026-03-30 23:44:00 +09:00`
- note: `Completed the runtime asset realignment: moved managed hero files into jeju-spring/.tmp/banner-assets, verified the live asset URL returns 200, and left DB values untouched.`
