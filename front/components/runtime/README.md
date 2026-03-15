이 디렉터리는 개발 원본이 아니다.

- 개발 중 런타임은 `pnpm run dev:front` 에서 소스로 직접 연결된다.
- 빌드 산출물은 `.generated/front/components/runtime` 에 생성된다.
- 배포 미러 동기화 시 generated runtime 이 webapp 으로 덮어써진다.
