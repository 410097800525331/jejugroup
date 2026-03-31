# STATE

## Current Task

- task: `Make the weather API read the OpenWeather key more robustly at runtime`
- phase: `implementation`
- scope: `jeju-spring/src/main/java/com/jejugroup/jejuspring/weather/WeatherService.java`
- verification_target: `The weather API no longer fails solely because the typed app config is empty when OPENWEATHER_API_KEY is present via env or JVM properties, and the existing weather endpoints still behave the same otherwise.`

## Route

- route: `Route A`
- reason: `The user narrowed the work to a small single-service weather runtime fix that stays inside WeatherService without changing shared shell behavior, routes, mirrors, or test files, so one local write lane is sufficient.`

## Writer Slot

- owner: `main`
- write_set: `STATE.md, jeju-spring/src/main/java/com/jejugroup/jejuspring/weather/WeatherService.java`
- write_sets:
  - `main`: `STATE.md, jeju-spring/src/main/java/com/jejugroup/jejuspring/weather/WeatherService.java`
- note: `This hotfix stays in one backend lane because it only hardens OpenWeather key resolution in the weather service without touching mirrors or frontend source.`

## Contract Freeze

- contract_freeze: `Keep the weather API contract and upstream proxy behavior unchanged, but make WeatherService resolve the OpenWeather API key safely from the existing typed config plus direct runtime fallbacks such as environment variables or JVM properties so deployments do not fail when only the binding path is empty.`

## Seed

- status: `not_applicable`
- path: `n/a`
- revision: `n/a`
- note: `This is a tiny one-file runtime hotfix, so a separate seed artifact is unnecessary.`

## Reviewer

- reviewer: `not_assigned`
- reviewer_target: `n/a`
- reviewer_focus: `Route A single-lane hotfix; main will verify that only weather key resolution changed and the existing weather tests still pass.`

## Last Update

- timestamp: `2026-03-31 16:30:00 +09:00`
- note: `Reclassified the task to a tiny Route A backend weather hotfix after the user narrowed the request to fixing the weather API runtime only.`
