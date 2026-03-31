function failLegacySync() {
  console.error('[sync-front] legacy jeju-web sync는 기본 워크플로우에서 금지됐다.');
  console.error('[sync-front] jeju-spring 대상 기본 동기화는 `pnpm run sync` 또는 `node scripts/spring/sync-front-assets-to-spring.cjs`를 사용해라.');
  console.error('[sync-front] jeju-web/src/main/webapp 는 레거시 downstream mirror라서 이 스크립트는 더 이상 실행하지 않는다.');
  process.exit(1);
}

if (require.main === module) {
  failLegacySync();
}

module.exports = failLegacySync;
